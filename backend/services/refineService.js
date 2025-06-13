const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const refineRoadmap = async (previousRoadmap, userFeedback) => {
  const prompt = `
You are a career coach and course advisor.

Here's the current roadmap:

${previousRoadmap}

Now, based on the user's feedback below, update the roadmap with the same structure and format.

User feedback: "${userFeedback}"

Respond only with the updated roadmap.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text(); // ← Important: await here too

    return text;
  } catch (error) {
    console.error("Gemini Refinement Error:", error);
    throw new Error("Failed to refine roadmap.");
  }
};

module.exports = refineRoadmap;
