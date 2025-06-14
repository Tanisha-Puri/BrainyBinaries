const mongoose = require("mongoose");

const UserGoalSchema = new mongoose.Schema({
  goal: { type: String, required: true },
  prompt: { type: String }, // optional
  timeline: { type: String, required: true },
  level: { type: String, required: true },
  progress: {
    type: Map,
    of: Boolean,  // e.g. { "step-0": true, "step-1": false }
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("UserGoal", UserGoalSchema);