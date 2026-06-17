import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import vitalsRoutes from "./routes/vitalsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/vitals", vitalsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);


// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/healthdb")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

