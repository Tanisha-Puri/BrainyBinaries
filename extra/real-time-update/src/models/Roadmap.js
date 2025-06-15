const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  interests: [{ type: String }],
  timeConstraints: {
    hoursPerWeek: Number,
    deadline: Date,
  },
  progress: [{
    taskId: String,
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'] },
    completedAt: Date,
  }],
  roadmap: {
    tasks: [{
      title: String,
      description: String,
      estimatedTime: Number,
      priority: Number,
    }],
    version: { type: Number, default: 1 },
  },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Roadmap', roadmapSchema);