import { Search, User } from "lucide-react";

export default function Topbar() {
  return (
    <header className="topbar">
      {/* Search */}
      <div className="topbar-search">
        <Search size={18} className="topbar-search-icon" />
        <input
          type="text"
          placeholder="What do you want to generate?"
          className="topbar-search-input"
        />
      </div>

      {/* Profile */}
      <button className="topbar-profile">
        <User size={18} />
      </button>
    </header>
  );
}
