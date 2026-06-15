import React from "react";

function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="navbar">
      <h2>Smart Health Tracker</h2>

      <button className="mode-btn" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    </nav>
  );
}

export default Navbar;

