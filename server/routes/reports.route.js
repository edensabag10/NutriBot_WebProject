const express = require('express');
const Report = require('../models/ReportSchema');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // TODO: Filter reports by userId and reportType.
    res.json(await Report.find());
  } catch (error) {
    res.status(500).json({ message: 'Failed to get reports', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // TODO: Validate ObjectId.
    res.json(await Report.findById(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to get report', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // TODO: Generate report values from food logs instead of trusting request body.
    res.status(201).json(await Report.create(req.body));
  } catch (error) {
    res.status(400).json({ message: 'Failed to create report', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // TODO: Reports may be generated records; review whether update is needed.
    res.json(await Report.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (error) {
    res.status(400).json({ message: 'Failed to update report', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // TODO: Restrict deletes to the report owner.
    res.json(await Report.findByIdAndDelete(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete report', error: error.message });
  }
});

module.exports = router;
