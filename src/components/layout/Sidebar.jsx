import { Home, Mic2, Library, Music } from "lucide-react";

const menuItems = [
  { icon: Home, label: "Home" },
  { icon: Mic2, label: "Generate" },
  { icon: Library, label: "Library" },
];

export default function Sidebar({ songs, onSelectSong, currentSong }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Music size={28} color="#1DB954" />
        <span>MusicGen</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <a key={item.label} href="#" className="sidebar-nav-item">
            <item.icon size={20} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Divider */}
      <div className="sidebar-divider"></div>

      {/* Song List */}
      <div className="sidebar-songs">
        <p className="sidebar-songs-title">Your Songs</p>
        {songs.length === 0 ? (
          <p className="sidebar-empty">No songs yet</p>
        ) : (
          <ul>
            {songs.map((song) => (
              <li
                key={song.id}
                className={`sidebar-song-item ${currentSong?.id === song.id ? "sidebar-song-active" : ""}`}
                onClick={() => onSelectSong(song)}
              >
                <Music size={14} />
                <span>{song.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
