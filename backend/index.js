
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const UserGoal = require("./models/UserGoals");
console.log("UserGoal schema timeline type:", UserGoal.schema.path('timeline').instance);
const generateRoadmap = require("./services/geminiService");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// POST route to save user goal
app.post("/api/user-goal", async (req, res) => {
    const { goal, timeline, level } = req.body;
  
    try {
      const newGoal = new UserGoal({ goal, timeline, level });
      await newGoal.save();
      res.status(201).json({ message: "Goal saved successfully!" });
    } catch (err) {
      console.error("Error saving goal:", err);  // <--- Log actual error details here
      res.status(500).json({ error: "Failed to save goal", details: err.message });
    }
  });
  

// GET route to view saved goals
app.get("/api/user-goal", async (req, res) => {
  try {
    const goals = await UserGoal.find();
    res.status(200).json(goals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

app.post("/api/generate-roadmap", async (req, res) => {
  const { goal, level, timeline } = req.body;

  try {
    const roadmap = await generateRoadmap(goal, level, timeline);
    res.status(200).json({ roadmap });
  } catch (error) {
    console.error("Error generating roadmap:", error.message);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
