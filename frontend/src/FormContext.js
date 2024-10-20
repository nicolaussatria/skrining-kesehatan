import { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export const useFormData = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
   
    weight: '',
    height: '',
    education: '',
    familyContact: { name: '', address: '', phone: '', email: '' },
    healthQuestions: { klinis: {}, kesehatanDiri: {}, kesehatanKeluarga: {}, konsumsiMakanan: {} }
  });

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};
