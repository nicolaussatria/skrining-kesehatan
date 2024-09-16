// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Question = require('./models/Questions');
const User = require('./models/User');
const { evaluateRisk } = require('./models/riskCriteria');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/healthscreening', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/api/users', async (req, res) => {
  console.log('Received data:', req.body);
  const { bpjsNumber, weight, height, education, familyContact, healthQuestions } = req.body;
  const riskLevel = evaluateRisk(healthQuestions);

  const newUser = new User({
    bpjsNumber,
    weight,
    height,
    education,
    familyContact,
    healthQuestions,
    riskLevel,
  });

  try {
    const savedUser = await newUser.save();
    res.json({ success: true, userId: savedUser._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/questions', async (req, res) => {
  const questions = await Question.find({});
  res.send(questions);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
