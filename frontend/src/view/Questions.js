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
  const [submissionAttempts, setSubmissionAttempts] = useState(0);
  const navigate = useNavigate();

  const API_BASE_URL = 'https://skrining-kesehatan-be-git-main-nicos-projects-0cde7cf6.vercel.app';
  const MAX_RETRIES = 3;
  const INITIAL_RETRY_DELAY = 2000;

  const categoryMapping = {
    klinis: 'Pertanyaan Klinis Kondisi Pasien',
    kesehatanDiri: 'Riwayat Kesehatan Diri',
    kesehatanKeluarga: 'Riwayat Kesehatan Keluarga',
    konsumsiMakanan: 'Pola Konsumsi Makanan',
  };
  const categories = Object.keys(categoryMapping);
  const currentCategory = categories[categoryIndex];

  const axiosWithRetry = axios.create({
    baseURL: API_BASE_URL,
    timeout: 20000, 
  });

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
    // First try to get questions from sessionStorage
    const cachedQuestions = sessionStorage.getItem('cachedQuestions');
    if (cachedQuestions) {
      setQuestions(JSON.parse(cachedQuestions));
      setFetching(false);
      return;
    }

    const response = await axios.get(`${API_BASE_URL}/api/questions`, {
      timeout: 10000,
      retries: 3,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.data) {
      setQuestions(response.data);
      sessionStorage.setItem('cachedQuestions', JSON.stringify(response.data));
    }
  } catch (error) {
    setError(error.response?.data?.error || error.message);
   
    setQuestions(fallbackQuestions);
  } finally {
    setFetching(false);
  }
};

    fetchQuestions();
  }, [API_BASE_URL]);

  useEffect(() => {
    const savedFormData = sessionStorage.getItem('formData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, [setFormData]);

  useEffect(() => {
    if (formData) {
      sessionStorage.setItem('formData', JSON.stringify(formData));
    }
  }, [formData]);

  const handleQuestionChange = (questionText, value) => {
    setFormData(prev => ({
      ...prev,
      healthQuestions: {
        ...prev.healthQuestions,
        [currentCategory]: {
          ...prev.healthQuestions[currentCategory],
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
          ...prev.healthQuestions[currentCategory],
          [questionText]: {
            ...prev.healthQuestions[currentCategory][questionText],
            [type]: value
          }
        }
      }
    }));
  };

  axiosWithRetry.interceptors.response.use(null, async (error) => {
    const { config } = error;
    config.retryCount = config.retryCount || 0;

    if (config.retryCount >= MAX_RETRIES) {
      return Promise.reject(error);
    }

    // Exponential backoff delay
    const delayTime = INITIAL_RETRY_DELAY * Math.pow(2, config.retryCount);
    config.retryCount += 1;
    setSubmissionAttempts(config.retryCount);

    return new Promise(resolve => {
      setTimeout(() => resolve(axiosWithRetry(config)), delayTime);
    });
  });
  

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSubmissionAttempts(0);
    try {
      // Validate required fields
      if (!formData.weight || !formData.height || !formData.education) {
        alert('Mohon lengkapi data diri (berat badan, tinggi badan, dan pendidikan)');
        navigate('/');
        return;
      }
  
      if (!formData.familyContact?.name || !formData.familyContact?.phone) {
        alert('Mohon lengkapi data kontak keluarga (minimal nama dan nomor telepon)');
        navigate('/');
        return;
      }
  
      const validateAnswers = () => {
        for (const category of categories) {
          const categoryQuestions = questions.filter(
            q => q.category === categoryMapping[category]
          );
          
          for (const question of categoryQuestions) {
            const answer = formData.healthQuestions?.[category]?.[question.questionText];
            
            if (question.type === 'input' && question.questionText.includes('tekanan darah')) {
              if (!answer?.systolic || !answer?.diastolic) {
                throw new Error(`Mohon isi tekanan darah di bagian ${categoryMapping[category]}`);
              }
            } else if (!answer) {
              throw new Error(`Mohon jawab semua pertanyaan di bagian ${categoryMapping[category]}`);
            }
          }
        }
      };
      
      validateAnswers();
     
  
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
        healthQuestions: {
          klinis: formData.healthQuestions?.klinis || {},
          kesehatanDiri: formData.healthQuestions?.kesehatanDiri || {},
          kesehatanKeluarga: formData.healthQuestions?.kesehatanKeluarga || {},
          konsumsiMakanan: formData.healthQuestions?.konsumsiMakanan || {}
        }
      };

      const response = await axiosWithRetry.post('/api/users', dataToSubmit);
  
      if (response.data?.userId) {
        
        sessionStorage.removeItem('formData');
        sessionStorage.removeItem('cachedQuestions');
        navigate(`/result/${response.data.userId}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Submission error:', error);
      let errorMessage = 'Terjadi kesalahan saat mengirim data.';
      if (error.message.includes('Mohon')) {
        errorMessage = error.message;
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.message || 'Mohon periksa kembali data yang diinput';
      } else if (error.code === 'ECONNABORTED' || error.response?.status === 504) {
        errorMessage = 'Koneksi ke server timeout. Mohon periksa koneksi internet Anda.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = (question) => {
    if (question.type === 'input' && question.questionText.includes('tekanan darah')) {
      const currentValue = formData.healthQuestions[currentCategory][question.questionText] || {};
      return (
        <div key={question.questionText} className="mb-4">
          <label className="block text-gray-700 mb-2">{question.questionText}</label>
          <div className="flex items-center">
            <input
              type="number"
              value={currentValue.systolic || ''}
              onChange={(e) => handleBloodPressureChange(question.questionText, 'systolic', e.target.value)}
              placeholder="Systolic"
              className="w-16 p-2 border border-gray-300 rounded mr-2"
            />
            <span>/</span>
            <input
              type="number"
              value={currentValue.diastolic || ''}
              onChange={(e) => handleBloodPressureChange(question.questionText, 'diastolic', e.target.value)}
              placeholder="Diastolic"
              className="w-16 p-2 border border-gray-300 rounded mx-2"
            />
            <span>mmHg</span>
          </div>
        </div>
      );
    }

    if (question.type === 'radio') {
      const currentValue = formData.healthQuestions[currentCategory][question.questionText] || '';
      return (
        <div key={question.questionText} className="mb-4">
          <label className="block text-gray-700 mb-2">{question.questionText}</label>
          {question.options.map((option, i) => (
            <div key={i} className="flex items-center">
              <input
                type="radio"
                name={question.questionText}
                value={option}
                checked={currentValue === option}
                onChange={(e) => handleQuestionChange(question.questionText, e.target.value)}
                className="mr-2"
              />
              <label>{option}</label>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const handleNextCategory = () => {
    if (categoryIndex < categories.length - 1) {
      setCategoryIndex(categoryIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousCategory = () => {
    if (categoryIndex > 0) {
      setCategoryIndex(categoryIndex - 1);
    } else {
      navigate('/');
    }
  };

  if (fetching) {
    return <div>Loading questions...</div>;
  }

  const currentCategoryQuestions = questions.filter(
    (q) => q.category === categoryMapping[currentCategory]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6">{categoryMapping[currentCategory]}</h2>
       
        <form onSubmit={(e) => e.preventDefault()}>
          {currentCategoryQuestions.map((question) => renderQuestion(question))}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handlePreviousCategory}
              className="bg-blue-500 text-white p-2 rounded"
            >
              {categoryIndex === 0 ? 'Kembali ke home' : 'Sebelumnya'}
            </button>
            <button
              type="button"
              onClick={handleNextCategory}
              className={`${
                categoryIndex === categories.length - 1 ? 'bg-green-500' : 'bg-blue-500'
              } text-white p-2 rounded`}
              disabled={loading}
            >
              {categoryIndex === categories.length - 1
                ? loading ? 'Submitting...' : 'Submit'
                : 'Selanjutnya'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Questions;