const Roadmap = require('../models/Roadmap');
const { generateRoadmap } = require('./aiService');

const updateRoadmap = async (userId, userData) => {
  try {
    let roadmap = await Roadmap.findOne({ userId });

    if (!roadmap) {
      roadmap = new Roadmap({
        userId,
        interests: userData.interests,
        timeConstraints: userData.timeConstraints,
        progress: userData.progress || [],
        roadmap: { tasks: [], version: 1 },
      });
    } else {
      roadmap.interests = userData.interests;
      roadmap.timeConstraints = userData.timeConstraints;
      roadmap.progress = userData.progress || roadmap.progress;
      roadmap.roadmap.version += 1;
      roadmap.updatedAt = Date.now();
    }

    const aiResponse = await generateRoadmap(userData);
    roadmap.roadmap.tasks = JSON.parse(aiResponse).tasks;

    await roadmap.save();
    return roadmap;
  } catch (error) {
    console.error('Error updating roadmap:', error);
    throw error;
  }
};

module.exports = { updateRoadmap };