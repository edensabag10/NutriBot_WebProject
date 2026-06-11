const express = require('express');
const Goal = require('../models/GoalSchema');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // TODO: Filter goals by userId.
    res.json(await Goal.find());
  } catch (error) {
    res.status(500).json({ message: 'Failed to get goals', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // TODO: Validate ObjectId.
    res.json(await Goal.findById(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to get goal', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // TODO: Validate supported goal types and macro targets.
    res.status(201).json(await Goal.create(req.body));
  } catch (error) {
    res.status(400).json({ message: 'Failed to create goal', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // TODO: Restrict updates to the goal owner.
    res.json(await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (error) {
    res.status(400).json({ message: 'Failed to update goal', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // TODO: Restrict deletes to the goal owner.
    res.json(await Goal.findByIdAndDelete(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete goal', error: error.message });
  }
});

module.exports = router;
