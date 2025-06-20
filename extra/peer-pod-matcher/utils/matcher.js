import { generateEmbedding } from "./embedding.js";
import { fileURLToPath } from 'url';
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const profiles = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/mockProfiles.json'), 'utf-8')
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

export const initializeProfileEmbeddings = async () => {
  profilesWithEmbeddings = await Promise.all(
    profiles.map(async (profile) => {
      const text = getProfileText(profile);
      const embedding = await generateEmbedding(text);
      return { profile, embedding };
    })
  );
  console.log("Profile embeddings initialized");
};

export const findMatches = async (inputText, role) => {

  if (!profilesWithEmbeddings.length) {
    throw new Error("Profile embeddings not initialized");
  }

  const inputEmbedding = await generateEmbedding(inputText);

  const matches = profilesWithEmbeddings.map(({ profile, embedding }) => {
    const similarity = cosineSimilarity(inputEmbedding, embedding);
    return { profile, similarity };
  });

  matches.sort((a, b) => b.similarity - a.similarity);

  return matches.slice(0, 5);
};
