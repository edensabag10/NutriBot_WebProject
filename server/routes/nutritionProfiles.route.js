const express = require('express');
const NutritionProfile = require('../models/NutritionProfileSchema');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // TODO: Filter profiles by userId.
    res.json(await NutritionProfile.find());
  } catch (error) {
    res.status(500).json({ message: 'Failed to get nutrition profiles', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // TODO: Validate ObjectId.
    res.json(await NutritionProfile.findById(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to get nutrition profile', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // TODO: Validate profile values.
    res.status(201).json(await NutritionProfile.create(req.body));
  } catch (error) {
    res.status(400).json({ message: 'Failed to create nutrition profile', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // TODO: Restrict updates to the profile owner.
    res.json(await NutritionProfile.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (error) {
    res.status(400).json({ message: 'Failed to update nutrition profile', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // TODO: Restrict deletes to the profile owner.
    res.json(await NutritionProfile.findByIdAndDelete(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete nutrition profile', error: error.message });
  }
});

module.exports = router;
