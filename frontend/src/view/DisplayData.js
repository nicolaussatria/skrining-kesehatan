import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DisplayData = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:5001/api/users');
        setUsers(result.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchData();
  }, []);

  const renderHealthQuestions = (questions, category) => {
    if (!questions) return <p>No {category} answered.</p>;

    return (
      <div>
        <h4 className="text-md font-semibold mt-4">{category}</h4>
        {Object.entries(questions).map(([key, answer], i) => (
          <p key={i}>
            <strong>{key.replace(/-/g, ' ')}:</strong> 
            {typeof answer === 'object' && answer !== null
              ? ` ${answer.systolic}/${answer.diastolic} mmHg`
              : ` ${answer}`}
          </p>
        ))}
      </div>
    );
  };

  const categoryMapping = {
    klinis: 'Pertanyaan Klinis Kondisi Pasien',
    kesehatanDiri: 'Riwayat Kesehatan Diri',
    kesehatanKeluarga: 'Riwayat Kesehatan Keluarga',
    konsumsiMakanan: 'Pola Konsumsi Makanan'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-6">Submitted Data</h2>
        {users.map((user, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-300 rounded">
            <h3 className="text-lg font-semibold mb-2">User {index + 1}</h3>
            <p><strong>BPJS Number:</strong> {user.bpjsNumber || 'N/A'}</p>
            <p><strong>Weight:</strong> {user.weight || 'N/A'}</p>
            <p><strong>Height:</strong> {user.height || 'N/A'}</p>
            <p><strong>Education:</strong> {user.education || 'N/A'}</p>
            <h4 className="text-md font-semibold mt-4">Family Contact:</h4>
            {user.familyContact ? (
              <>
                <p><strong>Name:</strong> {user.familyContact.name || 'N/A'}</p>
                <p><strong>Address:</strong> {user.familyContact.address || 'N/A'}</p>
                <p><strong>Phone:</strong> {user.familyContact.phone || 'N/A'}</p>
                <p><strong>Email:</strong> {user.familyContact.email || 'N/A'}</p>
              </>
            ) : (
              <p>No family contact information available.</p>
            )}
            {renderHealthQuestions(user.healthQuestions?.klinis, categoryMapping.klinis)}
            {renderHealthQuestions(user.healthQuestions?.kesehatanDiri, categoryMapping.kesehatanDiri)}
            {renderHealthQuestions(user.healthQuestions?.kesehatanKeluarga, categoryMapping.kesehatanKeluarga)}
            {renderHealthQuestions(user.healthQuestions?.konsumsiMakanan, categoryMapping.konsumsiMakanan)}
            <h4 className="text-md font-semibold mt-4">Risk Level:</h4>
            <p>{user.riskLevel}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayData;
