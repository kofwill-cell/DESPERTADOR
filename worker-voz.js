// Couch Personal — Servicio de voz (Cloudflare Worker)
// Proxy que genera la voz premium con Gemini usando TU clave (guardada como secreto),
// para que los usuarios de la app NO tengan que ingresar ninguna clave.
//
// Cómo desplegarlo: ver GUIA-VOZ-PROXY.md (10 minutos, gratis).

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
    if (req.method !== "POST")
      return new Response("Usa POST", { status: 405, headers: CORS });

    try {
      const { text, voice } = await req.json();
      if (!text || !text.trim())
        return new Response("Falta 'text'", { status: 400, headers: CORS });

      const v = voice || "Puck";
      const styled =
        "Di lo siguiente en español, con tono cálido, enérgico y motivador, " +
        "como un coach personal despertando a alguien con entusiasmo. Marca énfasis " +
        "en las exclamaciones y baja el ritmo al mencionar la agenda:\n\n" + text;

      const models = ["gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts"];
      let data = null, lastErr = "";
      for (const model of models) {
        const r = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: styled }] }],
              generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: v } } },
              },
            }),
          }
        );
        if (r.ok) { data = await r.json(); break; }
        lastErr = r.status;
        if (r.status !== 404) break; // 404 = modelo renombrado, prueba el siguiente
      }
      if (!data)
        return new Response("Error de voz: " + lastErr, { status: 502, headers: CORS });

      const part = data.candidates[0].content.parts.find((p) => p.inlineData);
      const b64 = part.inlineData.data;
      const rateM = (part.inlineData.mimeType || "").match(/rate=(\d+)/);
      const rate = rateM ? +rateM[1] : 24000;

      // base64 -> PCM -> WAV
      const bin = atob(b64);
      const pcm = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) pcm[i] = bin.charCodeAt(i);
      const wav = pcmToWav(pcm, rate);

      return new Response(wav, {
        headers: { ...CORS, "Content-Type": "audio/wav", "Cache-Control": "no-store" },
      });
    } catch (e) {
      return new Response("Error: " + e.message, { status: 500, headers: CORS });
    }
  },
};

function pcmToWav(pcm, rate) {
  const header = new ArrayBuffer(44);
  const v = new DataView(header);
  const ws = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  ws(0, "RIFF"); v.setUint32(4, 36 + pcm.length, true); ws(8, "WAVE"); ws(12, "fmt ");
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  ws(36, "data"); v.setUint32(40, pcm.length, true);
  const out = new Uint8Array(44 + pcm.length);
  out.set(new Uint8Array(header), 0);
  out.set(pcm, 44);
  return out;
}
