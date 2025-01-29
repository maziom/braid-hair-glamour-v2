import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Stan przechowujący informację o adminie
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedIsAdmin = localStorage.getItem('isAdmin'); // Sprawdzamy, czy zapisano status admina

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (storedIsAdmin === 'true') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Błąd przy parsowaniu danych użytkownika:', error);
      }
    } else {
      const fetchUser = async () => {
        const response = await fetch('http://127.0.0.1:5000/api/profil', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          
          // Sprawdzamy, czy użytkownik jest administratorem
          const adminStatus = data.user?.role === 'admin'; // Przykład sprawdzenia roli
          setIsAdmin(adminStatus);

          // Zapisz dane użytkownika oraz status admina w localStorage
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('isAdmin', adminStatus.toString());
        }
      };
      fetchUser();
    }
  }, []);

  useEffect(() => {
    if (user && location.pathname === '/autoryzacja') {
      navigate('/konto');
    }
  }, [user, location.pathname, navigate]);

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

        // Sprawdzamy, czy użytkownik jest administratorem
        const adminStatus = data.user?.role === 'admin'; // Przykład sprawdzenia roli
        setIsAdmin(adminStatus);

        // Zapisz dane użytkownika oraz status admina w localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAdmin', adminStatus.toString());

        navigate('/konto');
      } else {
        const error = await response.json();
        console.error('Error:', error.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/rejestracja', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);

        // Zapisz dane użytkownika w localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
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
        setIsAdmin(false);

        // Usuń dane użytkownika oraz status admina z localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
        
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
    <AuthContext.Provider value={{ user, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
export default AuthContext;
