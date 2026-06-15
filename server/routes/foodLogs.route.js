const express = require('express');
const FoodLog = require('../models/FoodLogSchema');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // TODO: Filter food logs by userId, date, and mealType.
    res.json(await FoodLog.find());
  } catch (error) {
    res.status(500).json({ message: 'Failed to get food logs', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // TODO: Validate ObjectId.
    res.json(await FoodLog.findById(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to get food log', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // TODO: Calculate diary totals after log creation.
    res.status(201).json(await FoodLog.create(req.body));
  } catch (error) {
    res.status(400).json({ message: 'Failed to create food log', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // TODO: Recalculate diary totals after update.
    res.json(await FoodLog.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (error) {
    res.status(400).json({ message: 'Failed to update food log', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // TODO: Recalculate diary totals after delete.
    res.json(await FoodLog.findByIdAndDelete(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete food log', error: error.message });
  }
});

module.exports = router;
