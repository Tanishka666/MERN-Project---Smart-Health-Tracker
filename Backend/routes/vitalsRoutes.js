import express from "express";
import DailyVitals from "../models/DailyVitals.js";

const router = express.Router();

/* ===========================
   UTIL: TODAY START
=========================== */
const getTodayStart = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/* ===========================
   UTIL: DELETE OLD DATA (7 DAYS)
=========================== */
const deleteOldData = async (userId) => {
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  await DailyVitals.deleteMany({
    userId,
    date: { $lt: last7Days }
  });
};

/* =====================================================
   SAVE CHART SECTION (UNCHANGED + CLEANUP ADDED)
===================================================== */
router.post("/save", async (req, res) => {
  try {
    const { userId, heartRate, oxygen, temperature, respRate } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId missing" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🔥 find today's existing record
    const existing = await DailyVitals.findOne({
      userId,
      date: { $gte: today }
    });

    // 🔥 convert to plain object and REMOVE _id
    const base = existing ? existing.toObject() : {};
    delete base._id;

    // 🔥 merge safely
    const updatedData = {
  ...base,
  heartRate,
  oxygen,
  temperature,
  respiratory: respRate,
  userId,
  date: new Date()
};
    // 🔥 update same-day record
    const saved = await DailyVitals.findOneAndUpdate(
      { userId, date: { $gte: today } },
      updatedData,
      { upsert: true, new: true }
    );

    res.json(saved);

  } catch (err) {
    console.error("SAVE HEALTH ERROR:", err);
    res.status(500).json({ error: "Error saving health" });
  }
});

/* =====================================================
   SAVE SLEEP (NEW FIXED)
===================================================== */
router.post("/save-sleep", async (req, res) => {
  try {
    const {
  userId,
  sleep,
  dreamQuality,
  freshness,
  lateMeal,
  screenFree
} = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await DailyVitals.findOne({
      userId,
      date: { $gte: today }
    });

    const base = existing ? existing.toObject() : {};
    delete base._id;

    const updatedData = {
  ...base,
  sleep,
  dreamQuality,
  freshness,
  lateMeal,
  screenFree,
  userId,
  date: new Date()
};
console.log("SLEEP DATA:", updatedData);

    const saved = await DailyVitals.findOneAndUpdate(
      { userId, date: { $gte: today } },
      updatedData,
      { upsert: true, new: true }
    );

    res.json(saved);

  } catch (err) {
    res.status(500).json({ error: "Error saving sleep" });
  }
});

/* =====================================================
   SAVE STEPS (NEW FIXED)
===================================================== */
router.post("/save-steps", async (req, res) => {
  try {
    const {
  userId,
  stepCount,
  calories,
  mood,
  terrain,
  footwear
} = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await DailyVitals.findOne({
      userId,
      date: { $gte: today }
    });

    const base = existing ? existing.toObject() : {};
    delete base._id;

    const updatedData = {
  ...base,
  steps: stepCount,
  calories,
  mood,
  terrain,
  footwear,
  userId,
  date: new Date()
};
console.log("STEPS DATA:", updatedData);
    const saved = await DailyVitals.findOneAndUpdate(
      { userId, date: { $gte: today } },
      updatedData,
      { upsert: true, new: true }
    );

    res.json(saved);

  } catch (err) {
    res.status(500).json({ error: "Error saving steps" });
  }
});

/* =====================================================
   SAVE STRESS (NEW FIXED)
===================================================== */
router.post("/save-stress", async (req, res) => {
  try {
    const {
      userId,
      stressMood,
      energyLevel,
      workload,
      physicalActivity,
      caffeine
    } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await DailyVitals.findOne({
      userId,
      date: { $gte: today }
    });

    const base = existing ? existing.toObject() : {};
    delete base._id;

    const updatedData = {
      ...base,

      stress: 10 - Number(energyLevel),

      stressMood,
      energyLevel: Number(energyLevel),
      workload,
      physicalActivity: Number(physicalActivity),
      caffeine,

      userId,
      date: new Date()
    };

    const saved = await DailyVitals.findOneAndUpdate(
      { userId, date: { $gte: today } },
      updatedData,
      { upsert: true, new: true }
    );

    res.json(saved);

  } catch (err) {
    console.error("SAVE STRESS ERROR:", err);
    res.status(500).json({ error: "Error saving stress" });
  }
});

/* =====================================================
   WEEKLY SUMMARY (UNCHANGED)
===================================================== */
router.get("/weekly/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const finalData = [];

    const getDayRange = (date) => {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      return { start, end };
    };

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const { start, end } = getDayRange(d);

      const data = await DailyVitals.findOne({
        userId,
        date: { $gte: start, $lte: end }
      }).sort({ date: -1 });

      finalData.push({
        date: d,

        // ✅ HEALTH
        heartRate: data?.heartRate || 0,
        oxygen: data?.oxygen || 0,
        temperature: data?.temperature || 0,
        respiratory: data?.respiratory ?? 0,

        // ✅ HANDLE BOTH OLD + NEW DATA
        sleep: data?.sleep ?? data?.sleepHours ?? 0,

steps: data?.steps ?? data?.stepCount ?? 0,

stress: data?.stress ??
        (data?.energyLevel !== undefined
          ? 10 - data.energyLevel
          : 0),
      });
    }

    console.log("Final Weekly Data:", finalData);

    res.json(finalData);

  } catch (err) {
    console.error("Weekly API Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================================================
   SESSION FETCH (UNCHANGED)
===================================================== */
router.get("/session/:userId/:sessionId", async (req, res) => {
  try {
    const { userId, sessionId } = req.params;

    const data = await DailyVitals.find({ userId, sessionId })
      .sort({ date: -1 });

    res.json(data);
  } catch (err) {
    console.error("SESSION FETCH ERROR:", err);
    res.status(500).json([]);
  }
});

/* =====================================================
   FETCH ALL DATA FOR USER (NEW)
===================================================== */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const data = await DailyVitals.find({ userId })
      .sort({ date: -1 });

    res.json(data);
  } catch (err) {
    console.error("USER FETCH ERROR:", err);
    res.status(500).json([]);
  }
});

export default router;
