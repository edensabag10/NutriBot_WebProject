const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goalType: String,
    targetCalories: Number,
    targetProtein: Number,
    targetCarbs: Number,
    targetFat: Number,
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'Goals', versionKey: false },
);

module.exports = mongoose.model('Goal', GoalSchema);
