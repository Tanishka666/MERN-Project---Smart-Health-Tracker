import React, { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import HomeSection from "./HomeSection";
import ChartsSection from "./ChartsSection";
import SummarySection from "./SummarySection";
import SleepSection from "./SleepSection";
import StepsSection from "./StepsSection";
import StressSection from "./StressSection";
import ProfileSection from "./ProfileSection";
import DownloadReport from "./DownloadReport";

function Dashboard({ setLoggedIn }) {

  // DARK MODE
  const [darkMode, setDarkMode] = useState(false);

  // SIDEBAR COLLAPSED STATE
  const [collapsed, setCollapsed] = useState(false);

  // ACTIVE PAGE
  const [activePage, setActivePage] = useState("home");

  // 🔁 WEEKLY SUMMARY REFRESH TRIGGER
  const [refreshWeekly, setRefreshWeekly] = useState(0);

  /* ================= LOGOUT HANDLER ================= */
  const onLogout = () => {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("sessionId");
  localStorage.removeItem("sessionStart");

  setLoggedIn(false);
  window.location.href = "/login";
};

  return (
    <div className={darkMode ? "page-wrapper dark" : "page-wrapper"}>

      {/* LOGOUT BUTTON */}
      <button
        className="logout-floating"
        onClick={onLogout}
      >
        Logout
      </button>

      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* MAIN CONTENT */}
      <div className={collapsed ? "content-area collapsed" : "content-area"}>

        {/* NAVBAR */}
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* PAGE SWITCHING */}
        {activePage === "profile" && (
        <ProfileSection setActivePage={setActivePage} />
        )}

        {activePage === "home" && <HomeSection />}

        {activePage === "charts" && (
        <ChartsSection
         setRefreshWeekly={setRefreshWeekly}
         setActivePage={setActivePage}
        />
       )}

        {activePage === "summary" && (
          <SummarySection refreshWeekly={refreshWeekly} />
        )}

        {activePage === "sleep" && (
        <SleepSection
        setRefreshWeekly={setRefreshWeekly}
        setActivePage={setActivePage}
        />
        )}

        {activePage === "steps" && (
        <StepsSection
        setRefreshWeekly={setRefreshWeekly}
        setActivePage={setActivePage}
        />
        )}

        {activePage === "stress" && (
        <StressSection
        setRefreshWeekly={setRefreshWeekly}
        setActivePage={setActivePage}
         />
        )}

        {activePage === "download" && <DownloadReport />}

      </div>
    </div>
  );
}

export default Dashboard;

