const express = require('express');
const DeviationRecovery = require('../models/DeviationRecoverySchema');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // TODO: Filter recovery plans by userId.
    res.json(await DeviationRecovery.find());
  } catch (error) {
    res.status(500).json({ message: 'Failed to get deviation recovery plans', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // TODO: Validate ObjectId.
    res.json(await DeviationRecovery.findById(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to get deviation recovery plan', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // TODO: Calculate safe 48-hour recovery targets server-side.
    res.status(201).json(await DeviationRecovery.create(req.body));
  } catch (error) {
    res.status(400).json({ message: 'Failed to create deviation recovery plan', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // TODO: Restrict updates to the plan owner.
    res.json(await DeviationRecovery.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (error) {
    res.status(400).json({ message: 'Failed to update deviation recovery plan', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // TODO: Restrict deletes to the plan owner.
    res.json(await DeviationRecovery.findByIdAndDelete(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete deviation recovery plan', error: error.message });
  }
});

module.exports = router;
