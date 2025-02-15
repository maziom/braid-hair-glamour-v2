import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import './StronaRezerwacji.css';
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const StronaRezerwacji = () => {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editBooking, setEditBooking] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageMessage, setImageMessage] = useState('');
  const [reservationMessage, setReservationMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetch('http://127.0.0.1:5000/api/rezerwacje', {
        credentials: 'include'
      })
        .then(response => response.json())
        .then(data => setBookings(data.bookings))
        .catch(error => console.error('Error:', error));
    }
  }, [user]);

  useEffect(() => {
    document.title = "Rezerwacja | Braid Hair Glamour ";
  }, []);

  useEffect(() => {
    if (date) {
      fetch(`http://127.0.0.1:5000/api/godziny?date=${date.toISOString().split('T')[0]}`)
        .then(response => response.json())
        .then(data => setAvailableTimes(data.hours))
        .catch(error => console.error('Error:', error));
    }
  }, [date]);

  const handleLoginRedirect = () => {
    navigate("/autoryzacja");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!time || !date) {
      alert('Proszę wybrać datę i godzinę.');
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:5000/api/rezerwacje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: date.toISOString().split('T')[0], time }),
        credentials: 'include'
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setReservationMessage('Rezerwacja została pomyślnie utworzona.');
        setDate(null);
        setTime('');
        setAvailableTimes([]);
      } else {
        setReservationMessage(`Błąd: ${data.message}`);
      }
    } catch (error) {
      setReservationMessage('Błąd połączenia.');
    }
  };


  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/rezerwacje/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate, time: newTime }),
        credentials: 'include'
      });

      if (response.ok) {
        setBookings(bookings.map(booking => (booking.id === id ? { ...booking, date: newDate, time: newTime } : booking)));
        setEditBooking(null);
      } else {
        console.error('Błąd podczas aktualizacji rezerwacji');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/rezerwacje/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setBookings(bookings.filter(booking => booking.id !== id));
      } else {
        console.error('Błąd podczas usuwania rezerwacji');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditClick = (booking) => {
    setEditBooking(booking.id);
    setNewDate(booking.date);
    setNewTime(booking.time);
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      setImageMessage('Proszę wybrać zdjęcie.');
      return;
    }

    const formData = new FormData();
    formData.append('profile_picture', selectedImage);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/uzytkownik/zdjecie', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setImageMessage('Zdjęcie zostało dodane pomyślnie.');
      } else {
        setImageMessage(`Błąd: ${data.message}`);
      }
    } catch (error) {
      setImageMessage('Błąd połączenia.');
    }
  };

  if (!user) {
    return (
      <div className="info">
        <p className='info-text'>Proszę się zalogować, aby uzyskać dostęp do rezerwacji.</p>
        <button onClick={handleLoginRedirect} style={{ marginLeft: "10px" }}>
          Przejdź do logowania
        </button>
        <p>Dziękujemy, że z nami jesteś!</p>
      </div>
    );
  }

  return (
    <div className="rezerwacja-container">
      {user && user.role !== 'admin' && (
        <>
          <form onSubmit={handleSubmit}>
            <div>
              <h2 className='date-choose'>Wybierz datę:</h2>
              <Calendar
                onChange={setDate}
                value={date}
                className="custom-calendar"
                minDate={new Date()}
              />
              {availableTimes.length > 0 && (
  <div>
    <h2 className="date-choose">Wybierz godzinę</h2>
    <div className="time-select">
      {availableTimes.map((hour) => (
        <button
          key={hour.id}
          className={`time-button ${time === hour.time ? 'active' : ''}`}
          onClick={() => setTime(hour.time)}
        >
          {hour.time}
        </button>
      ))}
    </div>
  </div>
)}

            </div>

            <div className="image-upload">
              <h2>Dodaj zdjęcie swoich włosów:</h2>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <button type="button" onClick={handleImageSubmit}>Dodaj zdjęcie</button>
              {imageMessage && <p>{imageMessage}</p>}
            </div>

            <button type="submit">Zarezerwuj</button>
          </form>
          {reservationMessage && <p>{reservationMessage}</p>}
        </>
      )}

{user && user.role === 'admin' && (
  <div>
    <h3>Lista Rezerwacji</h3>
    <ul>
      {bookings.map(booking => (
        <li key={booking.id} className="booking-item">
          <div className="user-info">
            <img 
              src={booking.profile_picture ? `http://127.0.0.1:5000/static/${user.profile_picture}` : "/default-profile.png"} 
              alt="Profil użytkownika"
              className="profile-pic"
            />
            <div>
              <p><strong>{booking.username}</strong> ({booking.email})</p>
              <p>{booking.date} - {booking.time}</p>
            </div>
          </div>
          {editBooking === booking.id ? (
            <>
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
              <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
              <button onClick={() => handleUpdate(booking.id)}>Zapisz</button>
              <button onClick={() => setEditBooking(null)}>Anuluj</button>
            </>
          ) : (
            <>
              <button onClick={() => handleEditClick(booking)}>Edytuj</button>
              <button onClick={() => handleDelete(booking.id)}>Usuń</button>
            </>
          )}
        </li>
      ))}
    </ul>
  </div>
)}
    </div>
  );
};

export default StronaRezerwacji;