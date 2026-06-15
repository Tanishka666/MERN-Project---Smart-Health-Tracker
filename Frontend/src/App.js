import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";

function App() {
  const [loggedIn, setLoggedIn] = useState(
  localStorage.getItem("loggedIn") === "true"
);

  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={
            loggedIn
              ? <Navigate to="/dashboard" replace />
              : <LoginPage setLoggedIn={setLoggedIn} />
          }
        />

        {/* PROTECTED DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            loggedIn
              ? <Dashboard setLoggedIn={setLoggedIn} />
              : <Navigate to="/login" replace />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
