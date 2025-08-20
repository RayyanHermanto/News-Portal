import { useState } from "react";
import viteLogo from "/vite.svg";
import "./Navbar.css";

function Navbar({ onSearch }) {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      onSearch(query);       // kirim ke App
    }
    setIsSearching(false);   // balik ke tombol setelah submit
    setQuery("");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src="logo.png"
          alt="Logo"
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => window.location.reload()}
        />
        {/* <span className="brand">NewsPortal</span> */}
      </div>
      <div className="navbar-right">
        {isSearching ? (
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => setIsSearching(false)}
              className="search-input"
              placeholder="Cari berita..."
              autoFocus
            />
          </form>
        ) : (
          <button
            className="search-btn"
            onClick={() => setIsSearching(true)}
          >
            Search
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
