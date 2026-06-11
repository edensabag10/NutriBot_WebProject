const express = require('express');
const Recipe = require('../models/RecipeSchema');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // TODO: Add budget-based recipe filtering.
    res.json(await Recipe.find());
  } catch (error) {
    res.status(500).json({ message: 'Failed to get recipes', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // TODO: Validate ObjectId.
    res.json(await Recipe.findById(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to get recipe', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // TODO: Validate recipe ingredients, macros, and cost.
    res.status(201).json(await Recipe.create(req.body));
  } catch (error) {
    res.status(400).json({ message: 'Failed to create recipe', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // TODO: Add permissions before update.
    res.json(await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (error) {
    res.status(400).json({ message: 'Failed to update recipe', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // TODO: Add permissions before delete.
    res.json(await Recipe.findByIdAndDelete(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete recipe', error: error.message });
  }
});

module.exports = router;
