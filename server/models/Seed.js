const mongoose = require('mongoose');
const Question = require('./Questions');


const questions = [
    // Pertanyaan Klinis Kondisi Pasien
    {
      questionText: 'Berapakah hasil tekanan darah ibu terakhir yang di ukur oleh petugas RS atau Puskesmas? (hasil tekanan darah dapat di lihat pada buku KIA)',
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

  const seedDB = async () => {
    await Question.deleteMany({});
    await Question.insertMany(questions);
    console.log('Database seeded!');
    mongoose.connection.close();
  };

seedDB();



