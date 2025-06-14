const { generateEmbedding } = require("./embedding");
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const profiles = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/mockProfiles.json"), "utf-8")
);

const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

const getProfileText = (profile) => {
  const combined = `
    Name: ${profile.name}
    Headline: ${profile.headline}
    About: ${profile.about}
    Skills: ${(profile.skills || []).join(", ")}
    Badges: ${profile.badges?.join(", ") || ""}
    Education: ${profile.education.map(e => `${e.degree} at ${e.institution}`).join("; ")}
    Experience: ${profile.experience.map(e => `${e.title} at ${e.company}`).join("; ")}
  `;
  return combined.replace(/\s+/g, " ").trim();
};

let profilesWithEmbeddings = [];

const initializeProfileEmbeddings = async () => {
  profilesWithEmbeddings = await Promise.all(
    profiles.map(async (profile) => {
      const text = getProfileText(profile);
      const embedding = await generateEmbedding(text);
      return { profile, embedding };
    })
  );
  console.log("Profile embeddings initialized");
};


function getMatchingReasons(profile, inputText, role, userPrograms) {
  const reasons = [];

  profile.skills.forEach(skill => {
    if (inputText.toLowerCase().includes(skill.toLowerCase())) {
      reasons.push(`Experience with ${skill}`);
    }
  });

  if (profile.badges?.includes("Open to Mentorship")) {
    reasons.push("Open to mentorship");
  }
  if (profile.badges?.includes("Open to Collaboration")) {
    reasons.push("Open to collaboration");
  }

  if (role === "peer" && userPrograms.length > 0 && profile.programs) {
    const sharedPrograms = profile.programs.filter(p => userPrograms.includes(p));
    if (sharedPrograms.length > 0) {
      reasons.push(`Shared programs: ${sharedPrograms.join(", ")}`);
    }
  }

  return reasons.join(", ");
}

const axios = require("axios");


async function rerankWithLLM(userText, matches) {
  let prompt = `The user asked: "${userText}". Rank the following profiles in order of best match:\n\n`;
  matches.forEach(({ profile }, i) => {
    prompt += `${i + 1}. ${profile.name}: ${profile.headline}, Skills: ${profile.skills.join(", ")}\n`;
  });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // or "chat-bison-001" if you're using PaLM
    const chat = model.startChat(); // this is required for chat-based messages

    const result = await chat.sendMessage(prompt); // ✅ correct function
    const response = await result.response;
    const rankingText = response.text(); // ✅ use .text() to get output

    // Parse ranked names
    const rankedNames = rankingText
      .split("\n")
      .map(line => line.trim().replace(/^\d+\.\s*/, ""))
      .filter(name => name.length > 0);

    const rankedMatches = rankedNames
      .map(name => matches.find(m => m.profile.name === name))
      .filter(Boolean);

    return rankedMatches.slice(0, 5);
  } catch (error) {
    console.error("LLM reranking error:", error.message);
    return matches.slice(0, 5);
  }
}





const findMatches = async (inputText, role, userPrograms = []) => {
  if (!profilesWithEmbeddings.length) {
    throw new Error("Profile embeddings not initialized");
  }

  const inputEmbedding = await generateEmbedding(`User is looking for: ${inputText}`);

  let filteredProfiles = profilesWithEmbeddings;
  if (role === "mentor") {
    filteredProfiles = profilesWithEmbeddings.filter(({ profile }) =>
      profile.badges?.includes("Open to Mentorship")
    );
  } else if (role === "peer") {
    filteredProfiles = profilesWithEmbeddings.filter(({ profile }) =>
      profile.badges?.includes("Open to Collaboration")
    );
  }

  let matches = filteredProfiles.map(({ profile, embedding }) => {
    let similarity = cosineSimilarity(inputEmbedding, embedding);

    if (role === "peer" && userPrograms.length > 0 && profile.programs) {
      const sharedPrograms = profile.programs.filter(p => userPrograms.includes(p));
      if (sharedPrograms.length > 0) {
        similarity = Math.min(1, similarity + 0.1 * sharedPrograms.length);
      }
    }

    const reasons = getMatchingReasons(profile, inputText, role, userPrograms);

    return { profile, similarity, reasons };
  });

  matches.sort((a, b) => b.similarity - a.similarity);

  // Take top 10 for LLM reranking
  const topMatches = matches.slice(0, 10);

  // Rerank with LLM - fallback to original if fails
  matches = await rerankWithLLM(inputText, topMatches);

  return matches;
};




module.exports = {
  initializeProfileEmbeddings,
  findMatches,
};
