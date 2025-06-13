const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const generateEmbedding = async (text) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${apiKey}`,
      {
        content: {
          parts: [{ text }]
        }
      }
    );

    return response.data.embedding.values;
  } catch (error) {
    console.error("Embedding Error:", error.response?.data || error.message);
    throw new Error("Failed to generate embedding");
  }
};

module.exports = {
  generateEmbedding
};
