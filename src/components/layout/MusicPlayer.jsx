import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

export default function MusicPlayer({ currentSong, isPlaying, setIsPlaying }) {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  // When currentSong changes, load and play
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.src = currentSong.audioUrl;
    audio.load();

    if (isPlaying) {
      audio.play().catch(() => {});
    }
  }, [currentSong]);

  // Sync play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Time tracking
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(formatTime(audio.currentTime));
      }
    };

    const onLoaded = () => setDuration(formatTime(audio.duration));
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
  }, [setIsPlaying]);

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  function togglePlay() {
    if (!currentSong) return;
    setIsPlaying((p) => !p);
  }

  function handleSeek(e) {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  }

  return (
    <footer className="player">
      <audio ref={audioRef} preload="metadata" />

      {/* Left — Song Info */}
      <div className="player-info">
        <div className="player-cover-small">
          <Play size={16} color="#1DB954" />
        </div>
        <div>
          <p className="player-song-title">
            {currentSong ? currentSong.title : "No song selected"}
          </p>
          <p className="player-song-artist">
            {currentSong ? currentSong.genre : "—"}
          </p>
        </div>
      </div>

      {/* Center — Controls */}
      <div className="player-controls">
        <div className="player-buttons">
          <button className="player-btn-secondary">
            <SkipBack size={18} />
          </button>
          <button className="player-btn-play" onClick={togglePlay}>
            {isPlaying ? <Pause size={22} /> : <Play size={22} />}
          </button>
          <button className="player-btn-secondary">
            <SkipForward size={18} />
          </button>
        </div>

        <div className="player-progress-row">
          <span className="player-time">{currentTime}</span>
          <div className="player-progress-bar" onClick={handleSeek}>
            <div
              className="player-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="player-time">{duration}</span>
        </div>
      </div>

      {/* Right — Volume */}
      <div className="player-volume">
        <Volume2 size={18} />
        <div className="player-volume-bar">
          <div className="player-volume-fill"></div>
        </div>
      </div>
    </footer>
  );
}
