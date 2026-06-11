const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reportType: String,
    startDate: Date,
    endDate: Date,
    totalCalories: Number,
    totalProtein: Number,
    totalCarbs: Number,
    totalFat: Number,
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'Reports', versionKey: false },
);

module.exports = mongoose.model('Report', ReportSchema);
