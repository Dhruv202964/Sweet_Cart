import './index.css';
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Context Imports
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; 

// Component Imports
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Page Imports
import Home from './pages/Home';
import Dashboard from './pages/Dashboard'; // Admin Dashboard
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment'; 
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword'; 
import TrackOrder from './pages/TrackOrder';
import MyAccount from './pages/MyAccount';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Team from './pages/Team';
import MakeYourOwnBox from './pages/MakeYourOwnBox'; 
import GiftPlayback from './pages/GiftPlayback'; // 📼 NEW IMPORT

// 🌟 LEAD DEV TRICK: This automatically hides the Navbar/Footer for the cinematic Audio page!
const Layout = ({ children }) => {
  const location = useLocation();
  const isCinematicPage = location.pathname.startsWith('/gift');

  return (
    <>
      {!isCinematicPage && <Navbar />}
      <main className={`min-h-screen ${isCinematicPage ? 'bg-[#0a0a0a]' : 'bg-[#FFFDF8]'}`}>
        {children}
      </main>
      {!isCinematicPage && <Footer />}
    </>
  );
};

function App() {
  return (
    <AuthProvider> 
      <CartProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* 🟢 PUBLIC ROUTES */}
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} /> 
              <Route path="/make-your-own-box" element={<MakeYourOwnBox />} /> 
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment/:order_id" element={<Payment />} /> 
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} /> 
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/account" element={<MyAccount />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/team" element={<Team />} />

              {/* 📼 THE CINEMATIC VOICE GIFT ROUTE */}
              <Route path="/gift/:id" element={<GiftPlayback />} />

              {/* 🛡️ PROTECTED ADMIN ROUTES (THE VAULT) 🛡️ */}
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<Dashboard />} />
                {/* Any future admin pages go inside here too! */}
              </Route>

            </Routes>
          </Layout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;