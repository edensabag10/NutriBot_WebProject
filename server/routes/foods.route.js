const express = require('express');
const Food = require('../models/FoodSchema');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // TODO: Add search by food name and nutrition filters.
    res.json(await Food.find());
  } catch (error) {
    res.status(500).json({ message: 'Failed to get foods', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // TODO: Validate ObjectId.
    res.json(await Food.findById(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to get food', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // TODO: Validate food nutrition values.
    res.status(201).json(await Food.create(req.body));
  } catch (error) {
    res.status(400).json({ message: 'Failed to create food', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // TODO: Add admin permissions.
    res.json(await Food.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (error) {
    res.status(400).json({ message: 'Failed to update food', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // TODO: Add admin permissions.
    res.json(await Food.findByIdAndDelete(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete food', error: error.message });
  }
});

module.exports = router;
