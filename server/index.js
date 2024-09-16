

// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const { evaluateRisk } = require('./models/riskCriteria');

const app = express();

// CORS Configuration
const whitelist = ['*']; // You can specify specific domains if needed

app.use((req, res, next) => {
  const origin = req.get('referer');
  const isWhitelisted = whitelist.find((w) => origin && origin.includes(w));
  if (isWhitelisted) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
  }
  if (req.method === 'OPTIONS') res.sendStatus(200);
  else next();
});

// Set up middleware for parsing JSON, cookies, and logging
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger('dev'));

// Set Context Middleware
const setContext = (req, res, next) => {
  if (!req.context) req.context = {};
  next();
};
app.use(setContext);

// MongoDB Connection
const MONGO_ATLAS_URL = process.env.MONGO_ATLAS_URL || 'mongodb+srv://nicolaussatria:gerobakijo333@cluster.gnwjw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster';
mongoose.connect(MONGO_ATLAS_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Mock data stores
let users = [];
let questions = [
  // Add your questions as defined previously
];

// Routes for handling API requests
app.post('/api/users', (req, res) => {
  console.log('Received data:', req.body);
  const { bpjsNumber, weight, height, education, familyContact, healthQuestions } = req.body;
  const riskLevel = evaluateRisk(healthQuestions);

  const newUser = {
    id: users.length + 1,
    bpjsNumber,
    weight,
    height,
    education,
    familyContact,
    healthQuestions,
    riskLevel,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users.push(newUser);
  res.json({ success: true, userId: newUser.id });
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find((u) => u.id == req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

app.get('/api/questions', (req, res) => {
  res.json(questions);
});

// Error handling
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({ error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
