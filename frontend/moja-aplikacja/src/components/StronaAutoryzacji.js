import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import './StronaAutoryzacji.css';
import axios from 'axios'; 
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const StronaAutoryzacji = () => {
  const navigate = useNavigate();
  const { login, register } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [usernameFeedback, setUsernameFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [emailFeedback, setEmailFeedback] = useState('');
  const [emailValid, setEmailValid] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(null);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  useEffect(() => {
    document.title = isLogin ? 'Logowanie | Braid Hair Glamour' : 'Rejestracja | Braid Hair Glamour';
  }, [isLogin]);

  useEffect(() => {
    if (!isLogin && username.trim()) {
      const checkUsername = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/sprawdz_nazwe_uzytkownika`, {
            params: { username },
          });
          setUsernameAvailable(response.data.available);
          setUsernameFeedback(response.data.message);
        } catch (err) {
          setUsernameAvailable(false);
          setUsernameFeedback('Nie udało się sprawdzić nazwy użytkownika.');
        }
      };
      checkUsername();
    }
  }, [username, isLogin]);

  useEffect(() => {
    if (!isLogin && email.trim()) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        setEmailValid(false);
        setEmailFeedback('Proszę podać poprawny adres e-mail');
      } else {
        setEmailValid(true);
        setEmailFeedback('');
      }
    }
  }, [email, isLogin]);

  useEffect(() => {
    if (!isLogin && email.trim() && emailValid) {
      const checkEmail = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/sprawdz_email`, {
            params: { email },
          });
          setEmailAvailable(response.data.available);
          setEmailFeedback(response.data.message);
        } catch (err) {
          setEmailAvailable(false);
          setEmailFeedback('Nie udało się sprawdzić dostępności e-maila.');
        }
      };
      checkEmail();
    }
  }, [email, emailValid, isLogin]);

  useEffect(() => {
    if (!isLogin && password.trim()) {
      const validatePassword = () => {
        if (password.length < 6) {
          setPasswordValid(false);
          setPasswordFeedback('Hasło musi zawierać co najmniej 6 znaków');
        } else {
          setPasswordValid(true);
          setPasswordFeedback('');
        }
      };
      validatePassword();
    }
  }, [password, isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ message: '', type: '' });

    if (!isLogin) {
      if (!usernameAvailable) {
        setFeedback({ message: 'Nazwa użytkownika jest zajęta.', type: 'error' });
        return;
      }
      if (!emailValid) {
        setFeedback({ message: 'Proszę podać poprawny adres e-mail.', type: 'error' });
        return;
      }
      if (!emailAvailable) {
        setFeedback({ message: 'E-mail jest już zajęty.', type: 'error' });
        return;
      }
      if (!passwordValid) {
        setFeedback({ message: 'Hasło jest za krótkie.', type: 'error' });
        return;
      }
    }

    try {
      if (isLogin) {
        const response = await login(username, password);
        setFeedback({ message: response.message || 'Zalogowano pomyślnie', type: 'success' });
      } else {
        const response = await register(username, email, password);
        setFeedback({ message: response.message || 'Rejestracja zakończona sukcesem', type: 'success' });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Wystąpił błąd. Spróbuj ponownie.';
    setFeedback({ message: errorMessage, type: 'error' });
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Logowanie' : 'Rejestracja'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nazwa użytkownika"
          />
          {username && usernameAvailable !== null && usernameFeedback && !usernameAvailable && (
            <span className="invalid">
              <FaTimes />
            </span>
          )}
          {username && usernameAvailable === true && (
            <span className="valid">
              <FaCheck />
            </span>
          )}
        </div>
        {usernameFeedback && !usernameAvailable && (
          <div className="feedback">{usernameFeedback}</div>
        )}

        {!isLogin && (
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adres e-mail"
            />
            {email && emailAvailable !== null && !emailAvailable && (
              <span className="invalid">
                <FaTimes />
              </span>
            )}
            {email && emailValid && emailAvailable === true && (
              <span className="valid">
                <FaCheck />
              </span>
            )}
          </div>
        )}
        {emailFeedback && !emailAvailable && (
          <div className="feedback">{emailFeedback}</div>
        )}

        <div className="input-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Hasło"
          />
          {password && passwordValid !== null && !passwordValid && (
            <span className="invalid">
              <FaTimes />
            </span>
          )}
          {password && passwordValid === true && (
            <span className="valid">
              <FaCheck />
            </span>
          )}
        </div>
        {passwordFeedback && !passwordValid && (
          <div className="feedback">{passwordFeedback}</div>
        )}

        <button type="submit">{isLogin ? 'Zaloguj się' : 'Zarejestruj się'}</button>
      </form>

      {feedback.message && (
        <div className={`feedback ${feedback.type}`}>
          {feedback.message}
        </div>
      )}
      
      {isLogin ? (
        <>
          <button className="forgot-password" onClick={() =>  navigate('/zapomniane-haslo')}>
            Zapomniałeś hasła?
          </button>
        </>
      ) : (
        <div className="register-hints">
          <p>Rejestracja to tylko kilka kroków! Podaj nazwę użytkownika, e-mail oraz hasło, aby stworzyć konto.</p>
        </div>
      )}

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
      </button>
    </div>
  );
};

export default StronaAutoryzacji;
