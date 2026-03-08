import './index.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context Imports
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; 

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
import TrackOrder from './pages/TrackOrder';

function App() {
  return (
    <AuthProvider> 
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          
          <main className="min-h-screen bg-[#FFFDF8]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} /> 
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/track-order" element={<TrackOrder />} />
            </Routes>
          </main>

          <Footer /> 
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;