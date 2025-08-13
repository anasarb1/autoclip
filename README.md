# AutoClip (SaaS-style AI short video generator)

This is a free-tier MVP: **Next.js + Tailwind** frontend and **FastAPI** backend that
generates a short MP4 by combining Coqui TTS voiceover with a Pexels stock clip, and optional captions.

## Structure
```
autoclip/
  frontend/    # Vercel
  backend/     # Railway (Dockerfile included)
```

## Quick Start (Local)
1. **Backend**
   ```bash
   cd backend
   python -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   export PEXELS_API_KEY=YOUR_PEXELS_API_KEY
   uvicorn main:app --reload
   ```

2. **Frontend**
   ```bash
   cd ../frontend
   npm i
   # set your backend URL (local): 
   export NEXT_PUBLIC_API_BASE=http://localhost:8000
   npm run dev
   ```

Visit http://localhost:3000 — enter text, click **Generate Video**.

## Deploy

### Backend → Railway (recommended via Dockerfile)
- Push this repo to GitHub
- On Railway: **New Project → Deploy from GitHub → backend/** root
- Railway will use the included **Dockerfile** (installs ffmpeg, runs uvicorn)
- Add env var: **PEXELS_API_KEY**
- Get the public URL (example: `https://autoclip.up.railway.app`)

### Frontend → Vercel
- Import **frontend/** from GitHub in Vercel
- Set env var **NEXT_PUBLIC_API_BASE** to your Railway URL (e.g. `https://autoclip.up.railway.app`)
- Deploy

## Notes
- CORS is open (`*`) in backend for convenience; lock it to your Vercel domain later.
- Captions are a single 5s block; extend to timed segments if you want.
- Coqui TTS downloads its model on first run; the first generation may take longer.
