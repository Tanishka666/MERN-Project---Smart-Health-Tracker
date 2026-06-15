import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

/* ================= UTIL ================= */

const formatDateWithDay = (dateValue) => {
  const d = new Date(dateValue);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const hasAnyValue = (arr) =>
  arr.some((v) => v !== null && v !== undefined && v !== "");

/* ================= HEALTH ANALYSIS ================= */

const analyzeHealth = (vitals) => {
  let totalSteps = 0,
    totalSleep = 0,
    totalStress = 0,
    count = 0;

  vitals.forEach((v) => {
    if (v.steps) totalSteps += v.steps;
    if (v.sleep) totalSleep += v.sleep;
    if (v.stress) totalStress += v.stress;

    if (v.steps || v.sleep || v.stress) count++;
  });

  const avgSteps = Math.round(totalSteps / count || 0);
  const avgSleep = (totalSleep / count || 0).toFixed(1);
  const avgStress = Math.round(totalStress / count || 0);

  const stepsStatus =
    avgSteps >= 8000 ? "Active" : avgSteps >= 4000 ? "Moderate" : "Low";

  const sleepStatus = avgSleep >= 7 ? "Healthy" : "Poor";

  const stressStatus =
    avgStress <= 4 ? "Normal" : avgStress <= 7 ? "Moderate" : "High";

  let score = 0;
  score += avgSteps >= 8000 ? 30 : avgSteps >= 4000 ? 20 : 10;
  score += avgSleep >= 7 ? 30 : 15;
  score += avgStress <= 4 ? 40 : avgStress <= 7 ? 25 : 10;

  let risk = "Low";
  if (avgStress > 7 || avgSleep < 6) risk = "High";
  else if (avgStress > 5) risk = "Medium";

  const suggestions = [];
  if (avgSteps < 6000)
    suggestions.push("Increase daily physical activity (target 8,000+ steps)");
  if (avgSleep < 7)
    suggestions.push("Improve sleep routine (aim 7–8 hours)");
  if (avgStress > 6)
    suggestions.push("Practice stress management (meditation, breathing)");

  return {
    avgSteps,
    avgSleep,
    avgStress,
    stepsStatus,
    sleepStatus,
    stressStatus,
    score,
    risk,
    suggestions,
  };
};

const getLatestPerDay = (data) => {
  const map = {};

  data.forEach((item) => {
    const dateKey = new Date(item.date).toDateString();

    if (!map[dateKey] || new Date(item.date) > new Date(map[dateKey].date)) {
      map[dateKey] = item;
    }
  });

  return Object.values(map);
};

/* ================= COMPONENT ================= */

function DownloadReport() {
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    setLoading(true);

    try {
      const userId = localStorage.getItem("userId");
      const profileRes = await axios.get(
  `http://localhost:5000/api/user/${userId}`
);

const profile = profileRes.data;
console.log("PROFILE:", profile);
      const sessionId = localStorage.getItem("sessionId");
      const username = localStorage.getItem("username");

      if (!userId) {
        alert("Please login again");
        setLoading(false);
        return;
      }

      const res = await axios.get(
         `http://localhost:5000/api/vitals/${userId}`
      );
      console.log("DATA:", res.data);

      const vitals = res.data || [];

      const doc = new jsPDF();
      let y = 20;

      /* ===== HEADER ===== */
      /* ===== HEADER ===== */
doc.setFont("helvetica", "bold");
doc.setFontSize(18);
doc.text("Smart Health Tracker – Full Report", 14, y);
y += 10;

/* ===== PROFILE ===== */
doc.setFontSize(14);
doc.text("User Profile", 14, y);
y += 8;

doc.setFont("helvetica", "normal");
doc.setFontSize(11);

doc.text(`Name: ${profile?.name || "N/A"}`, 14, y); y += 6;
doc.text(`Age: ${profile?.age || "N/A"}`, 14, y); y += 6;
doc.text(`Height: ${profile?.height || "N/A"} cm`, 14, y); y += 6;
doc.text(`Weight: ${profile?.weight || "N/A"} kg`, 14, y); y += 6;
doc.text(`BMI: ${profile?.bmi || "N/A"}`, 14, y); y += 6;
doc.text(`Category: ${profile?.healthCategory || "N/A"}`, 14, y); y += 6;
doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, y);

y += 12;
      /* ===== EMPTY CHECK ===== */
      if (vitals.length === 0) {
        doc.setFontSize(14);
        doc.text("No health data recorded yet.", 14, y + 10);
        doc.text("Please add data to generate report.", 14, y + 20);
        doc.save("Health_Report.pdf");
        setLoading(false);
        return;
      }

      /* ===== ANALYSIS ===== */
      const analysis = analyzeHealth(vitals);

      /* ===== HEALTH SUMMARY ===== */
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Overall Health Summary", 14, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);

      doc.text(`Health Score: ${analysis.score}/100`, 14, y); y += 6;
      doc.text(`Risk Level: ${analysis.risk}`, 14, y); y += 6;
      doc.text(`Steps: ${analysis.avgSteps} (${analysis.stepsStatus})`, 14, y); y += 6;
      doc.text(`Sleep: ${analysis.avgSleep} hrs (${analysis.sleepStatus})`, 14, y); y += 6;
      doc.text(`Stress: ${analysis.avgStress} (${analysis.stressStatus})`, 14, y); y += 10;

      /* ================= VITALS ================= */
      const vitalsData = getLatestPerDay(
      vitals.filter((v) =>
      hasAnyValue([v.heartRate, v.oxygen, v.temperature, v.respiratory])
  )
);

      if (vitalsData.length) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.text("Vital Readings", 14, y);
        y += 6;

        autoTable(doc, {
          startY: y,
          head: [["Date", "Heart Rate", "Temp", "Oxygen", "Resp"]],
          body: vitalsData.map((v) => [
            formatDateWithDay(v.date),
            v.heartRate ?? "-",
            v.temperature ?? "-",
            v.oxygen ?? "-",
            v.respiratory ?? "-",
          ]),
        });

        y = doc.lastAutoTable.finalY + 10;
      }

      /* ================= SLEEP ================= */
      const sleepData = getLatestPerDay(
      vitals.filter((v) =>
      hasAnyValue([v.sleep, v.dreamQuality, v.freshness])
  )
);

      if (sleepData.length) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.text("Sleep Summary", 14, y);
        y += 6;

        autoTable(doc, {
          startY: y,
          head: [["Date", "Hours", "Quality", "Freshness"]],
          body: sleepData.map((v) => [
            formatDateWithDay(v.date),
            v.sleep ?? "-",
            v.dreamQuality ?? "-",
            v.freshness ?? "-",
          ]),
        });

        y = doc.lastAutoTable.finalY + 10;
      }

      /* ================= STEPS ================= */
      const stepsData = getLatestPerDay(
  vitals.filter((v) =>
    hasAnyValue([
      v.steps,
      v.calories,
      v.terrain,
      v.footwear
    ])
  )
);

      if (stepsData.length) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.text("Steps Summary", 14, y);
        y += 6;

        autoTable(doc, {
          startY: y,
          head: [["Date", "Steps", "Calories", "Terrain", "Footwear"]],
         body: stepsData.map((v) => [
         formatDateWithDay(v.date),
          v.steps ?? "-",
          v.calories ?? "-",
          v.terrain ?? "-",
          v.footwear ?? "-",
         ]),
        });

        y = doc.lastAutoTable.finalY + 10;
      }

      /* ================= STRESS ================= */
      const stressData = getLatestPerDay(
  vitals.filter((v) =>
    hasAnyValue([
      v.stress,
      v.stressMood,
      v.workload,
      v.caffeine
    ])
  )
);

      if (stressData.length) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.text("Stress Summary", 14, y);
        y += 6;

        autoTable(doc, {
          startY: y,
          head: [["Date", "Stress", "Mood", "Workload", "Caffeine"]],
          body: stressData.map((v) => [
          formatDateWithDay(v.date),
          v.stress ?? "-",
          v.stressMood ?? "-",
          v.workload ?? "-",
          v.caffeine ?? "-",
          ]),
        });

        y = doc.lastAutoTable.finalY + 12;
      }

      /* ===== SMART SUGGESTIONS ===== */
      if (y > 250) {
         doc.addPage();
          y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text("Personalized Suggestions", 14, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      if (analysis.suggestions.length === 0) {
  const lines = doc.splitTextToSize(
    "Great job! Your health is well balanced.",
    180
  );

  doc.text(lines, 14, y);
  y += lines.length * 6;
} else {
  analysis.suggestions.forEach((s, i) => {
    const lines = doc.splitTextToSize(
      `${i + 1}. ${s}`,
      180
    );

    doc.text(lines, 14, y);
    y += lines.length * 6 + 2;
  });
}
      /* ===== INSIGHT ===== */
      y += 6;
      doc.setFont("helvetica", "italic");
      const insightLines = doc.splitTextToSize(
  "Insight: Your health score is mainly influenced by sleep and stress patterns.",
  180
);

doc.text(insightLines, 14, y);

      /* ===== SAVE ===== */
      doc.save("Health_Report.pdf");
      setLoading(false);
    } catch (err) {
      console.error("FULL ERROR:", err);
      console.log("ERROR RESPONSE:", err?.response);
      alert("Check console (F12) for error");
      setLoading(false);
    }
  };

  return (
  <div
    style={{
      textAlign: "center",
      maxWidth: "700px",
      margin: "40px auto",
      padding: "20px"
    }}
  >
    <h1>📄 Health Report Generator</h1>

    <p
      style={{
        color: "#666",
        lineHeight: "1.7",
        marginBottom: "25px"
      }}
    >
      Generate a comprehensive health report containing your vital signs,
      sleep analysis, activity tracking, stress assessment, health score,
      risk evaluation, and personalized recommendations based on your
      recorded health data.
    </p>

    <button onClick={generatePDF} disabled={loading}>
      {loading ? "Generating..." : "Download Report"}
    </button>
  </div>
);
}

export default DownloadReport;
