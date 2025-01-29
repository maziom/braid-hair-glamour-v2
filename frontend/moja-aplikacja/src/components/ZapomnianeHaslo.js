
import React, { useState } from 'react';
import axios from 'axios';

const ZapomnianeHaslo = () => {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/reset_hasla', { email });
      setFeedback(response.data.message);
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Wystąpił błąd podczas wysyłania e-maila.');
    }finally {
      setLoading(false);
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
        <button type="submit" disabled={loading}>
        {loading ? (
       <div className="loader"></div> 
        ) : (
           'Wyślij link do resetowania hasła'
        )}
        </button>

      </form>

      {feedback && <div className="feedback">{feedback}</div>}
    </div>
  );
};

export default ZapomnianeHaslo;
