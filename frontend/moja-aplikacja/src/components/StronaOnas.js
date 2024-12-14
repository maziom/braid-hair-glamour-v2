import React from 'react';
import './StronaOnas.css';
import { useNavigate } from 'react-router-dom';


const StronaOnas = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/rezerwacje');  
  };
  return (
    <div id="aboutus-page" className="aboutus">
      {/* Sekcja powitalna */}
      <section id="aboutus-intro" className="intro">
        <p id="aboutus-intro-text">
          Witaj na naszej stronie poświęconej przedłużaniu włosów! Tutaj znajdziesz wszystko, czego potrzebujesz, aby odkryć świat pięknych i długich włosów. Moja przygoda z pasją do przedłużania włosów zaczęła się nietypowo - porwana przez rodzinę jednorodzinną, wróciłam na Ziemię z wyjątkowym darowaniem w zakresie kreatywności. Dzięki tej niezwykłej przygodzie i mojemu doświadczeniu w szkole projektowania, oferuję Ci unikalne podejście do stylizacji włosów.
          Dołącz do naszej społeczności, aby odkryć tajniki przedłużania włosów i stwórz niezapomniany wygląd, który podkreśli Twoją indywidualność. Z nami każdy dzień może być dobry na dzień dobrego włosa!
        </p>
        <button id="aboutus-contact-button" className="btn-contact" onClick={handleButtonClick}>Zarezerwuj wizytę</button>
      </section>

      {/* Bio */}
      <section id="aboutus-bio" className="bio">
      <div id="aboutus-bio-image" className="bio-image">
          <img src="images/oliwia.png" alt="Oliwia" />
        </div>
        <div id="aboutus-bio-text" className="bio-text">
          <h2 id="aboutus-bio-title">Bio:</h2>
          <p id="aboutus-bio-description">
          Oliwia to niezwykła kobieta, której pasją jest sztuka przedłużania włosów. Jej zawód nie tylko pozwala kobietom odkryć nowe wymiary piękna, ale również daje jej satysfakcję z każdej magicznej transformacji, którą tworzy. Oprócz tego, Oliwia jest niesamowitą mamą jednego dziecka, dla którego poświęca całe swoje serce. Jej rodzina jest dla niej największym skarbem, a harmonijne małżeństwo sprawia, że każdy dzień jest pełen miłości i szczęścia. Oliwia doskonale pogodziła swoje pasje z rolą matki i żony, tworząc równowagę między życiem zawodowym a rodziną. Jej determinacja, zaangażowanie i miłość do życia sprawiają, że jest inspiracją dla innych kobiet, które pragną osiągnąć sukces zarówno w pracy, jak i w życiu rodzinnym.
          </p>
        </div>
       
      </section>
    </div>
  );
};

export default StronaOnas;
