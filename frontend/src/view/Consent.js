import React from 'react';

const Consent = ({ show, onClose, onAgree }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Persetujuan Skrining Mandiri Risiko Pre Eklamsi</h2>
        <p className="mb-6">
        Saya dengan sadar dan atas dan atas keinginan sendiri bersedia menerima pelayanan skrining mandiri risiko pre eklamsi atas diri sendiri. 
        Selanjutnya saya bersedia data informasi ini dan data riwayat kesehatan diri saya dipergunakan oleh dokter, 
        fasilitas kesehatan dan BPJS kesehatan dalam rangka analisis risiko pre eklamsi.

        Data yang saya isi merupakan data yang sebenarnya. 

        Pelayanan skrining mandiri risiko pre eklamsi dapat di per oleh setiap 3 bulan sekali. 
        </p>
        <div className="flex justify-between">
          <button onClick={onClose} className="bg-red-500 text-white p-2 rounded">Tidak</button>
          <button onClick={onAgree} className="bg-green-500 text-white p-2 rounded">Setuju</button>
        </div>
      </div>
    </div>
  );
};

export default Consent;
