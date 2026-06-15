import React from "react";

function PredictionCard({ heartRate, oxygen, temperature, respiratory }) {
  
  // Risk Calculation
  let riskScore = 0;

  if (heartRate > 120 || heartRate < 50) riskScore++;
  if (oxygen < 92) riskScore++;
  if (temperature > 38) riskScore++;
  if (respiratory < 10 || respiratory > 24) riskScore++;

  let riskLevel = "Low";
  if (riskScore === 1) riskLevel = "Medium";
  if (riskScore >= 2) riskLevel = "High";

  // AI Suggestions
  let suggestion = "";

  if (riskLevel === "Low") {
    suggestion = "Your vitals look normal. Keep maintaining a healthy lifestyle.";
  } else if (riskLevel === "Medium") {
    suggestion = "Some vitals need attention. Try resting, hydrating, and monitoring regularly.";
  } else if (riskLevel === "High") {
    suggestion = "Multiple vitals are abnormal. Seek medical help if symptoms persist.";
  }

  return (
    <div className="card prediction-card">
      <h3>Health Risk Prediction</h3>
      <p><strong>Risk Level:</strong> {riskLevel}</p>
      <p><strong>AI Suggestion:</strong> {suggestion}</p>
    </div>
  );
}

export default PredictionCard;

