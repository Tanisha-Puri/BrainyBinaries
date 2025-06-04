import express from "express";
import dotenv from "dotenv";
import { findMatches, initializeProfileEmbeddings } from "./utils/matcher.js";

dotenv.config();

const app = express();
app.use(express.json());

(async () => {
  try {
    await initializeProfileEmbeddings();

    app.post("/api/match", async (req, res) => {
      const { userText, type } = req.body;

      try {
        const results = await findMatches(userText, type);
        res.json(results);
      } catch (err) {
        console.error(err);
        res.status(500).send("Error matching profiles");
      }
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to initialize profile embeddings", error);
    process.exit(1);
  }
})();
