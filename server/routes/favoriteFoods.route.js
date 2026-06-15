const express = require('express');
const FavoriteFood = require('../models/FavoriteFoodSchema');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // TODO: Filter favorite foods by userId.
    res.json(await FavoriteFood.find());
  } catch (error) {
    res.status(500).json({ message: 'Failed to get favorite foods', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // TODO: Validate ObjectId.
    res.json(await FavoriteFood.findById(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to get favorite food', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // TODO: Prevent duplicate favorites for the same user and food.
    res.status(201).json(await FavoriteFood.create(req.body));
  } catch (error) {
    res.status(400).json({ message: 'Failed to create favorite food', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // TODO: Usually favorites do not need updates; review before implementing.
    res.json(await FavoriteFood.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (error) {
    res.status(400).json({ message: 'Failed to update favorite food', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // TODO: Restrict deletes to the favorite owner.
    res.json(await FavoriteFood.findByIdAndDelete(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete favorite food', error: error.message });
  }
});

module.exports = router;
