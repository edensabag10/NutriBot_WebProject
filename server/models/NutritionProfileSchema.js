const mongoose = require('mongoose');

const NutritionProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    age: Number,
    weight: Number,
    height: Number,
    activityLevel: String,
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'NutritionProfiles', versionKey: false },
);

module.exports = mongoose.model('NutritionProfile', NutritionProfileSchema);
