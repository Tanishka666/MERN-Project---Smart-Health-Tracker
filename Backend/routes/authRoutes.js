import express from "express";
import User from "../models/User.js";

const router = express.Router();

/* ========== SIGN UP ========== */
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existing = await User.findOne({ username });

    if (existing) {
      return res.json({ success: false, message: "User already exists" });
    }

    const user = new User({ username, password });
    await user.save();

    console.log("USER SAVED:", user);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});
/* ========== LOGIN ========== */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("LOGIN INPUT:", username, password);

    const user = await User.findOne({ username, password });

    console.log("FOUND USER:", user);

    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      userId: user._id,
      username: user.username
    });

  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

export default router;
