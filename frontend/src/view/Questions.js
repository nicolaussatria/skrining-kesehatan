import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Questions = () => {
  const { state } = useLocation();
  const initialFormData = state?.formData || {};
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    ...initialFormData,
    healthQuestions: {
      klinis: {},
      kesehatanDiri: {},
      kesehatanKeluarga: {},
      konsumsiMakanan: {},
    }
  });
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Use environment variable for API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const result = await axios.get(`${API_BASE_URL}/api/questions`);
        setQuestions(result.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [API_BASE_URL]);

  const handleQuestionChange = (category, questionId, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      healthQuestions: {
        ...prevFormData.healthQuestions,
        [category]: {
          ...prevFormData.healthQuestions[category],
          [questionId]: value,
        }
      }
    }));
  };

  const handleBloodPressureChange = (category, questionId, type, value) => {
    setFormData(prevFormData => {
      const existingValue = prevFormData.healthQuestions[category][questionId] || {};
      return {
        ...prevFormData,
        healthQuestions: {
          ...prevFormData.healthQuestions,
          [category]: {
            ...prevFormData.healthQuestions[category],
            [questionId]: {
              ...existingValue,
              [type]: value
            }
          }
        }
      };
    });
  };

  const validateCurrentCategory = () => {
    const currentCategoryQuestions = questions.filter(q => q.category === categoryMapping[currentCategory]);
    const currentErrors = {};
    currentCategoryQuestions.forEach((question, index) => {
      const questionId = `${currentCategory}-${index}`;
      const answer = formData.healthQuestions[currentCategory][questionId];
      if (!answer) {
        currentErrors[questionId] = 'This question is required.';
      }
    });
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentCategory()) {
      return;
    }
    setLoading(true);
    try {
      const result = await axios.post(`${API_BASE_URL}/api/users`, formData);
      navigate(`/result/${result.data.userId}`);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = (question, index, category) => {
    const questionId = `${category}-${index}`;
    if (question.questionText === 'Berapakah hasil tekanan darah ibu terakhir yang di ukur oleh petugas RS atau Puskesmas? (hasil tekanan darah dapat di lihat pada buku KIA)') {
      const systolic = formData.healthQuestions[category][questionId]?.systolic || '';
      const diastolic = formData.healthQuestions[category][questionId]?.diastolic || '';
      return (
        <div key={questionId} className="mb-4">
          <label className="block text-gray-700 mb-2">{question.questionText}</label>
          <div className="flex items-center">
            <input
              type="text"
              value={systolic}
              onChange={(e) => handleBloodPressureChange(category, questionId, 'systolic', e.target.value)}
              placeholder="xx"
              className="w-16 p-2 border border-gray-300 rounded mr-2"
            />
            <span>/</span>
            <input
              type="text"
              value={diastolic}
              onChange={(e) => handleBloodPressureChange(category, questionId, 'diastolic', e.target.value)}
              placeholder="xx"
              className="w-16 p-2 border border-gray-300 rounded mx-2"
            />
            <span>mmHg</span>
          </div>
        </div>
      );
    }
    if (question.type === 'input') {
      return (
        <div key={questionId} className="mb-4">
          <label className="block text-gray-700 mb-2">{question.questionText}</label>
          <input
            name={questionId}
            value={formData.healthQuestions[category][questionId] || ''}
            onChange={(e) => handleQuestionChange(category, questionId, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors[questionId] && <p className="text-red-500 text-sm">{errors[questionId]}</p>}
        </div>
      );
    } else if (question.type === 'radio') {
      return (
        <div key={questionId} className="mb-4">
          <label className="block text-gray-700 mb-2">{question.questionText}</label>
          {question.options.map((option, i) => (
            <div key={`${questionId}-${i}`}>
              <input
                type="radio"
                name={questionId}
                value={option}
                onChange={(e) => handleQuestionChange(category, questionId, e.target.value)}
                className="mr-2"
              />
              <label>{option}</label>
            </div>
          ))}
          {errors[questionId] && <p className="text-red-500 text-sm">{errors[questionId]}</p>}
        </div>
      );
    }
    return null;
  };

  const categoryMapping = {
    klinis: 'Pertanyaan Klinis Kondisi Pasien',
    kesehatanDiri: 'Riwayat Kesehatan Diri',
    kesehatanKeluarga: 'Riwayat Kesehatan Keluarga',
    konsumsiMakanan: 'Pola Konsumsi Makanan'
  };

  const categories = Object.keys(categoryMapping);
  const currentCategory = categories[categoryIndex];
  const currentCategoryQuestions = questions.filter(q => q.category === categoryMapping[currentCategory]);

  const handleNextCategory = () => {
    if (!validateCurrentCategory()) {
      return;
    }
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold mb-6">{categoryMapping[currentCategory]}</h2>
            {currentCategoryQuestions.map((question, index) =>
              renderQuestion(question, index, currentCategory)
            )}
            <div className="flex justify-between mt-4">
              <button type="button" onClick={handlePreviousCategory} className="bg-blue-500 text-white p-2 rounded">
                {categoryIndex === 0 ? 'Kembali ke home' : 'Sebelumnya'}
              </button>
              {categoryIndex < categories.length - 1 && (
                <button type="button" onClick={handleNextCategory} className="bg-blue-500 text-white p-2 rounded">
                  Selanjutnya
                </button>
              )}
              {categoryIndex === categories.length - 1 && (
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                  Submit
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Questions;
