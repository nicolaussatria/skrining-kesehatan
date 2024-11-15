import { createContext, useContext, useState, useEffect } from 'react';

const FormContext = createContext();

export const useFormData = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState(() => {
    const savedData = sessionStorage.getItem('formData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
    
    return {
      weight: '',
      height: '',
      education: '',
      familyContact: {
        name: '',
        address: '',
        phone: '',
        email: ''
      },
      healthQuestions: {
        klinis: {},
        kesehatanDiri: {},
        kesehatanKeluarga: {},
        konsumsiMakanan: {}
      }
    };
  });

  useEffect(() => {
    if (formData) {
      sessionStorage.setItem('formData', JSON.stringify(formData));
    }
  }, [formData]);

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};