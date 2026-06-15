const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reminderType: String,
    time: String,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'Reminders', versionKey: false },
);

module.exports = mongoose.model('Reminder', ReminderSchema);
