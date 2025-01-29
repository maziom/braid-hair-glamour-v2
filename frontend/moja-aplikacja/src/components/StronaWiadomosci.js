import React from 'react';
import './StronaWiadomosci.css'; // Plik CSS do stylizacji
import { useNavigate } from 'react-router-dom';
import phoneIcon from './icons/phone.svg'; // Ścieżka do własnej ikony telefonu
import locationIcon from './icons/location.svg'; // Ścieżka do własnej ikony lokalizacji
import smileIcon from './icons/smile.svg'; // Ścieżka do własnej ikony uśmiechu

const StronaWiadomosci = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/rezerwacje');
  };

  return (
    <div className="contact-section-wrapper">
      <div className="contact-section">
        <div className="contact-item">
          <img src={phoneIcon} alt="Phone Icon" className="icon" />
          <h3>Umów się!</h3>
          <a href="tel:+48731217999" className="clickable-link">
            +48 731 217 999
          </a>
          <p className='lub'>Lub</p>
          <button
            id="aboutus-contact-button"
            className="btn-contact"
            onClick={handleButtonClick}
          >
            Zarezerwuj wizytę
          </button>
        </div>
        <div className="contact-item">
          <img src={locationIcon} alt="Location Icon" className="icon" />
          <h3>Przyjdź na swoją odmianę!</h3>
          <a
            href="https://maps.app.goo.gl/VAWTZTcM7gYztLEK9"
            className="clickable-link"
          >
            Powstańców Warszawy 15c<br />
            35-314 Rzeszów
          </a>
        </div>
        <div className="contact-item">
          <img src={smileIcon} alt="Smile Icon" className="icon" />
          <h3>Wyjdź na świat!</h3>
          <p>I nie zapomnij zostawić opinii :)</p>
        </div>
      </div>
    </div>
  );
};

export default StronaWiadomosci;
