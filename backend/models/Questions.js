const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [String],
  category: String,
  type: String,
  unit: String,
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
