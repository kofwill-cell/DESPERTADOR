# Guía — Servicio de voz compartido (proxy)

Con esto tus usuarios escuchan la voz premium **sin ingresar ninguna clave**.
Tú despliegas un pequeño servicio una sola vez. Gratis. ~10 minutos.

## Qué hace

La app le pide la voz a *tu* servicio (un "Cloudflare Worker"). Tu servicio usa
tu clave de Gemini (guardada en secreto, nadie la ve) y devuelve el audio.
El usuario final no configura absolutamente nada.

## Paso 1 — Crear cuenta en Cloudflare (gratis)

1. Entra a **dash.cloudflare.com/sign-up** y crea tu cuenta.
2. Confirma tu correo.

## Paso 2 — Crear el Worker

1. En el panel de Cloudflare, menú izquierdo → **Workers y Pages** → **Crear** → **Worker**.
2. Ponle un nombre, por ejemplo `voz-couch` → **Deploy** (despliega el ejemplo por defecto).
3. Pulsa **Editar código**.
4. Borra todo el código de ejemplo y pega el contenido completo de **`worker-voz.js`**.
5. Arriba a la derecha → **Deploy** (Guardar y desplegar).

## Paso 3 — Guardar tu clave de Gemini como secreto

1. En tu Worker → **Configuración (Settings)** → **Variables y secretos**.
2. **Agregar** → tipo **Secret** →
   - Nombre: `GEMINI_KEY`
   - Valor: tu clave de Gemini (la que empieza con `AIza`; la creas gratis en
     aistudio.google.com/apikey si no la tienes).
3. **Guardar y desplegar**.

## Paso 4 — Copiar la dirección del Worker

En la página del Worker verás su dirección, algo como:
`https://voz-couch.TU-USUARIO.workers.dev`

Cópiala. Esa es la dirección del servicio de voz.

## Paso 5 — Conectarla a la app

Dos formas:

**A) Fija para todos (recomendado):** en `index.html` busca la línea
`const PROXY_URL = "";` y pon tu dirección entre las comillas:
```
const PROXY_URL = "https://voz-couch.TU-USUARIO.workers.dev";
```
Vuelve a subir `index.html` a GitHub. Desde ese momento, TODOS los usuarios
tienen voz premium automática, sin tocar nada.

**B) Solo para ti (prueba rápida):** abre la app → tarjeta **Voz** → Avanzado →
pega la dirección en "Dirección del servicio de voz". Solo aplica a tu teléfono.

## Costo y límites

- Cloudflare Worker: gratis hasta 100.000 peticiones al día.
- La voz la genera Gemini con tu clave. El plan gratuito de Gemini alcanza para
  el uso diario de decenas de personas. Si creces mucho, revisa tu consumo en
  aistudio.google.com y decide si limitar o pasar a plan de pago.

## Seguridad (opcional, para más adelante)

Como el Worker es público, alguien podría llamarlo de más. Cuando tengas varios
usuarios conviene añadir un límite por día o una comprobación de origen. Avísame
y lo agregamos; para empezar no es necesario.
