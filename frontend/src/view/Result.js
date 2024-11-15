import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Result = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use environment variable for API base URL
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
  }, [userId, API_BASE_URL]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (!user) return <div>No user data available.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6">Hasil Skrining Riwayat Kesehatan</h2>
        <div className="p-4 rounded-lg shadow-md border border-gray-300">
          <h3 className="text-lg font-semibold bg-blue-100 p-4 rounded -mx-4 mb-4 -mt-4">Info Skrining Sekunder</h3>
          <table className="w-full">
            <tbody>
          
              <tr>
                <td className="px-4 py-2 font-semibold border-b border-gray-300">Nama</td>
                <td className="px-4 py-2 border-b border-gray-300">{user.familyContact?.name || 'N/A'}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold border-b border-gray-300">Tgl Skrining</td>
                <td className="px-4 py-2 border-b border-gray-300">{new Date().toLocaleDateString()}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold border-b border-gray-300">Alamat</td>
                <td className="px-4 py-2 border-b border-gray-300">{user.familyContact?.address || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
          <p className="text-red-500 mt-4">Skrining selanjutnya hanya dapat dilakukan mulai tanggal 01/01/2025</p>
        </div>
        <div className="mt-6">
          {user.riskLevel === "high" && (
            <div className="bg-red-100 p-4 rounded-lg shadow-md">
              <p className="text-red-600 font-semibold">Risiko Tinggi Preeklampsia</p>
              <p>Segera konsultasikan ke dokter.</p>
            </div>
          )}
          {user.riskLevel === "medium" && (
            <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
              <p className="text-yellow-600 font-semibold">Risiko Sedang Preeklampsia</p>
              <p>Perhatikan pola makan dan gaya hidup.</p>
            </div>
          )}
          {user.riskLevel === "low" && (
            <div className="bg-green-100 p-4 rounded-lg shadow-md">
              <p className="text-green-600 font-semibold">Risiko Rendah Preeklampsia</p>
              <p>Jaga pola hidup sehat, lakukan latihan fisik rutin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
