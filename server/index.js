const express = require('express');
const cors = require('cors');
const { QuestionsService, UserService } = require('./services/supabaseClient');

const app = express();

// Add body parsing middleware - this was missing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simplified CORS configuration
app.use(cors({
  origin: ['https://skrining-kesehatan-fe.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Get all questions
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

// Create new health screening with improved validation
app.post('/api/users', async (req, res) => {
  try {
    const { weight, height, education, familyContact, healthQuestions } = req.body;

    // Enhanced validation
    if (!weight || !height || !education || !familyContact) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          weight: !weight ? 'Weight is required' : null,
          height: !height ? 'Height is required' : null,
          education: !education ? 'Education is required' : null,
          familyContact: !familyContact ? 'Family contact is required' : null
        }
      });
    }

    // Additional validation for family contact
    if (!familyContact.name || !familyContact.phone) {
      return res.status(400).json({
        error: 'Incomplete family contact information',
        details: {
          name: !familyContact.name ? 'Family contact name is required' : null,
          phone: !familyContact.phone ? 'Family contact phone is required' : null
        }
      });
    }

    const user = await UserService.createUser({
      weight: Number(weight),
      height: Number(height),
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
    console.error('Error saving user:', error);
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