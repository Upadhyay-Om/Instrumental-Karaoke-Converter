import { useState } from "react";
import { Play, Clock, Mic2, Loader } from "lucide-react";

const GENRES = ["Pop", "Rap", "EDM", "Lo-fi", "Rock", "Jazz", "R&B", "Classical"];

export default function MainContent({
  songs,
  onGenerate,
  onSelectSong,
  currentSong,
  isGenerating,
}) {
  const [lyrics, setLyrics] = useState("");
  const [genre, setGenre] = useState("Pop");

  function handleSubmit(e) {
    e.preventDefault();
    if (!lyrics.trim() || isGenerating) return;
    onGenerate(lyrics.trim(), genre);
  }

  return (
    <main className="main-content">
      {/* Hero */}
      <section className="hero">
        <div className="hero-gradient"></div>
        <div className="hero-inner">
          <div className="hero-cover">
            <Mic2 size={48} color="#000" />
          </div>
          <div className="hero-info">
            <span className="hero-label">AI MUSIC GENERATOR</span>
            <h1 className="hero-title">Create Your Song</h1>
            <p className="hero-subtitle">
              Enter lyrics and pick a genre — AI does the rest.
            </p>
          </div>
        </div>
      </section>

      {/* Generation Form */}
      <section className="generate-form-section">
        <form className="generate-form" onSubmit={handleSubmit}>
          <textarea
            className="lyrics-input"
            placeholder="Type your lyrics here…"
            rows={4}
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
          />
          <div className="form-row">
            <select
              className="genre-select"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="generate-btn"
              disabled={isGenerating || !lyrics.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader size={18} className="spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Play size={18} />
                  Generate Song
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Song Table */}
      <section className="song-table-section">
        {songs.length === 0 ? (
          <p className="empty-state">
            No songs yet. Generate your first track above!
          </p>
        ) : (
          <table className="song-table">
            <thead>
              <tr>
                <th className="song-th-num">#</th>
                <th className="song-th-title">Title</th>
                <th className="song-th-artist">Genre</th>
                <th className="song-th-duration">
                  <Clock size={16} />
                </th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, i) => (
                <tr
                  key={song.id}
                  className={`song-row ${currentSong?.id === song.id ? "song-row-active" : ""}`}
                  onClick={() => onSelectSong(song)}
                >
                  <td className="song-td-num">
                    {currentSong?.id === song.id ? (
                      <Play size={14} color="#1DB954" />
                    ) : (
                      i + 1
                    )}
                  </td>
                  <td className="song-td-title">{song.title}</td>
                  <td className="song-td-artist">{song.genre}</td>
                  <td className="song-td-duration">
                    {new Date(song.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
