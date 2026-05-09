const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const mockPredict = (pair) => {
  const directions = ['Bullish', 'Bearish', 'Neutral'];
  const direction = directions[Math.floor(Math.random() * directions.length)];
  const confidence = Math.floor(Math.random() * 30) + 65;
  const summaries = {
    Bullish: `${pair} shows strong upward momentum with positive sentiment.`,
    Bearish: `${pair} indicates downward pressure with weakening signals.`,
    Neutral: `${pair} is consolidating with no clear trend direction.`,
  };
  return { direction, confidence, summary: summaries[direction] };
};

// Generate prediction
router.post('/', auth, async (req, res) => {
  try {
    const { currencyPair } = req.body;
    const result = mockPredict(currencyPair);
    const prediction = await Prediction.create({
      userId: req.user.id,
      currencyPair,
      ...result,
    });
    res.json(prediction);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get history
router.get('/history', auth, async (req, res) => {
  try {
    const history = await Prediction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;