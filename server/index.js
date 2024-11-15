const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const { evaluateRisk } = require('./models/riskCriteria');

const app = express();


const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

app.use(cors({
  origin: ['https://skrining-kesehatan-fe.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


app.use(express.json({ limit: '1mb' }));

const connectDB = async () => {
  try {
    const mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, 
      socketTimeoutMS: 45000,
      family: 4, 
      maxPoolSize: 50, 
      connectTimeoutMS: 10000,
    };

    await mongoose.connect(process.env.MONGO_ATLAS_URL || 'mongodb+srv://nicolaussatria:gerobakijo333@cluster.gnwjw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster', mongoOptions);
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

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

app.get('/api/questions', (req, res) => {
  try {
    
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch questions',
      details: error.message 
    });
  }
});

app.post('/api/users', async (req, res, next) => {
  try {
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

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
      return res.status(400).json({
        error: 'Invalid weight or height values',
        details: { weight, height }
      });
    }


    const riskLevel = evaluateRisk(healthQuestions);

  
    const newUser = new User({
      weight: Number(weight),
      height: Number(height),
      education,
      familyContact,
      healthQuestions,
      riskLevel,
    });


    const savedUser = await Promise.race([
      newUser.save(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database operation timed out after 15 seconds')), 15000)
      )
    ]);

   
    res.status(201).json({
      success: true,
      userId: savedUser._id,
      riskLevel: savedUser.riskLevel,
    });

  } catch (error) {
   
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.message.includes('timed out')) {
      return res.status(504).json({
        error: 'Gateway Timeout',
        message: 'The request took too long to process. Please try again.',
        retryAfter: 5
      });
    }

    next(error);
  }
});

// GET: Retrieve a specific user
app.get('/api/users/:userId', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .lean()  // Convert to plain JS object for faster response
      .select('-__v'); // Exclude version key

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

// GET: Retrieve all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing MongoDB connection...');
  await mongoose.connection.close();
  process.exit(0);
});
const PORT = process.env.PORT || 5001;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

module.exports = app;
