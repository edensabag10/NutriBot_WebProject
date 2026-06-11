const mongoose = require('mongoose');

const FoodLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    date: Date,
    quantity: Number,
    mealType: String,
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'FoodLogs', versionKey: false },
);

module.exports = mongoose.model('FoodLog', FoodLogSchema);
