import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import StronaAutoryzacji from './components/StronaAutoryzacji';
import StronaKonta from './components/StronaKonta';
import StronaRezerwacji from './components/StronaRezerwacji';
import StronaWiadomosci from './components/StronaWiadomosci';
import StronaGlowna from './components/StronaGlowna';
import StronaOnas from './components/StronaOnas';
import Naglowek from './components/Naglowek';
import Footer from './components/stopka';
import ZapomnianeHaslo from './components/ZapomnianeHaslo';
import ResetHaslo from './components/ResetHaslo';
import Strona404 from './components/Strona404';
import Dostepnegodziny from './components/Dostepnegodziny';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Naglowek />
        <Routes>
          <Route path="/" element={<StronaGlowna />} />
          <Route path="/konto" element={<StronaKonta />} />
          <Route path="/o-nas" element={<StronaOnas/>} />
          <Route path="/rezerwacje" element={<StronaRezerwacji />} />
          <Route path="/kontakt" element={<StronaWiadomosci />} />
          <Route path="/autoryzacja" element={<StronaAutoryzacji />} />
          <Route path="/zapomniane-haslo" element={<ZapomnianeHaslo />} />
          <Route path="/reset-hasla" element={<ResetHaslo />} />
          <Route path="*" element={<Strona404 />} />
          <Route path="/dostepne-godziny" element={<Dostepnegodziny />} />
        </Routes>
      </AuthProvider>
      <Footer />
    </Router>
  );
}

export default App;
