const { generateEmbedding } = require("./embedding");
const fs = require("fs");
const path = require("path");

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
  return `
    Name: ${profile.name}
    Headline: ${profile.headline}
    About: ${profile.about}
    Skills: ${profile.skills.join(", ")}
    Education: ${profile.education.map(e => `${e.degree} at ${e.institution}`).join("; ")}
    Experience: ${profile.experience.map(e => `${e.title} at ${e.company}`).join("; ")}
  `;
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

const findMatches = async (inputText, role) => {
  if (!profilesWithEmbeddings.length) {
    throw new Error("Profile embeddings not initialized");
  }

  const inputEmbedding = await generateEmbedding(inputText);

  // ✅ Filter profiles by badge type before similarity matching
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

  const matches = filteredProfiles.map(({ profile, embedding }) => {
    const similarity = cosineSimilarity(inputEmbedding, embedding);
    return { profile, similarity };
  });

  matches.sort((a, b) => b.similarity - a.similarity);

  return matches.slice(0, 5);
};


module.exports = {
  initializeProfileEmbeddings,
  findMatches,
};
