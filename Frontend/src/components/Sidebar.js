import React from "react";

function Sidebar({ collapsed, setCollapsed, setActivePage, activePage }) {
  return (
    <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>

      {/* Collapse Button */}
      <button
        className="collapse-btn"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "➡️" : "⬅️"}
      </button>

      {/* Sidebar Title */}
      {!collapsed && <h3 className="sidebar-title">📊 Dashboard</h3>}

      {/* Menu Items */}
      <ul className="sidebar-menu">
        <li
          className={activePage === "home" ? "active" : ""}
          onClick={() => setActivePage("home")}
        >
          <span className="icon">🏠</span>
          {!collapsed && <span className="label">Home</span>}
        </li>

        <li
          className={activePage === "profile" ? "active" : ""}
          onClick={() => setActivePage("profile")}
        >
          <span className="icon">👤</span>
          {!collapsed && <span className="label">Profile</span>}
        </li>

        <li
          className={activePage === "charts" ? "active" : ""}
          onClick={() => setActivePage("charts")}
        >
          <span className="icon">📈</span>
          {!collapsed && <span className="label">Charts</span>}
        </li>

        <li
          className={activePage === "summary" ? "active" : ""}
          onClick={() => setActivePage("summary")}
        >
          <span className="icon">📅</span>
          {!collapsed && <span className="label">Weekly Summary</span>}
        </li>

        <li
          className={activePage === "sleep" ? "active" : ""}
          onClick={() => setActivePage("sleep")}
        >
          <span className="icon">😴</span>
          {!collapsed && <span className="label">Sleep</span>}
        </li>

        <li
          className={activePage === "steps" ? "active" : ""}
          onClick={() => setActivePage("steps")}
        >
          <span className="icon">🚶</span>
          {!collapsed && <span className="label">Steps</span>}
        </li>

        <li
          className={activePage === "stress" ? "active" : ""}
          onClick={() => setActivePage("stress")}
        >
          <span className="icon">🧠</span>
          {!collapsed && <span className="label">Stress</span>}
        </li>
        
        <li
  className={activePage === "download" ? "active" : ""}
  onClick={() => setActivePage("download")}
>
  <span className="icon">📄</span>
  {!collapsed && <span className="label">Download Report</span>}
</li>


   
   </ul>
    </aside>
  );
}

export default Sidebar;

