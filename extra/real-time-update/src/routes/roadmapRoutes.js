const express = require('express');
const { updateRoadmap } = require('../services/roadmapService');
const router = express.Router();

router.post('/update', async (req, res) => {
  try {
    const { userId, interests, timeConstraints, progress } = req.body;
    const roadmap = await updateRoadmap(userId, { interests, timeConstraints, progress });
    req.io.to(userId).emit('roadmapUpdate', roadmap);
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update roadmap' });
  }
});

module.exports = router;