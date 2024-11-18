const express = require('express');
const cors = require('cors');
const { QuestionsService, UserService } = require('./services/supabaseClient');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ['https://skrining-kesehatan-fe.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});




app.get('/api/questions', async (req, res) => {
  try {
    const questions = await QuestionsService.getAllQuestions();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch questions',
      details: error.message 
    });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    console.log('Received request body:', req.body); // Debug log
    
    const { weight, height, education, familyContact, healthQuestions } = req.body;

    if (!weight || !height || !education || !familyContact) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await UserService.createUser({
      weight,
      height,
      education,
      familyContact,
      healthQuestions
    });

    res.status(201).json({
      success: true,
      userId: user.id,
      riskLevel: user.risk_level
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      error: 'Error saving user data', 
      details: error.message 
    });
  }
});

// Get specific health screening
app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await UserService.getUser(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      error: 'Error fetching user data',
      details: error.message 
    });
  }
});

// Get all health screenings
app.get('/api/users', async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      error: 'Error fetching users',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));