const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const createError = require('http-errors');
const User = require('./models/User'); // Make sure to import the User model
const app = express();

// CORS Middleware
const corsOptions = {
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware to parse JSON requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  next();
});

// MongoDB Connection
const MONGO_ATLAS_URL = process.env.MONGO_ATLAS_URL || 'mongodb+srv://nicolaussatria:gerobakijo333@cluster.gnwjw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster';
mongoose.connect(MONGO_ATLAS_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.post('/api/users', async (req, res) => {
  try {
    console.log('Received data:', req.body);
    
    // Validate required fields
    const { weight, height, education, familyContact, healthQuestions } = req.body;
    
    if (!weight || !height || !education || !familyContact) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          weight: !weight,
          height: !height,
          education: !education,
          familyContact: !familyContact
        }
      });
    }

    // Calculate risk level based on health questions
    const { evaluateRisk } = require('./models/riskCriteria');
    const riskLevel = evaluateRisk(healthQuestions);

    // Create new user with risk level
    const newUser = new User({
      weight: Number(weight),
      height: Number(height),
      education,
      familyContact,
      healthQuestions,
      riskLevel
    });

    // Save to database
    const savedUser = await newUser.save();
    
    // Send success response
    res.status(201).json({ 
      success: true, 
      userId: savedUser._id,
      riskLevel: savedUser.riskLevel 
    });

  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ 
      error: 'Error saving user data',
      details: error.message 
    });
  }
});

// GET: Retrieve all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));