const express = require('express');
const User = require('../models/UserSchema');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // TODO: Add pagination and admin authorization.
    res.json(await User.find());
  } catch (error) {
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // TODO: Validate ObjectId and hide sensitive fields.
    res.json(await User.findById(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // TODO: Add validation, password hashing, and login/register endpoints.
    res.status(201).json(await User.create(req.body));
  } catch (error) {
    res.status(400).json({ message: 'Failed to create user', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // TODO: Add authorization and update validation.
    res.json(await User.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (error) {
    res.status(400).json({ message: 'Failed to update user', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // TODO: Decide whether users should be soft deleted.
    res.json(await User.findByIdAndDelete(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

module.exports = router;
