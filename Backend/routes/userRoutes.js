import express from "express";
import Profile from "../models/Profile.js";

const router = express.Router();

/* =======================================================
   GET USER PROFILE (BY USER ID)
======================================================= */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("Fetching profile for:", userId);

    const profile = await Profile.findOne({ userId });

    res.json(profile || null);
  } catch (err) {
    console.error(err);
    res.status(500).json(null);
  }
});

/* =======================================================
   SAVE / UPDATE USER PROFILE
======================================================= */
router.post("/", async (req, res) => {
  try {
    const { name, age, weight, height, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // BMI calculation
    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);

    let healthCategory = "Normal";
    if (bmi < 18.5) healthCategory = "Underweight";
    else if (bmi >= 25 && bmi < 30) healthCategory = "Overweight";
    else if (bmi >= 30) healthCategory = "Obese";

    // 🔥 USE PROFILE MODEL (NOT USER)
    let profile = await Profile.findOne({ userId });

    if (profile) {
      // UPDATE
      profile.name = name;
      profile.age = age;
      profile.weight = weight;
      profile.height = height;
      profile.bmi = bmi;
      profile.healthCategory = healthCategory;
      profile.lastUpdated = new Date();
    } else {
      // CREATE
      profile = new Profile({
        userId,
        name,
        age,
        weight,
        height,
        bmi,
        healthCategory,
        lastUpdated: new Date()
      });
    }

    await profile.save();

    console.log("Saved profile:", profile);

    res.json({
      success: true,
      user: profile
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving profile" });
  }
});

export default router;
