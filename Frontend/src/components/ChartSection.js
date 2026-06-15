import React, { useState } from "react";
import axios from "axios";

import HeartRateChart from "../HeartRateChart";
import OxygenChart from "../OxygenChart";
import TemperatureChart from "../TemperatureChart";
import RespChart from "../RespChart";
import PredictionCard from "../components/PredictionCard";

function ChartsSection({ setRefreshWeekly, setActivePage }) {
  const [heart, setHeart] = useState("");
  const [oxy, setOxy] = useState("");
  const [temp, setTemp] = useState("");
  const [resp, setResp] = useState("");

  const saveTodayData = async () => {
    if (!heart || !oxy || !temp || !resp) {
      alert("Please fill all 4 vitals before saving!");
      return;
    }

    const userId = localStorage.getItem("userId");
    console.log("UserId being sent:", userId);
    if (!userId) {
      alert("User not logged in");
      return;
    }

    try {
      const sessionId = localStorage.getItem("sessionId");

      const newEntry = {
        day: new Date().toLocaleDateString("en-US", { weekday: "short" }),
        heartRate: Number(heart),
        oxygen: Number(oxy),
        temperature: Number(temp),
        respiratory: Number(resp),
      };

      // ✅ SAVE TO BACKEND
      await axios.post("http://localhost:5000/api/vitals/save", {
  userId,
  sessionId,
  heartRate: Number(heart),
  oxygen: Number(oxy),
  temperature: Number(temp),
  respRate: Number(resp)
});

      // ✅ ALSO SAVE TO LOCALSTORAGE (🔥 FIX)
      const existing =
  JSON.parse(localStorage.getItem(`healthData_${userId}`)) || [];

existing.push(newEntry);

localStorage.setItem(
  `healthData_${userId}`,
  JSON.stringify(existing)
);

      // 🔥 TRIGGER REFRESH
      setRefreshWeekly((prev) => prev + 1);

      alert("Today's vitals saved successfully!");
      setActivePage("sleep");
      // CLEAR INPUTS
      setHeart("");
      setOxy("");
      setTemp("");
      setResp("");

    } catch (error) {
      console.error(error);
      alert("Failed to save today's data");
    }
  };

  return (
    <div className="page-section">
      <h1>📈 Health Charts</h1>
      <p>Your real-time visualization of vital signs</p>

      <div className="chart-section-container">

        {/* HEART */}
        <div className="chart-input-card">
          <label>💓 Heart Rate (bpm)</label>
          <input
            type="number"
            value={heart}
            onChange={(e) => setHeart(e.target.value)}
          />
        </div>

        {heart && (
          <div className="chart-display-box">
            <h3>Heart Rate Trend</h3>
            <HeartRateChart
              labels={["Now", "1m", "2m", "3m", "4m"]}
              dataPoints={[Number(heart), 80, 82, 78, 79]}
            />
          </div>
        )}

        {/* OXYGEN */}
        <div className="chart-input-card">
          <label>🫁 Oxygen Level (%)</label>
          <input
            type="number"
            value={oxy}
            onChange={(e) => setOxy(e.target.value)}
          />
        </div>

        {oxy && (
          <div className="chart-display-box">
            <h3>Oxygen Level</h3>
            <OxygenChart value={Number(oxy)} />
          </div>
        )}

        {/* TEMP */}
        <div className="chart-input-card">
          <label>🌡️ Temperature (°C)</label>
          <input
            type="number"
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
          />
        </div>

        {temp && (
          <div className="chart-display-box">
            <h3>Body Temperature</h3>
            <TemperatureChart value={Number(temp)} />
          </div>
        )}

        {/* RESP */}
        <div className="chart-input-card">
          <label>🫁 Respiratory Rate</label>
          <input
            type="number"
            value={resp}
            onChange={(e) => setResp(e.target.value)}
          />
        </div>

        {resp && (
          <div className="chart-display-box">
            <h3>Respiratory Rate</h3>
            <RespChart value={Number(resp)} />
          </div>
        )}

        {/* PREDICTION */}
        {heart && oxy && temp && resp && (
          <PredictionCard
            heartRate={Number(heart)}
            oxygen={Number(oxy)}
            temperature={Number(temp)}
            respiratory={Number(resp)}
          />
        )}

        {/* SAVE */}
        <button
          onClick={saveTodayData}
          className="dark-toggle-btn"
          style={{ marginTop: "25px", width: "220px", alignSelf: "center" }}
        >
          Save Today's Data
        </button>

      </div>
    </div>
  );
}

export default ChartsSection;
