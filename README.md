# AutoClip — AI Short-Form Video Generator (MVP)
Next.js + Tailwind frontend and FastAPI backend. Backend merges Coqui TTS voice with a Pexels stock clip and optional captions into MP4.

## Local Run
Backend:
  cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
  export PEXELS_API_KEY=YOUR_PEXELS_API_KEY && uvicorn main:app --reload
Frontend:
  cd frontend && npm i && NEXT_PUBLIC_API_BASE=http://localhost:8000 npm run dev

## Deploy
Backend → Railway (root=backend/), set env var PEXELS_API_KEY. Copy public URL.
Frontend → Vercel (root=frontend/), set NEXT_PUBLIC_API_BASE to backend URL (or bake into code).
