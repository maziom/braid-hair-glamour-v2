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
      <Link to="/" onClick={closeMenu}>
        <img src="/images/logo.svg" alt="Braid Hair Glamour" className="logo" />
      </Link>
      <div className="hamburger" onClick={toggleMenu}>
        <div className="row">
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <div className="row">
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
      <ul className={isOpen ? 'nav-links open' : 'nav-links'}>
        {(!user || user.role !== 'admin') && (
        <>
       <li><Link to="/o-nas" onClick={closeMenu}>O nas</Link></li>
       <li><Link to="/rezerwacje" onClick={closeMenu} className='reseravation'>Zarezerwuj Wizytę</Link></li>
       <li><Link to="/kontakt" onClick={closeMenu}>Kontakt</Link></li>
    </>
  )}

        {user ? (
  <>
        {/* Linki dostępne tylko dla admina */}
       {user.role === 'admin' && (
        <ul>
       <li><Link to="/rezerwacje" onClick={closeMenu}>Lista Rezerwacji</Link></li>
       <li><Link to="/dostepne-godziny" onClick={closeMenu}>Dostępne godziny wizyt</Link></li>
        </ul>
        )}
       <li className="user-info">
       <Link to="/konto"  onClick={closeMenu} className="welcome-message">
        Witaj, {user.username}
       </Link>
       <button onClick={() => { handleLogout(); closeMenu(); }}>Wyloguj się</button>
       </li>

  </>
) : (
  <li><button onClick={() => { closeMenu(); window.location.href = '/autoryzacja'; }}>Logowanie/Rejestracja</button></li>
)}

      </ul>
    </nav>
  );
};

export default Naglowek;
