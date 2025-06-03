const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateRoadmap = async (goal, level, timeline) => {
 const prompt = `
You are an expert career coach and course advisor with deep knowledge of LinkedIn Learning content.

Generate a highly specific and actionable learning roadmap for someone who wants to become a ${goal}. They are currently at a ${level} level and aim to achieve this goal in ${timeline} days.

**Important Instructions:**
- Break the roadmap into 3-5 clearly labeled **Phases**.
- Use **real, up-to-date LinkedIn Learning course titles**, ideally with **instructor names and durations** if available.
- For each course, include:
  * Course name (with duration)
  * 1-2 short bullet points summarizing key skills or outcomes
- Specify **daily or weekly structure** (e.g., “Days 1–3”, “Week 2”).
- Include **practical project tasks** where appropriate.
- Mention **tools or technologies** the learner will use or install (e.g., GitHub, VS Code, React).
- Conclude each phase with a **milestone or deliverable** (e.g., “Build a personal portfolio site”, “Deploy your first project on GitHub Pages”).
- Make sure the roadmap feels like a curated course path with outcomes, not just a course list.

Use only **LinkedIn Learning** (formerly Lynda) courses.

Format strictly like this:

---
**Phase 1: [Phase Title] (Days X-Y)**

1. **[Course Title]** ([Course Duration], [Instructor Name]):
    * [Short summary of key topics covered]

2. **[Course Title]** ([Course Duration], [Instructor Name]):
    * [Short summary]

🎯 **Milestone:** [What the learner should have achieved or built by the end of this phase]

---

Now generate the full roadmap.
`;


  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate roadmap.");
  }
};

module.exports = generateRoadmap;
