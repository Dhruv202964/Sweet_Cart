import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CartProvider } from './context/CartContext.jsx'; // 👈 Import it here

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>  {/* 👈 Wrap your App inside it */}
      <App />
    </CartProvider>
  </React.StrictMode>,
);