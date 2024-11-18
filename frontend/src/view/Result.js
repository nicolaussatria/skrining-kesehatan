import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Result = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'https://skrining-kesehatan-be-git-main-nicos-projects-0cde7cf6.vercel.app';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${API_BASE_URL}/api/users/${userId}`);
        setUser(result.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to fetch user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getNextScreeningDate = (dateString) => {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() + 3); // Add 3 months for next screening
    return formatDate(date);
  };

  const getBMI = (weight, height) => {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500 text-center p-4">{error}</div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">No user data available.</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4">
            <h2 className="text-2xl font-semibold">Hasil Skrining Kesehatan</h2>
            <p className="text-sm opacity-90">ID: {user.id}</p>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Informasi Pribadi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-gray-600">Nama</p>
                    <p className="font-medium">{user.family_contact?.name}</p>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{user.family_contact?.email}</p>
                    <p className="text-gray-600">Telepon</p>
                    <p className="font-medium">{user.family_contact?.phone}</p>
                    <p className="text-gray-600">Alamat</p>
                    <p className="font-medium">{user.family_contact?.address}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-gray-600">Tinggi Badan</p>
                    <p className="font-medium">{user.height} cm</p>
                    <p className="text-gray-600">Berat Badan</p>
                    <p className="font-medium">{user.weight} kg</p>
                    <p className="text-gray-600">BMI</p>
                    <p className="font-medium">{getBMI(user.weight, user.height)}</p>
                    <p className="text-gray-600">Pendidikan</p>
                    <p className="font-medium">{user.education}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Level Card */}
            <div className={`mb-8 p-6 rounded-lg ${
              user.risk_level === 'high' ? 'bg-red-50 border-red-200' :
              user.risk_level === 'medium' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            } border`}>
              <h3 className={`text-xl font-bold mb-2 ${
                user.risk_level === 'high' ? 'text-red-700' :
                user.risk_level === 'medium' ? 'text-yellow-700' :
                'text-green-700'
              }`}>
                {user.risk_level === 'high' ? 'Risiko Tinggi Preeklampsia' :
                 user.risk_level === 'medium' ? 'Risiko Sedang Preeklampsia' :
                 'Risiko Rendah Preeklampsia'}
              </h3>
              <p className="text-gray-700">
                {user.risk_level === 'high' ? 
                  'Segera konsultasikan kondisi anda dengan dokter atau bidan terdekat.' :
                 user.risk_level === 'medium' ? 
                  'Perhatikan pola makan dan gaya hidup. Lakukan pemeriksaan rutin.' :
                  'Tetap jaga pola hidup sehat dan lakukan pemeriksaan rutin sesuai jadwal.'}
              </p>
            </div>

            {/* Screening Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Tanggal Skrining</p>
                  <p className="font-medium">{formatDate(user.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Skrining Selanjutnya</p>
                  <p className="font-medium text-blue-600">{getNextScreeningDate(user.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;