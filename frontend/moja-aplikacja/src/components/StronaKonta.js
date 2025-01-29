import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Importujemy useNavigate
import './StronaKonta.css';

const StronaKonta = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Używamy useNavigate do przekierowania
  const [bookings, setBookings] = useState([]);
  const [editBooking, setEditBooking] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    if (!user) {
      // Jeśli użytkownik nie jest zalogowany, przekierowujemy na stronę logowania
      navigate('/autoryzacja');
    } else if (user.role !== 'admin') {
      fetch('http://127.0.0.1:5000/api/rezerwacje', {
        credentials: 'include'
      })
        .then(response => response.json())
        .then(data => setBookings(data.bookings))
        .catch(error => console.error('Error:', error));
    }
  }, [user, navigate]);

 
  useEffect(() => {
    document.title = "Moje Konto | Braid Hair Glamour ";
  }, []);
  

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
        setEditBooking(null); // Zakończ tryb edycji
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

  return (
    <div className="konto-container">
      <h2>Moje Konto</h2>
      {user && (
        <div>
          <p>Nazwa użytkownika: {user.username}</p>
        </div>
      )}
      {user && user.role !== 'admin' && (
        <div className="rezerwacje-container">
          <h3>Moje Rezerwacje</h3>
          <ul>
            {bookings.map(booking => (
              <li key={booking.id}>
                {editBooking === booking.id ? (
                  <>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                    />
                    <button onClick={() => handleUpdate(booking.id)}>Zapisz</button>
                    <button onClick={() => setEditBooking(null)}>Anuluj</button>
                  </>
                ) : (
                  <>
                    <p>Data: {booking.date}</p>
                    <p>Godzina: {booking.time}</p>
                    <button onClick={() => handleEditClick(booking)}>Aktualizuj</button>
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

export default StronaKonta;
