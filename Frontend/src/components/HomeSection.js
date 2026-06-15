import React, { useEffect, useState } from "react";
import "../App.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function HomeSection({ refreshWeekly }) {
  const [healthData, setHealthData] = useState([]);
  const [sleepData, setSleepData] = useState([]);
  const [stepsData, setStepsData] = useState([]);
  const [stressData, setStressData] = useState([]);

  useEffect(() => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    setHealthData([]);
    setSleepData([]);
    setStepsData([]);
    setStressData([]);
    return;
  }

  const health = JSON.parse(localStorage.getItem(`healthData_${userId}`)) || [];
  const sleep = JSON.parse(localStorage.getItem(`sleepData_${userId}`)) || [];
  const steps = JSON.parse(localStorage.getItem(`stepsData_${userId}`)) || [];
  const stress = JSON.parse(localStorage.getItem(`stressData_${userId}`)) || [];

  setHealthData(health);
  setSleepData(sleep);
  setStepsData(steps);
  setStressData(stress);

}, [refreshWeekly]);
  // 🔥 check if new user (no data)
  const isEmpty =
    healthData.length === 0 &&
    sleepData.length === 0 &&
    stepsData.length === 0 &&
    stressData.length === 0;

  const latestHealth = healthData.at(-1) || {};
  const latestSleep = sleepData.at(-1) || {};
  const latestSteps = stepsData.at(-1) || {};
  const latestStress = stressData.at(-1) || {};

  const heartRate = latestHealth.heartRate || 0;
  const oxygen = latestHealth.oxygen || 0;
  const temp = latestHealth.temperature || 0;
  const sleep = latestSleep.sleepHours || 0;
  const steps = latestSteps.stepCount || 0;

  const energy = latestStress.energyLevel || 0;
  const stress = isEmpty ? 0 : 10 - energy;

  const stepsPercent = Math.min((steps / 10000) * 100, 100);

  const recovery = isEmpty
    ? "N/A"
    : sleep >= 7 && stress <= 4 && heartRate < 80
    ? "Good"
    : sleep >= 5
    ? "Moderate"
    : "Poor";

  const risk = isEmpty
    ? "N/A"
    : heartRate > 100 || oxygen < 95 || temp > 37 || stress > 7
    ? "High"
    : heartRate > 90 || stress > 5
    ? "Moderate"
    : "Low";

  return (
    <div className="home-section">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Health Dashboard</h1>
        <p>Track your daily health insights</p>
      </div>

      {/* SUMMARY */}
      <div className="summary-container">
        <div className="summary-card"><h4>Heart Rate</h4><p>{heartRate} bpm</p></div>
        <div className="summary-card"><h4>Oxygen</h4><p>{oxygen} %</p></div>
        <div className="summary-card"><h4>Temperature</h4><p>{temp} °C</p></div>
        <div className="summary-card"><h4>Sleep</h4><p>{sleep} hrs</p></div>
        <div className="summary-card"><h4>Steps</h4><p>{steps}</p></div>
        <div className="summary-card"><h4>Stress</h4><p>{stress}</p></div>
        <div className="summary-card"><h4>Recovery</h4><p>{recovery}</p></div>
        <div className="summary-card"><h4>Health Risk</h4><p>{risk}</p></div>
      </div>

      {/* CHARTS */}
      <div className="charts-container">

        {/* HEART RATE */}
        <div className="chart-card">
          <h3>Heart Rate Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={healthData} margin={{ top: 5, right: 10, left: -30, bottom: 5 }}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="natural" dataKey="heartRate" stroke="#ef4444" strokeWidth={3} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* STEPS */}
        <div className="chart-card">
          <h3>Steps Activity</h3>
          <div className="circle-progress">
            <svg width="110" height="110">
              <circle cx="55" cy="55" r="45" stroke="#e5e7eb" strokeWidth="10" fill="none"/>
              <circle
                cx="55"
                cy="55"
                r="45"
                stroke="#22c55e"
                strokeWidth="10"
                fill="none"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * stepsPercent) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="circle-text">
              {steps}
              <span>steps</span>
            </div>
          </div>
        </div>

        {/* SLEEP */}
        <div className="chart-card">
          <h3>Sleep Timeline</h3>
          <div className="sleep-timeline">
            {Array.from({ length: sleep }).map((_, i) => (
              <div key={i} className="sleep-block"></div>
            ))}
          </div>
          <p>{sleep} hrs</p>
        </div>

        {/* STRESS */}
        <div className="chart-card">
          <h3>Stress Level</h3>
          <div className="semi-gauge">
            <svg viewBox="0 0 200 100">
              <path d="M10 90 A90 90 0 0 1 190 90" fill="none" stroke="#e5e7eb" strokeWidth="12"/>
              <path
                d="M10 90 A90 90 0 0 1 190 90"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="12"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * stress) / 10}
                strokeLinecap="round"
              />
            </svg>
            <div className="gauge-text">{stress}</div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default HomeSection;
