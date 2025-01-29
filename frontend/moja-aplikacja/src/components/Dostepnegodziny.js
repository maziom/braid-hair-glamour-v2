import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dostepnegodziny.css';  // Importowanie pliku CSS

function Dostepnegodziny() {
    const [hours, setHours] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [error, setError] = useState(null);
    const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Pobranie roli użytkownika z localStorage

    // Pobieranie dostępnych godzin
    useEffect(() => {
        if (isAdmin) {
            const fetchHours = async () => {
                try {
                    const response = await axios.get('http://127.0.0.1:5000/api/godziny');
                    setHours(response.data.hours);
                } catch (error) {
                    setError('Błąd podczas ładowania godzin');
                }
            };

            fetchHours();
        }
    }, [isAdmin]);

    // Funkcja dodawania godziny
    const handleAddHour = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/godziny', { date, time });
            alert(response.data.message);
            setHours([...hours, { date, time }]); // Dodanie nowej godziny do listy
            setDate('');
            setTime('');
        } catch (error) {
            setError('Błąd podczas dodawania godziny');
        }
    };

    // Funkcja usuwania godziny
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:5000/api/godziny/${id}`);
            alert(response.data.message);
            setHours(hours.filter((hour) => hour.id !== id)); // Usunięcie godziny z listy
        } catch (error) {
            setError('Błąd podczas usuwania godziny');
        }
    };

    // Jeśli użytkownik nie jest administratorem
    if (!isAdmin) {
        return <p>Brak dostępu do tej strony.</p>;
    }

    return (
        <div className="homepage">
            <div className="header-section">
                <div className="header-container">
                    <div className="headline-container">
                        <h2 className="main-title">Zarządzaj dostępnymi godzinami</h2>
                    </div>
                </div>
            </div>

            {/* Formularz dodawania nowej godziny */}
            <form onSubmit={handleAddHour} className="form-container">
                <div className="form-field">
                    <label>Data:</label>
                    <input
                        type="date"
                        value={date}
                        minDate={new Date()}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        
                    />
                </div>
                <div className="form-field">
                    <label>Godzina:</label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Dodaj godzinę</button>
            </form>

            {/* Wyświetlanie dostępnych godzin */}
            <h3>Dostępne godziny</h3>
            {error && <p>{error}</p>}
            <ul className="hours-list">
                {hours.length > 0 ? (
                    hours.map((hour) => (
                        <li key={hour.id} className="hour-item">
                            {hour.date} - {hour.time}
                            <button onClick={() => handleDelete(hour.id)} className="delete-button">Usuń</button>
                        </li>
                    ))
                ) : (
                    <p>Brak dostępnych godzin</p>
                )}
            </ul>
        </div>
    );
}

export default Dostepnegodziny;
