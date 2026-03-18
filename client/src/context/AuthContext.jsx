import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    // 1. Wipe React State
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    
    // 2. Annihilate Local Storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // 🔥 THE GHOST BUSTER (NUCLEAR OPTION) 🔥
    // This forces the browser to completely dump the React memory tree.
    // It prevents Khiloshiya Ji from hitting the 'Back' button and seeing
    // the cached Admin Dashboard charts. It rebuilds the app from scratch.
    window.location.href = '/login';
  };

  // 🌟 THIS IS THE FIX: Updates the profile data in React's memory instantly!
  const updateContextUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, updateContextUser }}>
      {children}
    </AuthContext.Provider>
  );
};