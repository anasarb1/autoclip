# AutoClip (SaaS-style AI short video generator)

This is a free-tier MVP: **Next.js + Tailwind** frontend and **FastAPI** backend that
generates a short MP4 by combining Coqui TTS voiceover with a Pexels stock clip, and optional captions.

## Structure
```
autoclip/
  frontend/    # Vercel
  backend/     # Vercel
```

## Quick Start (Local)
1. **Backend**
   ```bash
   cd backend
   python -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   export OPENAI_API_KEY=YOUR_OPENAI_API_KEY
   export PEXELS_API_KEY=YOUR_PEXELS_API_KEY
   export COQUI_API_KEY=YOUR_COQUI_API_KEY # Optional
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

### Backend → Vercel
- Import **backend/** from GitHub in Vercel
- Add env vars:
  - `OPENAI_API_KEY` = YOUR_OPENAI_API_KEY
  - `PEXELS_API_KEY` = YOUR_PEXELS_API_KEY
  - `COQUI_API_KEY` = YOUR_COQUI_API_KEY (optional)
- Public URL: https://autoclip-backend-w63v.vercel.app

### Frontend → Vercel
- Import **frontend/** from GitHub in Vercel
- Set env var `NEXT_PUBLIC_API_BASE` to your backend URL (e.g. `https://autoclip-backend-w63v.vercel.app`)
- Public URL: https://autoclip-w63v.vercel.app

## Notes
- CORS is open (`*`) in backend for convenience; lock it to your Vercel domain later.
- Captions are a single 5s block; extend to timed segments if you want.
- Coqui TTS downloads its model on first run; the first generation may take longer.


