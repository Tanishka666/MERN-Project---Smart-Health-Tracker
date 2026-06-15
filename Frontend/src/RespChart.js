import React from "react";

function RespChart({ value }) {
  // Generate simple small dataset
  const data = [
    { label: "Now", val: value },
    { label: "1m", val: value - 1 },
    { label: "2m", val: value + 1 }
  ];

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {/* Inline CSS */}
      <style>
        {`
          .resp-chart-container {
            display: flex;
            align-items: flex-end;
            justify-content: center;
            gap: 20px;
            height: 200px;
            margin: 0 auto;
          }

          .resp-bar {
            width: 40px;
            background: #10b981;
            border-radius: 6px 6px 0 0;
            transition: height 0.3s ease;
          }

          .resp-label {
            margin-top: 8px;
            font-weight: 600;
          }
        `}
      </style>

      <div className="resp-chart-container">
        {data.map((item, i) => (
          <div key={i}>
            <div
              className="resp-bar"
              style={{ height: `${item.val * 5}px` }}
            ></div>
            <div className="resp-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RespChart;

