import React from "react";

function OxygenChart({ value }) {
  const rotation = (value / 100) * 180;

  return (
    <div style={{ textAlign: "center", marginTop: "10px" }}>
      {/* Inline CSS using <style> tag */}
      <style>
        {`
          .gauge-container {
            width: 200px;
            height: 120px;
            margin: auto;
          }

          .gauge {
            width: 100%;
            height: 100%;
            background: #e5e7eb;
            border-radius: 150px 150px 0 0;
            position: relative;
            overflow: hidden;
          }

          .gauge-fill {
            width: 100%;
            height: 100%;
            background: #3b82f6;
            transform-origin: center bottom;
            transition: 0.3s ease;
          }

          .gauge-cover {
            position: absolute;
            width: 70%;
            height: 70%;
            background: white;
            border-radius: 50%;
            top: 30%;
            left: 15%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            font-weight: bold;
          }
        `}
      </style>

      <div className="gauge-container">
        <div className="gauge">
          <div
            className="gauge-fill"
            style={{ transform: `rotate(${rotation}deg)` }}
          ></div>
          <div className="gauge-cover">{value}%</div>
        </div>
      </div>
    </div>
  );
}

export default OxygenChart;

