const mongoose = require("mongoose");

const UserGoalSchema = new mongoose.Schema({
    goal: { type: String, required: true },
    timeline: { type: String, required: true },
    level: { type: String, required: true },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

 module.exports = mongoose.model("UserGoal", UserGoalSchema);
