const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema({
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserGoal',
    required: true,
    unique: true, // One roadmap per goal
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Roadmap", roadmapSchema);
