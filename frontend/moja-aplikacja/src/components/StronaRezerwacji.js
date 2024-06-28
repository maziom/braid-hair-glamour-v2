import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import './StronaRezerwacji.css';

const StronaRezerwacji = () => {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [bookings, setBookings] = useState([]);
  const [editBooking, setEditBooking] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/api/rezerwacje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        // Obsługa sukcesu, np. wyświetlenie komunikatu
        console.log('Rezerwacja utworzona:', data);
      } else {
        console.error('Błąd podczas tworzenia rezerwacji');
      }
    } catch (error) {
      console.error('Error:', error);
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

  if (!user) {
    return <div>Proszę się zalogować, aby uzyskać dostęp do rezerwacji.</div>;
  }

  return (
    <div className="rezerwacja-container">
      {user && user.role !== 'admin' && (
        <>
          <h2>Zarezerwuj Wizytę</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Data"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Godzina"
            />
            <button type="submit">Zarezerwuj</button>
          </form>
        </>
      )}
      {user && user.role === 'admin' && (
        <div>
          <h3>Lista Rezerwacji</h3>
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
                    <p>Użytkownik: {booking.username}</p>
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

export default StronaRezerwacji;
