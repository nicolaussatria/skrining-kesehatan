
// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const createError = require('http-errors');
const User = require('./models/User'); // Import the User model
const { evaluateRisk } = require('./models/riskCriteria'); // Import riskCriteria model if needed
const app = express();

// CORS Middleware
const corsOptions = {
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB Connection
const MONGO_ATLAS_URL = process.env.MONGO_ATLAS_URL || 'mongodb+srv://nicolaussatria:gerobakijo333@cluster.gnwjw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster';
mongoose.connect(MONGO_ATLAS_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Mock Question Data
const questions = [
  {
    questionText: 'Berapakah hasil tekanan darah ibu terakhir yang di ukur oleh petugas RS atau Puskesmas ? (hasil tekanan darah dapat di lihat pada buku KIA)',
    options: [],
    category: 'Pertanyaan Klinis Kondisi Pasien',
    type: 'input',
    unit: 'mmHg',
  },
  {
    questionText: 'Apakah anda mengalami kondisi sulit tidur/cemas belebih?',
    options: ['Ya', 'Tidak'],
    category: 'Pertanyaan Klinis Kondisi Pasien',
    type: 'radio',
  },
  {
    questionText: 'Apakah anda mengalami stress emosional, dan kondisi tertekan belakangan ini?',
    options: ['Ya', 'Tidak'],
    category: 'Pertanyaan Klinis Kondisi Pasien',
    type: 'radio',
  },
  {
    questionText: 'Apakah Anda merasa pusing atau sering mengalami sakit kepala hebat yang tidak biasa?',
    options: ['Ya', 'Tidak'],
    category: 'Pertanyaan Klinis Kondisi Pasien',
    type: 'radio',
  },
  {
    questionText: 'Apakah Anda mengalami keluar cairan dari jalan lahir?',
    options: ['Ya', 'Tidak'],
    category: 'Pertanyaan Klinis Kondisi Pasien',
    type: 'radio',
  },
  {
    questionText: 'Apakah Anda merasa sesak napas atau sulit bernapas?',
    options: ['Ya', 'Tidak'],
    category: 'Pertanyaan Klinis Kondisi Pasien',
    type: 'radio',
  },
  {
    questionText: 'Apakah Anda mengalami kontraksi rahim atau nyeri yang berulang-ulang?',
    options: ['Ya', 'Tidak'],
    category: 'Pertanyaan Klinis Kondisi Pasien',
    type: 'radio',
  },
  {
    questionText: 'Apakah Anda mengalami perubahan mendadak pada penglihatan, seperti kilatan cahaya atau penglihatan kabur?',
    options: ['Ya', 'Tidak'],
    category: 'Pertanyaan Klinis Kondisi Pasien',
    type: 'radio',
  },
  {
    questionText: 'Apakah Anda mengalami pembengkakan pada area telapak kaki atau wajah?',
    options: ['Ya', 'Tidak'],
    category: 'Pertanyaan Klinis Kondisi Pasien',
    type: 'radio',
  },
  // Riwayat Kesehatan Diri
  {
    questionText: 'Apakah Anda mengalami tekanan darah tinggi sebelumnya atau memiliki riwayat preeklampsia?',
    options: ['Ya', 'Tidak'],
    category: 'Riwayat Kesehatan Diri',
    type: 'radio',
  },
  {
    questionText: 'Apakah anda sedang/pernah mengidap penyakit Diabetes Melitus (kencing manis)?',
    options: ['Ya', 'Tidak'],
    category: 'Riwayat Kesehatan Diri',
    type: 'radio',
  },
  {
    questionText: 'Apakah anda sedang/pernah mengidap penyakit ginjal?',
    options: ['Ya', 'Tidak'],
    category: 'Riwayat Kesehatan Diri',
    type: 'radio',
  },
  {
    questionText: 'Apakah anda sedang/pernah mengidap penyakit auto imun atau sakit lupus?',
    options: ['Ya', 'Tidak'],
    category: 'Riwayat Kesehatan Diri',
    type: 'radio',
  },
  {
    questionText: 'Apakah mempunyai kebiasaan merokok sebelum hamil?',
    options: ['Tidak', 'Dulu saya pernah merokok tetapi saat ini sudah berhenti'],
    category: 'Riwayat Kesehatan Diri',
    type: 'radio',
  },
  {
    questionText: 'Apakah suami atau keluarga satu rumah anda aktif dalam merokok?',
    options: ['Ya', 'Tidak'],
    category: 'Riwayat Kesehatan Diri',
    type: 'radio',
  },
  {
    questionText: 'Apakah ini adalah kehamilan pertama anda?',
    options: ['Ya', 'Tidak'],
    category: 'Riwayat Kesehatan Diri',
    type: 'radio',
  },
  {
    questionText: 'Jika anda sudah pernah melahirkan sebelumnya, berapakah jarak kehamilan terakhir dengan kehamilan saat ini?',
    options: ['jarak kehamilan > 2 tahun - 10 tahun', 'Jarak kehamilan > 10 tahun', 'jarak kehamilan < 2 tahun'],
    category: 'Riwayat Kesehatan Diri',
    type: 'radio',
  },
  // Riwayat Kesehatan Keluarga
  {
    questionText: 'Apakah Ibu atau saudara perempuan anda mempunyai penyakit hipertensi/darah tinggi?',
    options: ['Ya', 'Tidak'],
    category: 'Riwayat Kesehatan Keluarga',
    type: 'radio',
  },
  {
    questionText: 'Apakah Ibu atau saudara perempuan anda mempunyai penyakit diabetes mellitus/ kencing manis?',
    options: ['Ya', 'Tidak'],
    category: 'Riwayat Kesehatan Keluarga',
    type: 'radio',
  },
  // Pola Konsumsi Makanan
  {
    questionText: 'Apakah anda mempunyai kebiasaan makan makanan yang berasa asin?',
    options: ['Ya', 'Kadang - kadang saya mengkonsumsi makanan yang berasa asin (seminggu 3 kali)', 'Ya, hampir setiap hari saya mengkonsumsi makanan yang berasa asin'],
    category: 'Pola Konsumsi Makanan',
    type: 'radio',
  },
  {
    questionText: 'Apakah anda mempunyai kebiasaan mengkonsumsi kopi sehari hari?',
    options: ['Tidak, saya tidak pernah mengkonsumsi kopi', 'Sebulan 1-2 kali saya mengkonsumsi kopi', 'Ya, hampir setiap hari saya mengkonsumsi kopi'],
    category: 'Pola Konsumsi Makanan',
    type: 'radio',
  },
  {
    questionText: 'Apakah anda sering mengkonsumsi makanan berlemak / bersantan sehari hari?',
    options: ['Ya', 'Tidak'],
    category: 'Pola Konsumsi Makanan',
    type: 'radio',
  },
  {
    questionText: 'Apakah anda sering mengkonsumsi makanan cepat saji (KFC, McDonald, dll) sehari hari?',
    options: ['Ya', 'Tidak'],
    category: 'Pola Konsumsi Makanan',
    type: 'radio',
  },
  {
    questionText: 'Apakah anda sering mengkonsumsi minuman manis / minuman kemasan sehari hari?',
    options: ['Ya', 'Tidak'],
    category: 'Pola Konsumsi Makanan',
    type: 'radio',
  },
];

// POST: Add a new user with risk level evaluation
app.post('/api/users', async (req, res) => {
  try {
    console.log('Received data:', req.body);
    const { weight, height, education, familyContact, healthQuestions } = req.body;

    // Validate required fields
    if (!weight || !height || !education || !familyContact) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          weight: !weight,
          height: !height,
          education: !education,
          familyContact: !familyContact,
        },
      });
    }

    // Calculate risk level based on health questions
    const riskLevel = evaluateRisk(healthQuestions);

    // Create and save new user
    const newUser = new User({
      weight: Number(weight),
      height: Number(height),
      education,
      familyContact,
      healthQuestions,
      riskLevel,
    });
    const savedUser = await newUser.save();
    res.status(201).json({
      success: true,
      userId: savedUser._id,
      riskLevel: savedUser.riskLevel,
    });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({
      error: 'Error saving user data',
      details: error.message,
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

// GET: Retrieve all questions
app.get('/api/questions', (req, res) => res.json(questions));

// Error handling for 404
app.use((req, res, next) => next(createError(404)));

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
