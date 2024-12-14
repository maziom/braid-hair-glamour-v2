import React from 'react';
import './StronaGlowna.css';


const StronaGlowna = () => {
  return (
    <div className="homepage">
      {/* Nagłówek */}
      <header className="header-section">
        <div className="header-container">
          <img
            src="images\main-photo.png"
            alt="Moja-realizacja"
          />
          <div className="headline-container">
            <p className="sub-title">Przedłużanie włosów | Metodą mini warkoczyków</p>
            <h1 className="main-title">Moje realizacje</h1>
            <p className="description">Są metodą bezinwazyjną | Bezpieczną dla twoich włosów</p>
          </div>
        </div>
      </header>
      {/* Sekcja promo*/}
      <h2 className='partners'>Nasi partnerzy</h2>
      <div className="promo-block">
        <div className="image-container">
          <img src="images\grey-hair.png" alt="Grey Hair Logo" className="grey-hair" />
          <img src="images\alt-hair.png" alt="Althair Store Logo" className="alt-hair" />
        </div>
    </div>

      {/* Sekcja Umiejętności */}
      <div className="skills-section">
        <div className="skills">
          <div className="skill">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/lois0civjvj-I176%3A2333%3B609%3A2103?alt=media&token=d4428600-fe61-452d-be6d-a5c5cd760a28"
              alt="Ikona 1"
              className="skill-icon"
            />
            <h3>Umów się!</h3>
            <p>
              Skorzystaj z naszej strony i umów się na wizytę, dołącz zdjęcia
              swoich włosów w formularzu rezerwacji.
            </p>
          </div>
          <div className="skill">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/lois0civjvj-I176%3A2333%3B609%3A2106?alt=media&token=2f6c1aca-2cf4-46d5-ac33-df0390875d87"
              alt="Ikona 2"
              className="skill-icon"
            />
            <h3>Przyjdź na swoją odmianę!</h3>
            <p>
              Dołożymy wszelkich starań, abyś poczuła się jak królowa w pięknych
              długich i lśniących włosach!
            </p>
          </div>
          <div className="skill">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/lois0civjvj-I176%3A2333%3B609%3A2109?alt=media&token=090957d6-03ff-4d44-b9f2-3b672e833a9d"
              alt="Ikona 3"
              className="skill-icon"
            />
            <h3>Wyjdź na świat!</h3>
            <p>
              Teraz już możesz cieszyć się włosami, o których marzyłaś, a my
              pomogliśmy spełnić Ci to marzenie!
            </p>
          </div>
        </div>
      </div>

      {/* Galeria */}
      <section className="gallery">
        <h2>Nasze ostatnie realizacje</h2>
        <div className="gallery-grid">
          <img src="/images/n-1.png" alt="Stylizacja 1" />
          <img src="/images/n-2.png" alt="Stylizacja 2" />
          <img src="/images/n-3.png" alt="Stylizacja 3" />
          <img src="/images/n-4.png" alt="Stylizacja 4" />
        </div>
      </section>

{/* Opinie klientów */}
<div class="elfsight-app-f795d328-6ef1-49ef-83ae-7ab3c251e05b" data-elfsight-app-lazy></div>


      {/* Formularz kontaktowy */}
    </div>
  );
};

export default StronaGlowna;
