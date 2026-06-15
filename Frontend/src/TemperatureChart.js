import React from "react";

function TemperatureChart({ value }) {
  // ================= REALISTIC RANGE =================
  const MIN_TEMP = 34;
  const MAX_TEMP = 42;
  const THERMO_HEIGHT = 260;

  // Clamp value
  const safeTemp = Math.min(Math.max(value, MIN_TEMP), MAX_TEMP);

  // Convert to percentage
  const percent =
    ((safeTemp - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * 100;

  // Convert to pixel height
  const height = (percent / 100) * THERMO_HEIGHT;

  // ================= COLOR LOGIC =================
  let fillColor = "#22c55e"; // green

  if (safeTemp >= 37.3 && safeTemp <= 38) {
    fillColor = "#f59e0b"; // yellow
  } else if (safeTemp > 38) {
    fillColor = "#ef4444"; // red
  }

  // ================= NORMAL MARKER =================
  const normalTemp = 37;
  const normalPercent =
    ((normalTemp - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * 100;
  const markerPosition = (normalPercent / 100) * THERMO_HEIGHT;

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      
      {/* INLINE CSS */}
      <style>
        {`
          .thermo-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .thermometer {
            width: 45px;
            height: 260px;
            background: linear-gradient(to top, #f1f5f9, #e5e7eb);
            border-radius: 25px;
            position: relative;
            overflow: hidden;
            border: 2px solid #cbd5e1;
          }

          .thermo-fill {
            width: 100%;
            position: absolute;
            bottom: 0;
            transition: height 0.4s ease, background 0.3s ease;
            border-radius: 0 0 25px 25px;
          }

          .normal-marker {
            position: absolute;
            left: 100%;
            margin-left: 8px;
            display: flex;
            align-items: center;
          }

          .normal-marker::before {
            content: "";
            width: 20px;
            height: 2px;
            background: #2563eb;
            margin-right: 6px;
          }

          .normal-marker span {
            font-size: 12px;
            color: #2563eb;
            font-weight: 600;
          }

          .thermo-text {
            margin-top: 12px;
            font-size: 18px;
            font-weight: bold;
          }
        `}
      </style>

      <div className="thermo-wrapper">
        <div className="thermometer">

          {/* NORMAL LINE */}
          <div
            className="normal-marker"
            style={{ bottom: `${markerPosition}px` }}
          >
            <span>Normal</span>
          </div>

          {/* FILL */}
          <div
            className="thermo-fill"
            style={{
              height: `${height}px`,
              background: fillColor,
            }}
          ></div>

        </div>

        {/* VALUE */}
        <p className="thermo-text">{value}°C</p>
      </div>
    </div>
  );
}

export default TemperatureChart;
