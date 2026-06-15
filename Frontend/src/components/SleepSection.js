import React, { useState, useEffect } from "react";
import axios from "axios";

function SleepSection({ setRefreshWeekly, setActivePage }){
  const [sleepHours, setSleepHours] = useState("");
  const [dreamQuality, setDreamQuality] = useState("");
  const [freshness, setFreshness] = useState("");
  const [lateMeal, setLateMeal] = useState("");
  const [screenFree, setScreenFree] = useState("");

  const [prediction, setPrediction] = useState(null);
  const [suggestion, setSuggestion] = useState("");

  // ================= PREDICTION =================
  useEffect(() => {
    if (!sleepHours || !dreamQuality || !freshness || !lateMeal || !screenFree) {
      setPrediction(null);
      return;
    }

    let score = 0;
    let risk = "Low";

    if (sleepHours < 6) score += 2;
    if (dreamQuality === "Bad") score += 1;
    if (freshness <= 4) score += 2;
    if (lateMeal === "Yes") score += 1;
    if (screenFree < 30) score += 1;

    if (score <= 1) risk = "Low";
    else if (score <= 3) risk = "Medium";
    else risk = "High";

    setPrediction(risk);

    if (risk === "High") {
      setSuggestion("High sleep risk. Reduce screen time and maintain 7–8 hours sleep.");
    } else if (risk === "Medium") {
      setSuggestion("Sleep is average. Improve consistency.");
    } else {
      setSuggestion("Great sleep pattern. Keep it up!");
    }
  }, [sleepHours, dreamQuality, freshness, lateMeal, screenFree]);

  // ================= SAVE DATA =================
  const saveSleepData = async () => {
    if (!sleepHours || !dreamQuality || !freshness || !lateMeal || !screenFree) {
      alert("Please fill all sleep fields before saving!");
      return;
    }

    const userId = localStorage.getItem("userId");
    console.log("UserId (Sleep):", userId);
    if (!userId) {
      alert("User not logged in");
      return;
    }

    try {
      const newEntry = {
        day: new Date().toLocaleDateString("en-US", { weekday: "short" }),
        sleepHours: Number(sleepHours),
        dreamQuality,
        freshness: Number(freshness),
        lateMeal,
        screenFree: Number(screenFree),
      };

      await axios.post("http://localhost:5000/api/vitals/save-sleep", {
        userId,
        sleep: newEntry.sleepHours,
        dreamQuality,
        freshness: newEntry.freshness,
        lateMeal,
        screenFree: newEntry.screenFree,
      });

     const existing =
  JSON.parse(localStorage.getItem(`sleepData_${userId}`)) || [];

existing.push(newEntry);

localStorage.setItem(
  `sleepData_${userId}`,
  JSON.stringify(existing)
);

      if (setRefreshWeekly) {
        setRefreshWeekly((prev) => prev + 1);
      }

      alert("Today's sleep data saved!");
      setActivePage("steps");
      setSleepHours("");
      setDreamQuality("");
      setFreshness("");
      setLateMeal("");
      setScreenFree("");

    } catch (err) {
      console.log(err);
      alert("Failed to save today's sleep data.");
    }
  };

  return (
    <div className="page-section">
      <h1>😴 Sleep Tracker</h1>
      <p>Monitor your sleep pattern for better health</p>

      <div className="sleep-card">

        {/* 💤 Sleep Hours */}
        <label>💤 Sleep Hours</label>
        <input
          type="number"
          value={sleepHours}
          onChange={(e) => setSleepHours(e.target.value)}
        />

        {/* 🌊 Wave Visual */}
        {sleepHours && (
          <div style={{
            marginTop: "10px",
            height: "80px",
            background: "#dbeafe",
            borderRadius: "10px",
            overflow: "hidden",
            position: "relative"
          }}>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                width: "200%",
                height: `${Math.min(sleepHours * 10, 80)}px`,
                background: "linear-gradient(180deg,#60a5fa,#2563eb)",
                borderRadius: "40%",
                animation: "waveMove 3s linear infinite"
              }}
            ></div>

            <style>{`
              @keyframes waveMove {
                0% { transform: translateX(-20%); }
                100% { transform: translateX(20%); }
              }
            `}</style>
          </div>
        )}

        {/* 🌈 Dream Quality */}
        <label>🌈 Dream Quality</label>
        <select value={dreamQuality} onChange={(e) => setDreamQuality(e.target.value)}>
          <option value="">Select</option>
          <option value="Good">😃 Good</option>
          <option value="Neutral">😐 Neutral</option>
          <option value="Bad">😞 Bad</option>
        </select>

        {dreamQuality && (
          <div style={{ marginTop: "8px", fontSize: "20px" }}>
            {dreamQuality === "Good" && "🟢😃"}
            {dreamQuality === "Neutral" && "🟡😐"}
            {dreamQuality === "Bad" && "🔴😞"}
          </div>
        )}

        {/* 🌅 Freshness */}
        <label>🌅 Morning Freshness (1–10)</label>
        <input
          type="number"
          value={freshness}
          onChange={(e) => setFreshness(e.target.value)}
        />

        {freshness && (
          <div style={{
            marginTop: "8px",
            height: "8px",
            background: "#e5e7eb",
            borderRadius: "6px"
          }}>
            <div style={{
              width: `${freshness * 10}%`,
              height: "8px",
              background: "#10b981",
              borderRadius: "6px"
            }}></div>
          </div>
        )}

        {/* 🍽 Late Meal */}
        <label>🍽 Late-night Meal?</label>
        <select value={lateMeal} onChange={(e) => setLateMeal(e.target.value)}>
          <option value="">Select</option>
          <option value="Yes">🍔 Yes</option>
          <option value="No">🥗 No</option>
        </select>

        {lateMeal && (
          <div style={{ marginTop: "8px" }}>
            {lateMeal === "Yes" ? "⚠️ Heavy before sleep" : "✅ Good habit"}
          </div>
        )}

        {/* 📵 Screen-free Time */}
        <label>📵 Screen-free Time (min)</label>
        <input
          type="number"
          value={screenFree}
          onChange={(e) => setScreenFree(e.target.value)}
        />

        {screenFree && (
          <div style={{
            marginTop: "8px",
            height: "8px",
            background: "#e5e7eb",
            borderRadius: "6px"
          }}>
            <div style={{
              width: `${Math.min(screenFree, 120) / 120 * 100}%`,
              height: "8px",
              background: "#3b82f6",
              borderRadius: "6px"
            }}></div>
          </div>
        )}

        {/* Prediction */}
        {prediction && (
          <div className="sleep-prediction-box">
            <h3>Risk: {prediction}</h3>
            <p>{suggestion}</p>
          </div>
        )}

        <button onClick={saveSleepData}>
          Save Today's Sleep Data
        </button>

      </div>
    </div>
  );
}

export default SleepSection;
