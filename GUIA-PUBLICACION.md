# Guía de publicación — Couch Personal (Despertador)

Sigue estos 4 pasos en orden. Solo se hacen **una vez**. Tiempo estimado: 30–40 minutos.

---

## Paso 1 — Publicar la app en GitHub Pages (gratis)

1. Crea una cuenta gratis en **github.com** (si no tienes).
2. Arriba a la derecha pulsa **+** → **New repository**.
   - Nombre: `despertador` (o el que quieras)
   - Marca **Public** → **Create repository**.
3. En la página del repositorio pulsa **uploading an existing file** (o **Add file → Upload files**).
4. Arrastra los 5 archivos de la carpeta `despertador-app`:
   `index.html`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`
5. Pulsa **Commit changes**.
6. Ve a **Settings → Pages** (menú izquierdo).
   - En "Branch" elige **main** y carpeta **/ (root)** → **Save**.
7. Espera 1–2 minutos. Tu app quedará en:
   **`https://TU_USUARIO.github.io/despertador/`**

Abre esa dirección en el navegador de tu celular. ✅

---

## Paso 2 — Clave de Gemini (frases con IA, gratis)

1. En el celular o la computadora entra a **aistudio.google.com/apikey** con tu cuenta Google.
2. Pulsa **Crear clave de API** → copia la clave (empieza con `AIza...`).
3. En la app, abre la sección **🧠 IA** → pega la clave → pulsa **Probar conexión**.
   - Si da error, cambia el modelo a `gemini-2.0-flash` y prueba de nuevo.
4. La clave se guarda **solo en tu teléfono** (no se sube a ningún lado).

---

## Paso 3 — Inicio de sesión con Google Calendar

Esto requiere registrar la app ante Google (gratis, es tu propia app):

1. Entra a **console.cloud.google.com** con tu cuenta Google.
2. Arriba, crea un proyecto nuevo: **Select a project → New project** → nombre `despertador` → **Create**.
3. Busca **"Google Calendar API"** en la barra de búsqueda → **Enable** (habilitar).
4. Ve a **APIs & Services → OAuth consent screen**:
   - Tipo: **External** → **Create**.
   - Nombre de la app: `Couch Personal`, tu correo en los dos campos de correo → **Save**.
   - En "Audience/Test users" agrega tu propio correo (kofwill@gmail.com).
5. Ve a **APIs & Services → Credentials → + Create credentials → OAuth client ID**:
   - Tipo: **Web application**.
   - En **Authorized JavaScript origins** agrega: `https://TU_USUARIO.github.io`
   - **Create** → copia el **Client ID** (termina en `.apps.googleusercontent.com`).
6. Abre `index.html`, busca la línea:
   ```
   const GOOGLE_CLIENT_ID = "PEGA_AQUI_TU_CLIENT_ID.apps.googleusercontent.com";
   ```
   y reemplázala con tu Client ID. Vuelve a subir el archivo a GitHub (Paso 1.3).
7. En la app pulsa **Conectar con Google Calendar** → inicia sesión → listo.

> Alternativa sin nada de esto: en la misma sección hay una opción con la
> "URL secreta ICS" de tu calendario que funciona de inmediato.

---

## Paso 4 — Instalarla como app en el celular

**Android (Chrome):** abre tu dirección `https://TU_USUARIO.github.io/despertador/` → menú ⋮ → **Agregar a pantalla principal** / **Instalar app**.

**iPhone (Safari):** abre la dirección → botón Compartir → **Agregar a inicio**.

Quedará con su icono 🌅 como una app más.

---

## Limitación importante (léela)

Una app web **no puede sonar con la pantalla apagada o la app cerrada** — los
sistemas Android/iOS solo se lo permiten a apps nativas. Por eso la app incluye
la opción "mantener pantalla encendida": déjala abierta, con el celular
cargando, y la alarma funcionará de forma confiable.

Si tras probarla unos días la experiencia te convence, el siguiente paso natural
del proyecto es convertirla en app nativa (Flutter/React Native), donde la
alarma funciona con el teléfono bloqueado. Todo lo diseñado aquí (voz, IA,
calendario, clima) se reutiliza.
