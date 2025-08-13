import { useState } from "react";
import { motion } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://YOUR-BACKEND-URL";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Fake Text");
  const [duration, setDuration] = useState(30);
  const [captions, setCaptions] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generateVideo() {
    try {
      setLoading(true);
      setVideoUrl(null);
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("style", style);
      formData.append("duration", duration);
      formData.append("captions", captions);

      const res = await fetch(`${API_BASE}/generate`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Backend error");
      const blob = await res.blob();
      setVideoUrl(URL.createObjectURL(blob));
    } catch (e) {
      alert("Failed to generate video. Check backend URL and logs.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-6">
        <img src="/logo.svg" alt="AutoClip Logo" className="w-10 h-10" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          AutoClip
        </h1>
      </div>

      {/* Subtitle */}
      <p className="text-gray-600 mb-8 text-center max-w-lg">
        Turn your ideas into viral short-form videos with AI — instantly.
      </p>

      {/* Input Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your script..."
          className="w-full h-28 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          {/* Style Selector */}
          <div className="flex-1">
            <label className="block text-gray-600 mb-1">Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option>Fake Text</option>
              <option>Reddit Story</option>
              <option>Split Screen</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-600 mb-1">Duration (sec)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              min={5} max={180}
            />
          </div>
        </div>

        {/* Captions Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={captions}
            onChange={(e) => setCaptions(e.target.checked)}
            className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-300 rounded"
          />
          <label className="text-gray-700">Add captions</label>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateVideo}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-200"
        >
          {loading ? "Generating..." : "Generate Video"}
        </button>
      </div>

      {/* Video Preview */}
      {videoUrl && (
        <motion.div
          className="mt-8 w-full max-w-2xl bg-white shadow-lg rounded-xl p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <video src={videoUrl} controls className="w-full rounded-lg" />
          <a
            href={videoUrl}
            download="autoclip_video.mp4"
            className="block mt-4 text-center bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Download Video
          </a>
        </motion.div>
      )}
    </div>
  );
}
