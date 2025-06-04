import { generateEmbedding } from "./utils/embedding.js";

const test = async () => {
  const text = `Headline: AI Research Intern at OpenAI. About: Working on multimodal learning. Skills: Python, TensorFlow, LLMs.`;
  const embedding = await generateEmbedding(text);
  console.log("Vector length:", embedding.length);
};

test();
