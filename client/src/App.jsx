import './index.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import your components!
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import all your pages!
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import ProductDetails from './pages/ProductDetails';

function App() {
  return (
    <BrowserRouter>
      {/* Global Navbar at the very top */}
      <Navbar />
      
      {/* Main Content Area */}
      <main className="min-h-screen bg-cream-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} /> 
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/admin" element={<Dashboard />} />
        </Routes>
      </main>

      {/* 🌟 Global Footer at the very bottom! */}
      <Footer /> 
      
    </BrowserRouter>
  );
}

export default App;