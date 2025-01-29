import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Strona404.css';

const Strona404 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Po 3 sekundach przekierowanie na stronę główną
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="strona404-container">
      <div className="strona404-content">
        <h1>Strona nie znaleziona (404)</h1>
        <p>Nie znaleziono strony pod tym adresem. Zostaniesz przekierowany na stronę główną.</p>
      </div>
    </div>
  );
};

export default Strona404;
