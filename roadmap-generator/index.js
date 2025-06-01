import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import generateRoadmap from "./geminiService.js";
import refineRoadmap from "./refineService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate-roadmap", async (req, res) => {
  const { goal, level, timeline } = req.body;

  if (!goal || !level || !timeline) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const roadmap = await generateRoadmap(goal, level, timeline);
    res.json({ roadmap });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/refine-roadmap", async (req, res) => {
  const { previousRoadmap, userFeedback } = req.body;

  if (!previousRoadmap || !userFeedback) {
    return res.status(400).json({ error: "Both previousRoadmap and userFeedback are required." });
  }

  try {
    const refinedRoadmap = await refineRoadmap(previousRoadmap, userFeedback);
    res.json({ roadmap: refinedRoadmap });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
