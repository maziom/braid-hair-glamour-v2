import React, { useState } from "react";
import "./stopka.css";

export default function Footer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(""); // Czyścimy poprzednie wiadomości
    setIsSubmitting(true); // Ustawienie stanu wysyłania
  
    try {
      const response = await fetch("http://127.0.0.1:5000/api/wiadomosci", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          content: formData.message.trim(),
        }),
      });
  
      if (response.ok) {
        setFeedback("Wiadomość została wysłana pomyślnie!");
        setFormData({ name: "", email: "", message: "" }); // Reset formularza
      } else {
        const errorData = await response.json();
        setFeedback(errorData.error || "Wystąpił błąd podczas wysyłania wiadomości.");
      }
    } catch (error) {
      console.error("Error:", error);
      setFeedback("Wystąpił błąd sieci. Spróbuj ponownie później.");
    } finally {
      setIsSubmitting(false); // Koniec wysyłania
    }
  };

  return (
    <div className="footer">
      <div className="footer-message">
        <h3>Masz pytania? Śmiało pisz!</h3>
        <p>Odpowiemy na każde pytanie odnośnie usługi. Nie krępuj się, po prostu pisz!</p>
        <div className="footer-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-tiktok"></i>
          </a>
        </div>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Imię i Nazwisko</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Wpisz swoje imię i nazwisko"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Wpisz swój email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Wiadomość</label>
          <textarea
            id="message"
            name="message"
            placeholder="Wpisz swoją wiadomość :)"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <div className={`feedback ${feedback.includes("pomyślnie") ? 'success' : 'error'}`}>
        {feedback}
      </div>
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Wysyłanie..." : "Zatwierdź"}
        </button>
      </form>
    </div>
  );
}
