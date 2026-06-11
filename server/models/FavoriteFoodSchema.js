const mongoose = require('mongoose');

const FavoriteFoodSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'FavoriteFoods', versionKey: false },
);

module.exports = mongoose.model('FavoriteFood', FavoriteFoodSchema);
