const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  cardNo: {
    type: Number,
    required: true,
  },
  card: {
    type: String,
    required: true,
  },
});

const flashCardSchema = new mongoose.Schema({
  lscLevel: {
    type: String,
    required: true,
  },
  Cards: [cardSchema],
});

const FlashCard = mongoose.model('FlashCard', flashCardSchema);

module.exports = FlashCard;
