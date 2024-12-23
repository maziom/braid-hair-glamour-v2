// frontend/src/components/ResetHaslo.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetHaslo = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/reset-password-confirm', {
        token,
        newPassword,
      });
      setFeedback(response.data.message);
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Wystąpił błąd przy resetowaniu hasła.');
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
        <button type="submit">Zresetuj hasło</button>
      </form>

      {feedback && <div className="feedback">{feedback}</div>}
    </div>
  );
};

export default ResetHaslo;
