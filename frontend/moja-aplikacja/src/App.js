import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import StronaAutoryzacji from './components/StronaAutoryzacji';
import StronaKonta from './components/StronaKonta';
import StronaRezerwacji from './components/StronaRezerwacji';
import StronaWiadomosci from './components/StronaWiadomosci';
import Naglowek from './components/Naglowek';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Naglowek />
        <Routes>
          <Route path="/" element={<StronaAutoryzacji />} />
          <Route path="/konto" element={<StronaKonta />} />
          <Route path="/rezerwacje" element={<StronaRezerwacji />} />
          <Route path="/wiadomosci" element={<StronaWiadomosci />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
