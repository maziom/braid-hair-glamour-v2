import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ResetHaslo = () => {
  const query = useQuery();
  const token = query.get('token'); // Odczytaj token z query string
  const [newPassword, setNewPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/ustaw_haslo', {
        token,
        password: newPassword, // Zmieniono na "password" zgodnie z backendem
      });
      setFeedback(response.data.message);
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Wystąpił błąd przy resetowaniu hasła.');
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Resetowanie hasła</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Wpisz nowe hasło"
          required
        />
         <button type="submit" disabled={loading}>
        {loading ? (
       <div className="loader"></div> 
        ) : (
           'Zresetuj hasło'
        )}
        </button>
      </form>

      {feedback && <div className="feedback">{feedback}</div>}
    </div>
  );
};

export default ResetHaslo;
