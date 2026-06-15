import React, { useState, useEffect } from "react";
import axios from "axios";

function StepsSection({ setRefreshWeekly, setActivePage }) {
  const [steps, setSteps] = useState("");
  const [calories, setCalories] = useState("");
  const [mood, setMood] = useState("");
  const [terrain, setTerrain] = useState("");
  const [footwear, setFootwear] = useState("");

  const [prediction, setPrediction] = useState(null);
  const [suggestion, setSuggestion] = useState("");

  // ================= PREDICTION =================
  useEffect(() => {
    if (
      steps === "" ||
      calories === "" ||
      mood === "" ||
      terrain === "" ||
      footwear === ""
    ) {
      setPrediction(null);
      return;
    }

    let score = 0;

    if (steps < 3000) score += 2;
    else if (steps < 7000) score += 1;

    // ✅ FIXED (no double counting)
    if (calories < 80) score += 2;
    else if (calories < 150) score += 1;

    if (mood === "Tired") score += 2;
    else if (mood === "Energetic") score -= 1;

    if (terrain === "Uphill") score -= 1;

    if (footwear === "Slippers" || footwear === "Flats") score += 1;

    let risk = "Low";
    if (score <= 1) risk = "Low";
    else if (score <= 4) risk = "Medium";
    else risk = "High";

    setPrediction(risk);

    if (risk === "High") {
      setSuggestion("High strain detected. Rest and hydrate well.");
    } else if (risk === "Medium") {
      setSuggestion("Moderate activity. Maintain proper posture.");
    } else {
      setSuggestion("Great activity level! Keep it up.");
    }
  }, [steps, calories, mood, terrain, footwear]);

  // ================= SAVE =================
  const saveStepsData = async () => {
    // ✅ FIXED VALIDATION (0 allowed)
    if (
      steps === "" ||
      calories === "" ||
      mood === "" ||
      terrain === "" ||
      footwear === ""
    ) {
      alert("Please fill all fields before saving!");
      return;
    }

    const userId = localStorage.getItem("userId");
    console.log("UserId (Steps):", userId);
    if (!userId) {
      alert("User not logged in");
      return;
    }

    try {
      const newEntry = {
        day: new Date().toLocaleDateString("en-US", { weekday: "short" }),
        stepCount: Number(steps),
        calories: Number(calories),
        mood,
        terrain,
        footwear,
      };

      await axios.post("http://localhost:5000/api/vitals/save-steps", {
  userId,
  stepCount: newEntry.stepCount,
  calories: newEntry.calories,
  mood,
  terrain,
  footwear,
});

     const existing =
  JSON.parse(localStorage.getItem(`stepsData_${userId}`)) || [];

existing.push(newEntry);

localStorage.setItem(
  `stepsData_${userId}`,
  JSON.stringify(existing)
);

      if (setRefreshWeekly) {
        setRefreshWeekly((prev) => prev + 1);
      }

      alert("Today's step data saved!");
      setActivePage("stress");
      setSteps("");
      setCalories("");
      setMood("");
      setTerrain("");
      setFootwear("");

    } catch (error) {
      console.error(error);
      alert("Failed to save today's step data.");
    }
  };

  return (
    <div className="page-section">
      <h1>🚶 Steps Tracker</h1>
      <p>Monitor your daily movement and walking behavior</p>

      <div className="steps-card">

        {/* 🚶 Step Count */}
        <label>🚶 Step Count</label>
        <input
          type="number"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
        />

        {/* 🔵 CIRCULAR PROGRESS */}
        {steps !== "" && (
  <div style={{ marginTop: "15px", textAlign: "center" }}>
    <div style={{
      width: "120px",
      height: "120px",
      margin: "auto",
      borderRadius: "50%",
      background: `conic-gradient(
        #3b82f6 ${(Math.min(steps, 10000) / 10000) * 360}deg,
        #e5e7eb 0deg
      )`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        width: "85px",
        height: "85px",
        background: document.body.classList.contains("dark")
          ? "#1e293b"
          : "white",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontSize: "12px",
        fontWeight: "600",
        color: document.body.classList.contains("dark")
          ? "#ffffff"
          : "#000000"
      }}>
        <span>🚶</span>
        <span>{steps}</span>
      </div>
    </div>

    <p style={{ marginTop: "8px", fontWeight: "600" }}>
      {steps < 3000 && "🔴 Low Activity"}
      {steps >= 3000 && steps < 7000 && "🟡 Moderate"}
      {steps >= 7000 && "🟢 Great Job!"}
    </p>

    <p style={{ fontSize: "12px", color: "gray" }}>
      Goal: 10,000 steps
    </p>
  </div>
)}

        {/* 🔥 Calories */}
<label>🔥 Calories Burned</label>
<input
  type="number"
  value={calories}
  onChange={(e) => setCalories(Number(e.target.value))}
/>

{calories !== "" && (
  <div style={{
    marginTop: "8px",
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "6px"
  }}>
    <div style={{
      width: `${Math.min(calories, 500) / 500 * 100}%`,
      height: "8px",
      background: "#f97316",
      borderRadius: "6px"
    }}></div>
  </div>
)}

        {/* 😊 Mood */}
        <label>😊 Walking Mood</label>
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="">Select</option>
          <option value="Calm">😌 Calm</option>
          <option value="Neutral">😐 Neutral</option>
          <option value="Tired">😴 Tired</option>
          <option value="Energetic">⚡ Energetic</option>
        </select>

        {mood && (
          <div style={{ marginTop: "8px", fontSize: "18px" }}>
            {mood === "Energetic" && "🟢⚡"}
            {mood === "Neutral" && "🟡😐"}
            {mood === "Calm" && "🟢😌"}
            {mood === "Tired" && "🔴😴"}
          </div>
        )}

        {/* 🏞 Terrain */}
        <label>🏞 Terrain</label>
        <select value={terrain} onChange={(e) => setTerrain(e.target.value)}>
          <option value="">Select</option>
          <option value="Road">🛣 Road</option>
          <option value="Park">🌳 Park</option>
          <option value="Uphill">⛰ Uphill</option>
        </select>

        {terrain && (
          <div style={{ marginTop: "8px" }}>
            {terrain === "Uphill" ? "🔥 High effort" : "✅ Normal walk"}
          </div>
        )}

        {/* 👟 Footwear */}
        <label>👟 Footwear</label>
        <select value={footwear} onChange={(e) => setFootwear(e.target.value)}>
          <option value="">Select</option>
          <option value="Sneakers">👟 Sneakers</option>
          <option value="Flats">🥿 Flats</option>
          <option value="Slippers">🩴 Slippers</option>
        </select>

        {footwear && (
          <div style={{ marginTop: "8px" }}>
            {footwear === "Sneakers" ? "🟢 Good choice" : "⚠️ Not ideal"}
          </div>
        )}

        {/* Prediction */}
        {prediction && (
          <div className="steps-prediction-box">
            <h3>Risk: {prediction}</h3>
            <p>{suggestion}</p>
          </div>
        )}

        <button onClick={saveStepsData}>
          Save Today's Steps Data
        </button>

      </div>
    </div>
  );
}

export default StepsSection;
