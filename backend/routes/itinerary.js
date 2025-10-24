const express = require('express');
const router = express.Router();
const Itinerary = require('../models/Itinerary');
const authMiddleware = require('../middleware/auth');

// Get all itineraries for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single itinerary by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get itinerary by shareable UUID (public)
router.get('/share/:uuid', async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ shareableUUID: req.params.uuid });
    
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new itinerary
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tripName, startDate, endDate } = req.body;
    
    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    // Create empty days array
    const days = Array.from({ length: dayCount }, (_, i) => ({
      day: i + 1,
      activities: []
    }));
    
    const itinerary = new Itinerary({
      userId: req.userId,
      tripName,
      startDate,
      endDate,
      days
    });
    
    await itinerary.save();
    res.status(201).json(itinerary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update itinerary
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete itinerary
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    res.json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add activity to a day
router.post('/:id/day/:dayNumber/activity', authMiddleware, async (req, res) => {
  try {
    const { time, title, location, notes } = req.body;
    const { id, dayNumber } = req.params;
    
    const itinerary = await Itinerary.findOne({ _id: id, userId: req.userId });
    
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    const dayIndex = itinerary.days.findIndex(d => d.day === parseInt(dayNumber));
    
    if (dayIndex === -1) {
      return res.status(404).json({ message: 'Day not found' });
    }
    
    itinerary.days[dayIndex].activities.push({ time, title, location, notes });
    await itinerary.save();
    
    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;