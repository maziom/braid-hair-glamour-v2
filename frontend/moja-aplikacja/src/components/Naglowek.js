import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Naglowek.css';

const Naglowek = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <h1><Link to="/" onClick={closeMenu}>Braid Hair Glamour</Link></h1>
      <div className="hamburger" onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <ul className={isOpen ? 'nav-links open' : 'nav-links'}>
        {user ? (
          <>
            <li><Link to="/konto" onClick={closeMenu}>Moje Konto</Link></li>
            {user.role === 'admin' && (
              <>
                <li><Link to="/rezerwacje" onClick={closeMenu}>Lista Rezerwacji</Link></li>
                <li><Link to="/wiadomosci" onClick={closeMenu}>Wszystkie Wiadomości</Link></li>
              </>
            )}
            {user.role !== 'admin' && (
              <>
                <li><Link to="/rezerwacje" onClick={closeMenu}>Zarezerwuj Wizytę</Link></li>
                <li><Link to="/wiadomosci" onClick={closeMenu}>Moje Wiadomości</Link></li>
              </>
            )}
            <li><button onClick={() => { handleLogout(); closeMenu(); }}>Wyloguj się</button></li>
          </>
        ) : (
          <li><Link to="/" onClick={closeMenu}>Logowanie/Rejestracja</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Naglowek;
