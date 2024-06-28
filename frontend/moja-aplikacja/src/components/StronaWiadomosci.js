import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import './StronaWiadomosci.css';

const StronaWiadomosci = () => {
  const { user } = useContext(AuthContext);
  const [wiadomosci, setWiadomosci] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetch('http://127.0.0.1:5000/api/wiadomosci', {
        credentials: 'include'
      })
        .then(response => response.json())
        .then(data => setWiadomosci(data.messages))
        .catch(error => console.error('Error:', error));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/wiadomosci', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setWiadomosci([...wiadomosci, data]);
        setContent('');
      } else {
        console.error('Błąd podczas wysyłania wiadomości');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!user) {
    return <div>Proszę się zalogować, aby uzyskać dostęp do wiadomości.</div>;
  }

  return (
    <div className="wiadomosci-container">
      <h2>{user.role === 'admin' ? 'Wszystkie Wiadomości' : 'Wyślij Wiadomość'}</h2>
      {user.role === 'admin' && (
        <ul>
          {wiadomosci.map(wiadomosc => (
            <li key={wiadomosc.id}>
              <p>Od: {wiadomosc.sender}</p>
              <p>{wiadomosc.content}</p>
              <p>{new Date(wiadomosc.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
      {user.role !== 'admin' && (
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Treść wiadomości"
            required
          />
          <button type="submit">Wyślij</button>
        </form>
      )}
    </div>
  );
};

export default StronaWiadomosci;
