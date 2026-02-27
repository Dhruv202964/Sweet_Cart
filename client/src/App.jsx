import './index.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import all your pages!
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu'; // 👈 THIS WAS MISSING!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} /> 
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;