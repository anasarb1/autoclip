import os, tempfile, requests, subprocess
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pexels_api import API
from TTS.api import TTS
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AutoClip Backend")

# CORS (open for MVP; restrict to your Vercel origin in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PEXELS_KEY = os.getenv("PEXELS_API_KEY")
pexels_api = API(PEXELS_KEY) if PEXELS_KEY else None

# Lightweight English TTS model
tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC", progress_bar=False, gpu=False)

@app.get("/")
def root():
    return {"status": "ok", "service": "autoclip-backend"}

@app.post("/generate")
async def generate_video(
    prompt: str = Form(...),
    style: str = Form("Fake Text"),
    duration: int = Form(30),
    captions: bool = Form(True)
):
    try:
        if not pexels_api:
            return JSONResponse({"error": "PEXELS_API_KEY missing"}, status_code=500)

        work_dir = tempfile.mkdtemp()

        # 1) TTS → WAV
        voice_path = os.path.join(work_dir, "voice.wav")
        tts.tts_to_file(text=prompt, file_path=voice_path)

        # 2) Pexels search → download first video file
        pexels_api.search(style, page=1, results_per_page=1)
        videos = pexels_api.get_entries()
        if not videos:
            return JSONResponse({"error": f"No Pexels results for style '{style}'"}, status_code=404)
        video_url = videos[0].video_files[0].link
        video_path = os.path.join(work_dir, "clip.mp4")
        with requests.get(video_url, stream=True, timeout=60) as r:
            r.raise_for_status()
            with open(video_path, "wb") as f:
                for chunk in r.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)

        # 3) Optional simple captions (single 5s block)
        captions_path = os.path.join(work_dir, "captions.srt")
        if captions:
            with open(captions_path, "w", encoding="utf-8") as f:
                f.write("1\n00:00:00,000 --> 00:00:05,000\n" + prompt + "\n")

        # 4) Merge with FFmpeg (burn captions if enabled)
        output_path = os.path.join(work_dir, "final.mp4")
        cmd = ["ffmpeg", "-y", "-i", video_path, "-i", voice_path, "-map", "0:v", "-map", "1:a",
               "-c:v", "libx264", "-c:a", "aac", "-shortest"]
        if captions:
            cmd[6:6] = ["-vf", f"subtitles={captions_path}"]
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        return FileResponse(output_path, media_type="video/mp4", filename="autoclip_video.mp4")

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
