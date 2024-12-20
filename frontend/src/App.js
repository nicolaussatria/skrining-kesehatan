// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './view/Home';
import Questions from './view/Questions';
import DisplayData from './view/DisplayData';
import Result from './view/Result';
import { FormProvider } from './FormContext'; // Import FormProvider
import './index.css';

function App() {
  return (
    <FormProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/display-data" element={<DisplayData />} />
          <Route path="/result/:userId" element={<Result />} />
        </Routes>
      </Router>
    </FormProvider>
  );
}

export default App;
