import smtplib
from email.mime.text import MIMEText
import os

def send_email(subject, recipient, content_html, reply_to=None):
    try:
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        sender_email = os.getenv("EMAIL_USER")
        sender_password = os.getenv("EMAIL_PASSWORD")

        if not sender_email or not sender_password:
            return None, "Brak danych logowania. Ustaw EMAIL_USER i EMAIL_PASSWORD w zmiennych środowiskowych."

        msg = MIMEText(content_html, "html", "utf-8")
        msg["Subject"] = subject
        msg["From"] = sender_email
        msg["To"] = recipient

        if reply_to:  # Dodajemy nagłówek Reply-To, jeśli jest podany
           msg["Reply-To"] = reply_to

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient, msg.as_string())

        return "Sukces", "Wiadomość wysłana"
    except Exception as e:
        return None, str(e)
