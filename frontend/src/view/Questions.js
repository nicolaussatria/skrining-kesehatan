import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFormData } from '../FormContext';


const Questions = () => {
  const { formData, setFormData } = useFormData();
  const [questions, setQuestions] = useState([]);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://skrining-kesehatan-be-git-main-nicos-projects-0cde7cf6.vercel.app';

  const categoryMapping = {
    klinis: 'Pertanyaan Klinis Kondisi Pasien',
    kesehatanDiri: 'Riwayat Kesehatan Diri',
    kesehatanKeluarga: 'Riwayat Kesehatan Keluarga',
    konsumsiMakanan: 'Pola Konsumsi Makanan'
  };
  
  const categories = Object.keys(categoryMapping);
  const currentCategory = categories[categoryIndex];

  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });

  api.interceptors.request.use(
    config => {
      console.log('Making request to:', config.url);
      return config;
    },
    error => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    response => {
      console.log('API Response:', response);
      return response;
    },
    error => {
      console.error('API Error:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      if (error.response?.status === 404) {
        console.warn('API endpoint not found, falling back to local questions');
        return Promise.resolve({ data: fallbackQuestions });
      }
      if (error.response?.status === 500 || !error.response) {
        console.warn('Server error or network issue, falling back to local questions');
        return Promise.resolve({ data: fallbackQuestions });
      }

      return Promise.reject(error);
    }
  );

  const fallbackQuestions = [
 
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

  

  useEffect(() => {
    const fetchQuestions = async () => {
      setFetching(true);
      setError(null);
      
      try {
        const response = await api.get('/api/questions');
        
        if (response.data && Array.isArray(response.data)) {
          // No need to transform the data structure, just use it as is
          setQuestions(response.data);
          sessionStorage.setItem('cachedQuestions', JSON.stringify(response.data));
        } else {
          console.warn('Invalid response format, using fallback questions');
          setQuestions(fallbackQuestions);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setQuestions(fallbackQuestions);
      } finally {
        setFetching(false);
      }
    };

    fetchQuestions();
  }, []);

 const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Validate form data
      if (!formData?.weight || !formData?.height || !formData?.education) {
        throw new Error('Mohon lengkapi data diri (berat badan, tinggi badan, dan pendidikan)');
      }

      if (!formData?.familyContact?.name || !formData?.familyContact?.phone) {
        throw new Error('Mohon lengkapi data kontak keluarga (minimal nama dan nomor telepon)');
      }

      // Prepare data for submission
      const dataToSubmit = {
        weight: Number(formData.weight),
        height: Number(formData.height),
        education: formData.education,
        familyContact: {
          name: formData.familyContact.name,
          address: formData.familyContact.address || '',
          phone: formData.familyContact.phone,
          email: formData.familyContact.email || ''
        },
        healthQuestions: formData.healthQuestions || {}
      };

      // Submit data with retry logic
      const response = await api.post('/api/users', dataToSubmit);

      if (response.data?.userId) {
        // Clear stored data and navigate to results
        sessionStorage.removeItem('formData');
        sessionStorage.removeItem('cachedQuestions');
        navigate(`/result/${response.data.userId}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Submission error:', error);
      
      // More specific error handling
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.message.includes('Mohon')) {
        setError(error.message);
      } else {
        setError('Terjadi kesalahan saat mengirim data. Mohon coba lagi.');
      }
      
      // Scroll error into view
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };
  

  const handleQuestionChange = (questionText, value) => {
    setFormData(prev => ({
      ...prev,
      healthQuestions: {
        ...prev.healthQuestions,
        [currentCategory]: {
          ...prev.healthQuestions?.[currentCategory],
          [questionText]: value
        }
      }
    }));
  };


  const handleBloodPressureChange = (questionText, type, value) => {
    setFormData(prev => ({
      ...prev,
      healthQuestions: {
        ...prev.healthQuestions,
        [currentCategory]: {
          ...prev.healthQuestions?.[currentCategory],
          [questionText]: {
            ...prev.healthQuestions?.[currentCategory]?.[questionText],
            [type]: value
          }
        }
      }
    }));
  };

  
  const renderQuestion = (question) => {
    if (!question || typeof question.question_text !== 'string') {
      return null;
    }

    // Special handling for blood pressure input
    if (question.type === 'input' && question.question_text.toLowerCase().includes('tekanan darah')) {
      const currentValue = formData?.healthQuestions?.[currentCategory]?.[question.question_text] || {};
      return (
        <div key={question.id} className="mb-4">
          <label className="block text-gray-700 mb-2">{question.question_text}</label>
          <div className="flex items-center">
            <input
              type="number"
              value={currentValue.systolic || ''}
              onChange={(e) => handleBloodPressureChange(question.question_text, 'systolic', e.target.value)}
              placeholder="Systolic"
              className="w-16 p-2 border border-gray-300 rounded mr-2"
            />
            <span>/</span>
            <input
              type="number"
              value={currentValue.diastolic || ''}
              onChange={(e) => handleBloodPressureChange(question.question_text, 'diastolic', e.target.value)}
              placeholder="Diastolic"
              className="w-16 p-2 border border-gray-300 rounded mx-2"
            />
            <span>{question.unit || 'mmHg'}</span>
          </div>
        </div>
      );
    }

    // Regular radio button questions
    if (!Array.isArray(question.options)) {
      return null;
    }

    return (
      <div key={question.id} className="mb-4">
        <label className="block text-gray-700 mb-2">{question.question_text}</label>
        {question.options.map((option, i) => (
          <div key={`${question.id}-${i}`} className="flex items-center">
            <input
              type="radio"
              name={question.question_text}
              value={option}
              checked={formData?.healthQuestions?.[currentCategory]?.[question.question_text] === option}
              onChange={(e) => handleQuestionChange(question.question_text, e.target.value)}
              className="mr-2"
            />
            <label>{option}</label>
          </div>
        ))}
      </div>
    );
  };


 
  const currentCategoryQuestions = questions.filter(q => 
    q && 
    typeof q.category === 'string' && 
    q.category === categoryMapping[currentCategory]
  );

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Memuat pertanyaan...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6">{categoryMapping[currentCategory]}</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          {currentCategoryQuestions.map(renderQuestion)}
          
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => categoryIndex === 0 ? navigate('/') : setCategoryIndex(categoryIndex - 1)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              {categoryIndex === 0 ? 'Kembali' : 'Sebelumnya'}
            </button>
            
            <button
              type="button"
              onClick={() => categoryIndex === categories.length - 1 ? handleSubmit() : setCategoryIndex(categoryIndex + 1)}
              className={`${
                categoryIndex === categories.length - 1 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white px-4 py-2 rounded transition-colors`}
              disabled={loading}
            >
              {loading ? 'Mengirim...' : categoryIndex === categories.length - 1 ? 'Kirim' : 'Selanjutnya'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Questions;