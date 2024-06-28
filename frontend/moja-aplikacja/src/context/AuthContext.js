import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('http://127.0.0.1:5000/api/profil', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/logowanie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        navigate('/konto');
      } else {
        const error = await response.json();
        console.error('Error:', error.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const register = async (username, password) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/rejestracja', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        navigate('/konto');
      } else {
        const error = await response.json();
        console.error('Error:', error.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/wylogowanie', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setUser(null);
        navigate('/');
      } else {
        const error = await response.json();
        console.error('Error:', error.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
export default AuthContext;
