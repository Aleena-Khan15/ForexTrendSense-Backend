const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  currencyPair: { type: String, required: true },
  direction: { type: String, required: true },
  confidence: { type: Number, required: true },
  summary: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Prediction', predictionSchema);
