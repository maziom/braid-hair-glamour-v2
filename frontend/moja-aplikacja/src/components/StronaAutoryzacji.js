import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import './StronaAutoryzacji.css';

const StronaAutoryzacji = () => {
  const { login, register } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' }); // Obiekt feedback przechowujący komunikaty i ich typy

  useEffect(() => {
    document.title = isLogin ? 'Logowanie | Braid Hair Glamour' : 'Rejestracja | Braid Hair Glamour';
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ message: '', type: '' }); // Resetowanie feedbacku przed nową próbą

    try {
      if (isLogin) {
        const response = await login(username, password);
        setFeedback({ message: response.message || 'Zalogowano pomyślnie', type: 'success' }); // Sukces
      } else {
        const response = await register(username, password);
        setFeedback({ message: response.message || 'Rejestracja zakończona sukcesem', type: 'success' }); // Sukces
      }
    } catch (err) {
      setFeedback({ message: err.response?.data?.message || 'Wystąpił błąd. Spróbuj ponownie.', type: 'error' }); // Błąd
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Logowanie' : 'Rejestracja'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nazwa użytkownika"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Hasło"
        />
        <button type="submit">{isLogin ? 'Zaloguj się' : 'Zarejestruj się'}</button>
      </form>

      {/* Komunikat o błędzie lub sukcesie */}
      {feedback.message && (
        <div className={`feedback ${feedback.type}`}>
          {feedback.message}
        </div>
      )}

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
      </button>
    </div>
  );
};

export default StronaAutoryzacji;
