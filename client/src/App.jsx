import './index.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import your components!
import Navbar from './components/Navbar';

// Import all your pages!
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';

function App() {
  return (
    <BrowserRouter>
      {/* 🚀 The Navbar sits here so it stays at the top of every page! */}
      <Navbar />
      
      {/* This main tag just keeps your page content organized below the Navbar */}
      <main className="min-h-screen bg-cream-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} /> 
          <Route path="/admin" element={<Dashboard />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;