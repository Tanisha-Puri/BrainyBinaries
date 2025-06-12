require('dotenv').config();

async function loadGoogleGenerativeAI() {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

const generateRoadmap = async (userData) => {
  const prompt = `
You are an expert career coach and course advisor with deep knowledge of LinkedIn Learning content.

Generate a highly specific and actionable learning roadmap for a user with the following details:
- Interests: ${userData.interests.join(', ')}
- Current level: Intermediate (assumed based on progress)
- Timeline: ${userData.timeConstraints.deadline ? Math.ceil((new Date(userData.timeConstraints.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : 'unspecified'} days
- Weekly availability: ${userData.timeConstraints.hoursPerWeek} hours
- Progress: ${JSON.stringify(userData.progress)}

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
- Return the roadmap as a JSON object with a "tasks" array, where each task includes course details, timing, and milestones.

Use only **LinkedIn Learning** (formerly Lynda) courses.

Format the response as a JSON object like this:
{
  "tasks": [
    {
      "phase": "Phase 1: [Phase Title]",
      "title": "[Course Title]",
      "description": "[Course details and key skills]",
      "estimatedTime": [Number, in hours],
      "priority": [Number, 1-5],
      "milestone": "[Milestone description]"
    },
    ...
  ]
}
Ensure the response is a valid JSON object wrapped in \`\`\`json\n...\n\`\`\`.
`;

  try {
    const genAI = await loadGoogleGenerativeAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from markdown code block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      throw new Error('Gemini response is not valid JSON');
    }
    const roadmap = JSON.parse(jsonMatch[1]);
    console.log('Parsed roadmap:', roadmap);
    return roadmap;
  } catch (error) {
    console.error('Gemini Error:', error);
    throw new Error('Failed to generate roadmap');
  }
};

module.exports = { generateRoadmap };