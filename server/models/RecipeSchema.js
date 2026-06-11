const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    ingredients: [String],
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    estimatedCost: Number,
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'Recipes', versionKey: false },
);

module.exports = mongoose.model('Recipe', RecipeSchema);
