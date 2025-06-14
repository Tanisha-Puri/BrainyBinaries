const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const UserGoal = require("./models/UserGoals");
console.log("UserGoal schema timeline type:", UserGoal.schema.path('timeline').instance);
const generateRoadmap = require("./services/geminiService");
const refineRoadmap = require("./services/refineService");
const Roadmap = require("./models/Roadmap");
const { initializeProfileEmbeddings, findMatches } = require("./utils/matcher");
(async () => {
  try {
    await initializeProfileEmbeddings(); // Ensure embeddings are ready
  } catch (err) {
    console.error("❌ Failed to initialize matcher:", err);
    process.exit(1);
  }
})();

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
      const savedGoal = await newGoal.save(); // Save and hold the result
      res.status(201).json(savedGoal); // <-- return it to frontend
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

app.get("/api/generate-roadmap/:goalId", async (req, res) => {
  const { goalId } = req.params;

  try {
    // 1. Check if roadmap already exists
    let existingRoadmap = await Roadmap.findOne({ goalId });

    if (existingRoadmap) {
      return res.status(200).json({ roadmap: existingRoadmap.content });
    }

    // 2. Fetch goal details
    const userGoal = await UserGoal.findById(goalId);
    if (!userGoal) {
      return res.status(404).json({ error: "User goal not found" });
    }

    const { goal, level, timeline } = userGoal;

    // 3. Generate new roadmap from Gemini
    const roadmapContent = await generateRoadmap(goal, level, timeline);

    // 4. Save new roadmap (after checking it didn't get created in the meantime)
    existingRoadmap = await Roadmap.findOne({ goalId });
    if (!existingRoadmap) {
      const newRoadmap = new Roadmap({ goalId, content: roadmapContent });
      await newRoadmap.save();
    }

    res.status(200).json({ roadmap: roadmapContent });

  } catch (error) {
    console.error("❌ Error generating roadmap from saved goal:", error);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
});


// Add this below your existing routes
app.patch("/api/user-goal/:goalId/progress", async (req, res) => {
  const { goalId } = req.params;
  const { progress } = req.body;

  try {
    const updatedGoal = await UserGoal.findByIdAndUpdate(
      goalId,
      { progress },
      { new: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ error: "User goal not found" });
    }

    res.status(200).json({ message: "Progress updated", progress: updatedGoal.progress });
  } catch (err) {
    console.error("Error updating progress:", err);
    res.status(500).json({ error: "Failed to update progress" });
  }
});


app.get("/api/user-goal/:goalId/progress", async (req, res) => {
  const { goalId } = req.params;

  try {
    const goal = await UserGoal.findById(goalId);

    if (!goal) {
      return res.status(404).json({ error: "User goal not found" });
    }

    res.status(200).json({ progress: goal.progress || {} });
  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

app.patch("/api/roadmap/:goalId/update", async (req, res) => {
  const { goalId } = req.params;
  const { feedback } = req.body;

  try {
    // 1. Fetch current roadmap
    const roadmap = await Roadmap.findOne({ goalId });
    if (!roadmap) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    // 2. Use Gemini to refine it
    const updatedContent = await refineRoadmap(roadmap.content, feedback);

    // 3. Update MongoDB
    roadmap.content = updatedContent;
    await roadmap.save();

    res.status(200).json({ message: "Roadmap updated successfully", roadmap: updatedContent });
  } catch (err) {
    console.error("❌ Error updating roadmap:", err);
    res.status(500).json({ error: "Failed to update roadmap", details: err.message });
  }
});

app.post("/api/match", async (req, res) => {
  const { userText, type, userPrograms = [] } = req.body;

  if (!userText || !type) {
    return res.status(400).json({ error: "Missing required fields: userText or type" });
  }

  try {
    const results = await findMatches(userText, type, userPrograms);
    res.json(results);
  } catch (err) {
    console.error("❌ Error matching profiles:", err);
    res.status(500).send("Error matching profiles");
  }
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
