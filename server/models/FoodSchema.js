const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'Foods', versionKey: false },
);

module.exports = mongoose.model('Food', FoodSchema);
