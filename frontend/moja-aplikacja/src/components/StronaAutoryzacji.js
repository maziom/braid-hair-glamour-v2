import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import './StronaAutoryzacji.css';

const StronaAutoryzacji = () => {
  const { login, register } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      login(username, password);
    } else {
      register(username, password);
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
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
      </button>
    </div>
  );
};

export default StronaAutoryzacji;
