const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  gameType: {
    type: String,
    default: 'counter'
  }
}, {
  timestamps: true
});

scoreSchema.index({ score: -1 });

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score; 