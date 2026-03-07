import './index.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// New Context Imports
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; // 🌟 NEW!

// Component Imports
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Imports
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider> {/* 🌟 Wrap everything in AuthProvider first! */}
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          
          <main className="min-h-screen bg-cream-50">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} /> 
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/admin" element={<Dashboard />} />
            </Routes>
          </main>

          <Footer /> 
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;