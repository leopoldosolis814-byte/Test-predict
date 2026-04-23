# Validador de Ideas IA 🚀

Analiza tu idea de negocio contra posts reales de Reddit usando IA.

## Stack
- **Next.js 14** (Pages Router)
- **Tailwind CSS**
- **Groq API** (LLaMA 3.1 8B) — análisis de IA
- **Reddit API** — posts relacionados
- **Formspree** — captura de emails

---

## Deploy en Vercel (5 minutos)

### 1. Subí el código a GitHub
```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/TU_USUARIO/idea-validator.git
git push -u origin main
```

### 2. Importá en Vercel
- Entrá a [vercel.com](https://vercel.com) → New Project
- Seleccioná tu repo
- Framework: **Next.js** (auto-detectado)

### 3. Agregá la variable de entorno
En Vercel → Settings → Environment Variables:
```
GROQ_API_KEY = tu_api_key_de_groq
```
Conseguís tu key gratis en: https://console.groq.com

### 4. Deploy
Clic en **Deploy** — listo en ~2 minutos.

---

## Desarrollo local

```bash
npm install
cp .env.example .env.local
# Editá .env.local con tu GROQ_API_KEY
npm run dev
```

Abrí http://localhost:3000

---

## Estructura

```
pages/
  index.js          ← Frontend completo (React)
  api/
    analizar.js     ← Backend: Reddit + Groq
styles/
  globals.css       ← Tailwind base
```

## Qué hace el backend

1. Busca posts en el subreddit elegido vía Reddit API pública
2. Manda los posts + la idea a Groq (LLaMA 3.1 8B)
3. Devuelve análisis + posts + badge de nivel al frontend

## Notas

- Reddit puede tardar o fallar: el análisis igual se genera sin posts
- El User-Agent en el fetch a Reddit es obligatorio (sin él, devuelve 403)
- Los emails van a Formspree (gratis hasta 50/mes), cambiá el endpoint si querés más
