import { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import MainContent from "./components/layout/MainContent";
import MusicPlayer from "./components/layout/MusicPlayer";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch songs on mount
  useEffect(() => {
    fetch(`${API}/songs`)
      .then((r) => r.json())
      .then(setSongs)
      .catch(() => {});
  }, []);

  // Generate a new song
  async function handleGenerate(lyrics, genre) {
    setIsGenerating(true);
    try {
      const res = await fetch(`${API}/generate-song`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lyrics, genre }),
      });
      const song = await res.json();
      setSongs((prev) => [song, ...prev]);
      setCurrentSong(song);
      setIsPlaying(true);
    } catch (err) {
      console.error("Generate failed:", err);
    } finally {
      setIsGenerating(false);
    }
  }

  // Select a song to play
  function handleSelectSong(song) {
    setCurrentSong(song);
    setIsPlaying(true);
  }

  return (
    <div className="app-shell">
      <Sidebar songs={songs} onSelectSong={handleSelectSong} currentSong={currentSong} />
      <div className="app-main">
        <Topbar />
        <MainContent
          songs={songs}
          onGenerate={handleGenerate}
          onSelectSong={handleSelectSong}
          currentSong={currentSong}
          isGenerating={isGenerating}
        />
      </div>
      <MusicPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
    </div>
  );
}
