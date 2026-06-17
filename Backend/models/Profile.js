import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: String,   // 🔥 link to User._id
  name: String,
  age: Number,
  weight: Number,
  height: Number,
  bmi: String,
  healthCategory: String,
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model("Profile", profileSchema);
