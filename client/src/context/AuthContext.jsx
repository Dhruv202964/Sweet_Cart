import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🌟 CHANGED TO sessionStorage: Dies when the browser tab closes!
    const savedToken = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (userData, userToken) => {
    // 🌟 CHANGED TO sessionStorage
    sessionStorage.setItem('token', userToken);
    sessionStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(userToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // 🌟 CHANGED TO sessionStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false); // Fix: set to false on logout!
    window.location.href = '/login'; 
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};