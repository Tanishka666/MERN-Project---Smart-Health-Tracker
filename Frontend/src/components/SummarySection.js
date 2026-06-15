import React, { useEffect, useState } from "react";
import axios from "axios";

function SummarySection({ refreshWeekly }) {
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setWeeklyData([]);
      return;
    }

    axios
      .get(`http://localhost:5000/api/vitals/weekly/${userId}`)
      .then((res) => {
        console.log("Weekly Data:", res.data);

        const sortedData = (res.data || []).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setWeeklyData(sortedData);
      })
      .catch((err) => {
        console.error("Weekly API Error:", err);
        setWeeklyData([]);
      });
  }, [refreshWeekly]);

  const renderBars = (value, multiplier, className, min = 0) => {
    const safeValue = value ?? 0;

    return (
      <div
        className={`bar ${className}`}
        style={{
          height: `${Math.max(safeValue - min, 0) * multiplier}px`,
        }}
      />
    );
  };

  const renderSection = (
    title,
    key,
    multiplier,
    barClass,
    suffix = "",
    minValue = 0
  ) => (
    <div className="summary-card">
      <h3>{title}</h3>

      {/* ✅ FIX: check actual array existence instead of length only */}
      {!weeklyData || weeklyData.length === 0 ? (
        <p className="empty-text">No data available yet</p>
      ) : (
        <div className="weekly-chart-wrapper">
          <div className="weekly-chart-container">
            {weeklyData.map((item, idx) => {
              const value = item[key] ?? 0;

              return (
                <div className="weekly-bar-block" key={idx}>
                  {renderBars(value, multiplier, barClass, minValue)}

                  <span className="day">
                    {item.date
                      ? new Date(item.date).toLocaleDateString("en-US", {
                          weekday: "short",
                        })
                      : "--"}
                  </span>

                  <span className="value">
                    {value}
                    {suffix}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="page-section weekly-summary-container">
      <h1 className="weekly-title">Weekly Summary</h1>
      <p className="weekly-subtitle">Your weekly health overview</p>

      {renderSection("Heart Rate (bpm)", "heartRate", 2, "bar-red")}
      {renderSection("Oxygen (%)", "oxygen", 2, "bar-blue", "%")}
      {renderSection(
        "Temperature (°C)",
        "temperature",
        60,
        "bar-orange",
        "°C",
        34
      )}
      {renderSection("Respiratory Rate", "respiratory", 6, "bar-green")}
      {renderSection("Sleep (hours)", "sleep", 20, "bar-purple", "h")}
      {renderSection("Stress Score", "stress", 5, "bar-yellow")}
      {renderSection("Steps", "steps", 0.02, "bar-cyan")}
    </div>
  );
}

export default SummarySection;
