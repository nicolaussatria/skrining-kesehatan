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
  const navigate = useNavigate();

  const categoryMapping = {
    klinis: 'Pertanyaan Klinis Kondisi Pasien',
    kesehatanDiri: 'Riwayat Kesehatan Diri',
    kesehatanKeluarga: 'Riwayat Kesehatan Keluarga',
    konsumsiMakanan: 'Pola Konsumsi Makanan',
  };

  const categories = Object.keys(categoryMapping);
  const currentCategory = categories[categoryIndex];

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://skrining-kesehatan-be-git-main-nicos-projects-0cde7cf6.vercel.app/api/questions');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
        alert('Failed to fetch questions. Please try again later.');
      } finally {
        setFetching(false);
      }
    };
    fetchQuestions();
  }, []);

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const dataToSubmit = {
        ...formData,
        healthQuestions: {
          klinis: formData.healthQuestions.klinis || {},
          kesehatanDiri: formData.healthQuestions.kesehatanDiri || {},
          kesehatanKeluarga: formData.healthQuestions.kesehatanKeluarga || {},
          konsumsiMakanan: formData.healthQuestions.konsumsiMakanan || {}
        }
      };

      const response = await axios.post(
        'https://skrining-kesehatan-be-git-main-nicos-projects-0cde7cf6.vercel.app/api/users',
        dataToSubmit,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data && response.data.userId) {
        navigate(`/result/${response.data.userId}`);
      } else {
        navigate('/display-data');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting form. Please try again.');
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