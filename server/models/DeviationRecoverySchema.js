const mongoose = require('mongoose');

const DeviationRecoverySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: String,
    deviationDate: Date,
    extraCalories: Number,
    recoveryStartDate: Date,
    recoveryEndDate: Date,
    adjustedCaloriesPerDay: Number,
    notes: String,
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'DeviationRecoveries', versionKey: false },
);

module.exports = mongoose.model('DeviationRecovery', DeviationRecoverySchema);
