// src/view/Questions.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFormData } from '../FormContext'; // Import the context

const Questions = () => {
  const { formData, setFormData } = useFormData(); // Get form data from context
  const [questions, setQuestions] = useState([]);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [loading, setLoading] = useState(false); // Track loading state during submission
  const [fetching, setFetching] = useState(true); // Track question fetching status
  const navigate = useNavigate();

  const categoryMapping = {
    klinis: 'Pertanyaan Klinis Kondisi Pasien',
    kesehatanDiri: 'Riwayat Kesehatan Diri',
    kesehatanKeluarga: 'Riwayat Kesehatan Keluarga',
    konsumsiMakanan: 'Pola Konsumsi Makanan',
  };

  const categories = Object.keys(categoryMapping);
  const currentCategory = categories[categoryIndex];

  // Fetch questions from the backend on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const result = await axios.get(
          'https://skrining-kesehatan-be-git-main-nicos-projects-0cde7cf6.vercel.app/api/questions'
        );
        setQuestions(result.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
        alert('Failed to fetch questions. Please try again later.');
      } finally {
        setFetching(false); // Stop fetching state
      }
    };
    fetchQuestions();
  }, []);

  // Load saved form data from sessionStorage on mount
  useEffect(() => {
    const savedFormData = sessionStorage.getItem('formData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  // Save form data to sessionStorage on every change
  useEffect(() => {
    sessionStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  // Handle input changes
  const handleQuestionChange = (category, questionId, value) => {
    setFormData((prev) => ({
      ...prev,
      healthQuestions: {
        ...prev.healthQuestions,
        [category]: {
          ...prev.healthQuestions[category],
          [questionId]: value,
        },
      },
    }));
  };

  const handleBloodPressureChange = (category, questionId, type, value) => {
    setFormData((prev) => ({
      ...prev,
      healthQuestions: {
        ...prev.healthQuestions,
        [category]: {
          ...prev.healthQuestions[category],
          [questionId]: {
            ...prev.healthQuestions[category][questionId],
            [type]: value,
          },
        },
      },
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await axios.post(
        'https://skrining-kesehatan-be-git-main-nicos-projects-0cde7cf6.vercel.app/api/users',
        formData
      );

      if (response.status === 200) {
        console.log('Form submitted successfully:', response.data);
        navigate('/display-data'); 
      } else {
        console.warn('Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit the form. Please try again.');
    } finally {
      setLoading(false); 
    }
  };

  const renderQuestion = (question, index, category) => {
    const questionId = `${category}-${index}`;
    const value = formData.healthQuestions[category][questionId] || '';

    if (question.type === 'input' && question.questionText.includes('tekanan darah')) {
      const systolic = value.systolic || '';
      const diastolic = value.diastolic || '';

      return (
        <div key={questionId} className="mb-4">
          <label className="block text-gray-700 mb-2">{question.questionText}</label>
          <div className="flex items-center">
            <input
              type="number"
              value={systolic}
              onChange={(e) =>
                handleBloodPressureChange(category, questionId, 'systolic', e.target.value)
              }
              placeholder="Systolic"
              className="w-16 p-2 border border-gray-300 rounded mr-2"
            />
            <span>/</span>
            <input
              type="number"
              value={diastolic}
              onChange={(e) =>
                handleBloodPressureChange(category, questionId, 'diastolic', e.target.value)
              }
              placeholder="Diastolic"
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
            type="text"
            value={value}
            onChange={(e) => handleQuestionChange(category, questionId, e.target.value)}
            placeholder="Enter your answer"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      );
    }

    if (question.type === 'radio') {
      return (
        <div key={questionId} className="mb-4">
          <label className="block text-gray-700 mb-2">{question.questionText}</label>
          {question.options.map((option, i) => (
            <div key={`${questionId}-${i}`} className="flex items-center">
              <input
                type="radio"
                name={questionId}
                value={option}
                checked={value === option}
                onChange={(e) => handleQuestionChange(category, questionId, e.target.value)}
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

  const currentCategoryQuestions = questions.filter(
    (q) => q.category === categoryMapping[currentCategory]
  );

  if (fetching) {
    return <div>Loading questions...</div>; // Display loading state while fetching
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6">{categoryMapping[currentCategory]}</h2>
        <form onSubmit={handleSubmit}>
          {currentCategoryQuestions.map((question, index) =>
            renderQuestion(question, index, currentCategory)
          )}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handlePreviousCategory}
              className="bg-blue-500 text-white p-2 rounded"
            >
              {categoryIndex === 0 ? 'Kembali ke home' : 'Sebelumnya'}
            </button>
            {categoryIndex < categories.length - 1 && (
              <button
                type="button"
                onClick={handleNextCategory}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Selanjutnya
              </button>
            )}
            {categoryIndex === categories.length - 1 && (
              <button
                type="submit"
                className="bg-green-500 text-white p-2 rounded"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Questions;
