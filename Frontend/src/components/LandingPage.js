import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-root">

      {/* NAVBAR */}
      <nav className="landing-nav">
        <div className="nav-inner">
          <h2 className="brand">Smart Health Tracker</h2>
          <button className="nav-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Health tracking <br />
            made intelligent.
          </h1>

          <p>
            Monitor vitals, sleep, stress, and activity with a
            clean dashboard designed for clarity and insight.
          </p>

          <button className="primary-btn" onClick={() => navigate("/login")}>
            Get Started
          </button>
        </div>

        <div className="hero-glass"></div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <h2>Everything you need. Nothing you don’t.</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Vitals</h3>
            <p>Heart rate, oxygen, temperature, respiration.</p>
          </div>

          <div className="feature-card">
            <h3>Sleep</h3>
            <p>Sleep quality, freshness, screen-free habits.</p>
          </div>

          <div className="feature-card">
            <h3>Stress</h3>
            <p>Emotional load, energy, workload triggers.</p>
          </div>

          <div className="feature-card">
            <h3>Activity</h3>
            <p>Steps, calories, terrain, footwear impact.</p>
          </div>
        </div>
      </section>

      {/* INSIGHT SECTION */}
      <section className="insight-section">
        <div className="insight-text">
          <h2>Designed for clarity</h2>
          <p>
            Smart Health presents your data in a calm, focused
            interface inspired by modern health platforms.
            No distractions. Just insights.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Start understanding your health</h2>
        <button className="primary-btn" onClick={() => navigate("/login")}>
          Create your dashboard
        </button>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <p>© 2026 Smart Health Tracker</p>
      </footer>
    </div>
  );
}

export default LandingPage;

