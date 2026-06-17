import mongoose from "mongoose";

const DailyVitalsSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },

  // HEALTH
  heartRate: Number,
  oxygen: Number,
  temperature: Number,
  respiratory: Number,

  // SLEEP
  sleep: Number,
  dreamQuality: String,
  freshness: Number,
  lateMeal: String,
  screenFree: Number,

  // STEPS
  steps: Number,
  calories: Number,
  mood: String,
  terrain: String,
  footwear: String,

  // STRESS
  stress: Number,
  stressMood: String,
  energyLevel: Number,
  workload: String,
  physicalActivity: Number,
  caffeine: String,

  userId: {
    type: String,
    required: true
  },

  entryIndex: {
    type: Number,
    default: 1
  }
});

export default mongoose.model("DailyVitals", DailyVitalsSchema);
