import React, { useEffect, useState } from "react";
import axios from "axios";

function StressSection({ setRefreshWeekly, setActivePage }) {
  const [mood, setMood] = useState("");
  const [energy, setEnergy] = useState("");
  const [workload, setWorkload] = useState("");
  const [activity, setActivity] = useState("");
  const [caffeine, setCaffeine] = useState("");

  const [prediction, setPrediction] = useState(null);
  const [suggestion, setSuggestion] = useState("");

  // ================= PREDICTION =================
  useEffect(() => {
    if (!mood || !energy || !workload || !activity || !caffeine) {
      setPrediction(null);
      return;
    }

    let score = 0;

    if (mood === "Very Stressed") score += 3;
    else if (mood === "Stressed") score += 2;
    else if (mood === "Neutral") score += 1;

    if (energy <= 3) score += 2;
    else if (energy <= 6) score += 1;

    if (workload === "Exams") score += 2;
    if (workload === "Arguments") score += 2;
    if (workload === "Deadlines") score += 3;
    if (workload === "Breaks") score += 1;

    if (activity < 20) score += 2;
    else if (activity < 40) score += 1;

    if (caffeine === "Coffee") score += 1;
    if (caffeine === "Alcohol") score += 2;

    let level = "Low";
    if (score <= 2) level = "Low";
    else if (score <= 5) level = "Medium";
    else level = "High";

    setPrediction(level);

    if (level === "High") {
      setSuggestion("High stress detected. Try relaxation and reduce workload.");
    } else if (level === "Medium") {
      setSuggestion("Moderate stress. Take short breaks and relax.");
    } else {
      setSuggestion("Stress level is low. Maintain your routine.");
    }
  }, [mood, energy, workload, activity, caffeine]);

  // ================= SAVE DATA =================
  const saveStressData = async () => {
    if (!mood || !energy || !workload || !activity || !caffeine) {
      alert("Please fill all fields before saving!");
      return;
    }

    const userId = localStorage.getItem("userId");
    console.log("UserId (Stress):", userId);
    if (!userId) {
      alert("User not logged in");
      return;
    }

    try {
      const newEntry = {
        day: new Date().toLocaleDateString("en-US", { weekday: "short" }),
        mood,
        energyLevel: Number(energy),
        workload,
        physicalActivity: Number(activity),
        caffeine,
      };
      
  await axios.post("http://localhost:5000/api/vitals/save-stress", {
  userId,
  entryIndex: Date.now(), // ✅ ADD THIS
  stressMood: mood,
  energyLevel: newEntry.energyLevel,
  workload,
  physicalActivity: newEntry.physicalActivity,
  caffeine
});

      const existing =
  JSON.parse(localStorage.getItem(`stressData_${userId}`)) || [];

existing.push(newEntry);

localStorage.setItem(
  `stressData_${userId}`,
  JSON.stringify(existing)
);

      if (setRefreshWeekly) {
        setRefreshWeekly((prev) => prev + 1);
      }

      alert("Today's stress data saved!");
      setActivePage("download");
      setMood("");
      setEnergy("");
      setWorkload("");
      setActivity("");
      setCaffeine("");

    } catch (err) {
      console.log(err);
      alert("Failed to save stress data.");
    }
  };

  return (
    <div className="page-section">
      <h1>😣 Stress Tracker</h1>
      <p>Track your daily stress indicators</p>

      <div className="stress-card">

        {/* 😣 Mood */}
        <label>😣 Mood</label>
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="">Select</option>
          <option value="Calm">😌 Calm</option>
          <option value="Neutral">😐 Neutral</option>
          <option value="Stressed">😟 Stressed</option>
          <option value="Very Stressed">😫 Very Stressed</option>
        </select>

        {mood && (
          <div style={{ marginTop: "8px", fontSize: "20px" }}>
            {mood === "Calm" && "🟢😌"}
            {mood === "Neutral" && "🟡😐"}
            {mood === "Stressed" && "🟠😟"}
            {mood === "Very Stressed" && "🔴😫"}
          </div>
        )}

        {/* ⚡ Energy */}
        <label>⚡ Energy Level (1–10)</label>
        <input
          type="number"
          value={energy}
          onChange={(e) => setEnergy(e.target.value)}
        />

        {energy && (
          <div style={{
            marginTop: "8px",
            height: "8px",
            background: "#e5e7eb",
            borderRadius: "6px"
          }}>
            <div style={{
              width: `${energy * 10}%`,
              height: "8px",
              background: "#22c55e",
              borderRadius: "6px"
            }}></div>
          </div>
        )}

        {/* 💼 Workload */}
        <label>💼 Workload</label>
        <select value={workload} onChange={(e) => setWorkload(e.target.value)}>
          <option value="">Select</option>
          <option value="Exams">📚 Exams</option>
          <option value="Arguments">😡 Arguments</option>
          <option value="Deadlines">⏰ Deadlines</option>
          <option value="Breaks">🧘 Breaks</option>
        </select>

        {workload && (
          <div style={{ marginTop: "8px" }}>
            {workload === "Breaks" ? "🟢 Relaxed" : "⚠️ Stress Trigger"}
          </div>
        )}

        {/* 🏃 Activity */}
        <label>🏃 Physical Activity (minutes)</label>
        <input
          type="number"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        />

        {activity && (
          <div style={{
            marginTop: "8px",
            height: "8px",
            background: "#e5e7eb",
            borderRadius: "6px"
          }}>
            <div style={{
              width: `${Math.min(activity, 120) / 120 * 100}%`,
              height: "8px",
              background: "#3b82f6",
              borderRadius: "6px"
            }}></div>
          </div>
        )}

        {/* ☕ Caffeine */}
        <label>☕ Caffeine Intake</label>
        <select value={caffeine} onChange={(e) => setCaffeine(e.target.value)}>
          <option value="">Select</option>
          <option value="Fruit Juice">🍹 Fruit Juice</option>
          <option value="Coffee">☕ Coffee</option>
          <option value="Alcohol">🍺 Alcohol</option>
        </select>

        {caffeine && (
          <div style={{ marginTop: "8px" }}>
            {caffeine === "Fruit Juice" && "🟢 Healthy"}
            {caffeine === "Coffee" && "🟡 Moderate"}
            {caffeine === "Alcohol" && "🔴 Risk"}
          </div>
        )}

        {/* Prediction */}
        {prediction && (
          <div className="stress-prediction-box">
            <h3>Stress Level: {prediction}</h3>
            <p>{suggestion}</p>
          </div>
        )}

        <button onClick={saveStressData}>
          Save Today's Stress Data
        </button>

      </div>
    </div>
  );
}

export default StressSection;
