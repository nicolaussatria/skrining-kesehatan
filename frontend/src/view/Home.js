import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Consent from './Consent';

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    education: '',
    familyContact: {
      name: '',
      address: '',
      phone: '',
      email: ''
    }
  });

  const [showConsent, setShowConsent] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('familyContact.')) {
      const key = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        familyContact: {
          ...prevData.familyContact,
          [key]: value
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  

  // Basic validation before showing consent
  const validateForm = () => {
    let formErrors = {};
    // if (!formData.bpjsNumber) formErrors.bpjsNumber = 'BPJS Number is required.';
    if (!formData.weight) formErrors.weight = 'Weight is required.';
    if (!formData.height) formErrors.height = 'Height is required.';
    if (!formData.education) formErrors.education = 'Education is required.';
    if (!formData.familyContact.name) formErrors.familyContactName = 'Family contact name is required.';
    if (!formData.familyContact.phone) formErrors.familyContactPhone = 'Family contact phone is required.';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Handle next button click
  const handleNext = () => {
    navigate('/questions'); // Navigate to questions page
  };


  // Handle consent dialog close
  const handleConsentClose = () => {
    setShowConsent(false);
  };

  // Handle consent agree action
  const handleConsentAgree = () => {
    setShowConsent(false);
    navigate('/questions', { state: { formData } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6">Data Diri</h2>
        <form>
          {/* <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="bpjsNumber">
              No Kartu BPJS
            </label>
            <input
              id="bpjsNumber"
              name="bpjsNumber"
              value={formData.bpjsNumber}
              onChange={handleChange}
              placeholder="0000000000000"
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.bpjsNumber && <p className="text-red-500 text-sm">{errors.bpjsNumber}</p>}
          </div> */}
          <div className="flex mb-4">
            <div className="w-1/2 mr-2">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="weight">
                Berat Badan (Kg)
              </label>
              <input
              type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Berat Badan"
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
            </div>
            <div className="w-1/2 ml-2">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="height">
                Tinggi Badan (Cm)
              </label>
              <input
              type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Tinggi Badan"
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="education">
              Pendidikan Terakhir
            </label>
            <select
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Pendidikan Terakhir</option>
              <option value="SD/Sederajat">SD/Sederajat</option>
              <option value="SMP/Sederajat">SMP/Sederajat</option>
              <option value="SMA/Sederajat">SMA/Sederajat</option>
              <option value="Diploma">Diploma</option>
              <option value="Sarjana">Sarjana</option>
            </select>
            {errors.education && <p className="text-red-500 text-sm">{errors.education}</p>}
          </div>
          <div className="p-4 mb-4 border border-gray-300 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 bg-blue-100 p-3 rounded -mx-4 -mt-4 px-8 py-3">
              Keluarga yang bisa dihubungi
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="familyContact.name">
                Nama
              </label>
              <input
                id="familyContact.name"
                name="familyContact.name"
                value={formData.familyContact.name}
                onChange={handleChange}
                placeholder="Nama Lengkap"
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.familyContactName && <p className="text-red-500 text-sm">{errors.familyContactName}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="familyContact.address">
                Alamat Rumah
              </label>
              <input
                id="familyContact.address"
                name="familyContact.address"
                value={formData.familyContact.address}
                onChange={handleChange}
                placeholder="Alamat Rumah"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="familyContact.phone">
                No Telepon/HP
              </label>
              <input
              type="number"
                id="familyContact.phone"
                name="familyContact.phone"
                value={formData.familyContact.phone}
                onChange={handleChange}
                placeholder="No Telepon/HP"
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.familyContactPhone && <p className="text-red-500 text-sm">{errors.familyContactPhone}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="familyContact.email">
                Email
              </label>
              <input
                id="familyContact.email"
                name="familyContact.email"
                value={formData.familyContact.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <button type="button" onClick={handleNext} className="w-full bg-blue-500 text-white p-2 rounded">
            Selanjutnya
          </button>
        </form>
      </div>
      <Consent show={showConsent} onClose={handleConsentClose} onAgree={handleConsentAgree} />
    </div>
  );
};

export default Home;


