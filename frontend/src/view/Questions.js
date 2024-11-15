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

  const API_BASE_URL = 'https://skrining-kesehatan-be-git-main-nicos-projects-0cde7cf6.vercel.app';

  const categoryMapping = {
    klinis: 'Pertanyaan Klinis Kondisi Pasien',
    kesehatanDiri: 'Riwayat Kesehatan Diri',
    kesehatanKeluarga: 'Riwayat Kesehatan Keluarga',
    konsumsiMakanan: 'Pola Konsumsi Makanan',
  };
  
  const categories = Object.keys(categoryMapping);
  const currentCategory = categories[categoryIndex];

  // Create axios instance with default config
  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    // Add withCredentials if your backend supports credentials
    withCredentials: true
  });

  // Add response interceptor for error handling
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 500) {
        console.warn('Server error, falling back to local questions');
        return Promise.resolve({ data: fallbackQuestions });
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const fetchQuestions = async () => {
      setFetching(true);
      setError(null);
      
      try {
        // Try to get questions from sessionStorage first
        const cachedQuestions = sessionStorage.getItem('cachedQuestions');
        if (cachedQuestions) {
          setQuestions(JSON.parse(cachedQuestions));
          setFetching(false);
          return;
        }

        // If no cached questions, try to fetch from API
        const response = await api.get('/api/questions');
        
        if (response.data) {
          setQuestions(response.data);
          // Cache the questions
          sessionStorage.setItem('cachedQuestions', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        // Fall back to local questions if API fails
        setQuestions(fallbackQuestions);
        
        // Show user-friendly error message
        setError(
          error.response?.status === 0 
            ? 'Tidak dapat terhubung ke server. Menggunakan data lokal.' 
            : 'Terjadi kesalahan. Menggunakan data lokal.'
        );
      } finally {
        setFetching(false);
      }
    };

    fetchQuestions();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.weight || !formData.height || !formData.education) {
        throw new Error('Mohon lengkapi data diri (berat badan, tinggi badan, dan pendidikan)');
      }

      if (!formData.familyContact?.name || !formData.familyContact?.phone) {
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
      setError(
        error.message.includes('Mohon')
          ? error.message
          : 'Terjadi kesalahan saat mengirim data. Mohon coba lagi.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component code remains the same...
  const renderQuestion = (question) => {
    if (question.type === 'input' && question.questionText.includes('tekanan darah')) {
      const currentValue = formData.healthQuestions?.[currentCategory]?.[question.questionText] || {};
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

    return (
      <div key={question.questionText} className="mb-4">
        <label className="block text-gray-700 mb-2">{question.questionText}</label>
        {question.options.map((option, i) => (
          <div key={i} className="flex items-center">
            <input
              type="radio"
              name={question.questionText}
              value={option}
              checked={formData.healthQuestions?.[currentCategory]?.[question.questionText] === option}
              onChange={(e) => handleQuestionChange(question.questionText, e.target.value)}
              className="mr-2"
            />
            <label>{option}</label>
          </div>
        ))}
      </div>
    );
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Memuat pertanyaan...</div>
      </div>
    );
  }

  const currentCategoryQuestions = questions.filter(
    (q) => q.category === categoryMapping[currentCategory]
  );

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