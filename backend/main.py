import os
import tempfile
import subprocess
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pexels_api import API
from TTS.api import TTS
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AutoClip Backend")

# CORS (adjust for your Vercel domain after deploy)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PEXELS_KEY = os.getenv("PEXELS_API_KEY")
if not PEXELS_KEY:
    print("WARNING: PEXELS_API_KEY not set. Set env var in Railway.")
pexels_api = API(PEXELS_KEY) if PEXELS_KEY else None

# Light-weight English model; change if you want different voice
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
        work_dir = tempfile.mkdtemp()

        # 1) TTS voiceover
        voice_path = os.path.join(work_dir, "voice.wav")
        tts.tts_to_file(text=prompt, file_path=voice_path)

        # 2) Fetch stock video from Pexels
        if not pexels_api:
            return JSONResponse({"error": "PEXELS_API_KEY missing"}, status_code=500)
        pexels_api.search(style, page=1, results_per_page=1)
        videos = pexels_api.get_entries()
        if not videos:
            return JSONResponse({"error": "No videos found for style"}, status_code=404)
        # choose first available video file link
        video_url = videos[0].video_files[0].link
        video_path = os.path.join(work_dir, "clip.mp4")
        subprocess.run(["wget", "-q", "-O", video_path, video_url], check=True)

        # 3) Optional captions (very simple single-block demo)
        captions_path = os.path.join(work_dir, "captions.srt")
        if captions:
            # naive 5s caption; extend as needed
            with open(captions_path, "w", encoding="utf-8") as f:
                f.write("1\n00:00:00,000 --> 00:00:05,000\n" + prompt + "\n")

        # 4) Merge video + audio (+ captions)
        output_path = os.path.join(work_dir, "final.mp4")
        cmd = ["ffmpeg", "-y", "-i", video_path, "-i", voice_path, "-map", "0:v", "-map", "1:a",
               "-c:v", "libx264", "-c:a", "aac", "-shortest"]
        if captions:
            cmd[6:6] = ["-vf", f"subtitles={captions_path}"]
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        return FileResponse(output_path, media_type="video/mp4", filename="autoclip_video.mp4")
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
