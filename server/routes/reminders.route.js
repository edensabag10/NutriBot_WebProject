const express = require('express');
const Reminder = require('../models/ReminderSchema');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // TODO: Filter reminders by userId and active status.
    res.json(await Reminder.find());
  } catch (error) {
    res.status(500).json({ message: 'Failed to get reminders', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // TODO: Validate ObjectId.
    res.json(await Reminder.findById(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to get reminder', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // TODO: Validate reminder time and type.
    res.status(201).json(await Reminder.create(req.body));
  } catch (error) {
    res.status(400).json({ message: 'Failed to create reminder', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // TODO: Restrict updates to the reminder owner.
    res.json(await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (error) {
    res.status(400).json({ message: 'Failed to update reminder', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // TODO: Restrict deletes to the reminder owner.
    res.json(await Reminder.findByIdAndDelete(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete reminder', error: error.message });
  }
});

module.exports = router;
