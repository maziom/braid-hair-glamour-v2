
import React, { useState } from 'react';
import axios from 'axios';

const ZapomnianeHaslo = () => {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/reset-password', { email });
      setFeedback(response.data.message);
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Wystąpił błąd podczas wysyłania e-maila.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Zapomniałeś hasła?</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Wpisz swój adres e-mail"
          required
        />
        <button type="submit">Wyślij link do resetowania hasła</button>
      </form>

      {feedback && <div className="feedback">{feedback}</div>}
    </div>
  );
};

export default ZapomnianeHaslo;
