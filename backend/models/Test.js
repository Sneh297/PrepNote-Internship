const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Question schema
const QuestionSchema = new Schema({
  questionNo: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [String],
  answer: {
    type: String,
    required: true,
  },
});

// Define the Test schema
const TestSchema = new Schema({
  testnum: {
    type: String,
    required: true,
  },
  questions: [QuestionSchema],
});

// Create a Model based on the schema
const Test = mongoose.model('Test', TestSchema);

module.exports = Test;
