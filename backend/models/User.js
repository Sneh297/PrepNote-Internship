const mongoose = require('mongoose');

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  currentPlan: {
    type: String,
    enum: ['free', 'premium'], // Add all valid plan types here
    default: 'free',
    required: true,
  },
  testGiven: {
    type: Number,
    default: 0,
  },
});

module.exports = User;
