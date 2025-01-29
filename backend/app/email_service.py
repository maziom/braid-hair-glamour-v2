from .email_utils import send_email
from .rendertemplate import render_email_template

def send_registration_email(user):
    subject = "Braid hair glamour - Rejestracja w serwisie"
    body = render_email_template(
        username=user.username,
        message="Dziękujemy za rejestrację w naszym serwisie! Możesz teraz korzystać z pełnej funkcjonalności naszej aplikacji.",
        action_url="http://localhost:3000/autoryzacja"
    )
    send_email(subject, user.email, body)

def send_booking_confirmation_email(user, booking_date, booking_time):
    subject = "Braid hair glamour - Potwierdzenie rezerwacji"
    body = render_email_template(
        username=user.username,
        message=f"Twoja rezerwacja została pomyślnie utworzona: {booking_date} o {booking_time}. Jeśli chcesz zmienić termin kliknij niżej.",
        action_url="http://localhost:3000/konto"
    )
    send_email(subject, user.email, body)

def send_admin_new_message_notification(admin_email, sender_username, sender_email, message_content):
    subject = "Braid hair glamour - Nowa wiadomość od użytkownika"
    body = render_email_template(
        username="Admin",
        message=f"Otrzymałeś nową wiadomość od użytkownika {sender_username}: {message_content}. Kliknij odpowiedz, aby odpisać. Kliknij przycisk niżej, aby przejść na stronę :).",
        action_url="http://localhost:3000/autoryzacja",
        )
    send_email(subject, admin_email, body, reply_to=sender_email)  


def send_password_reset_email(user, reset_url):
    subject = "Braid hair glamour - Reset hasła"
    body = render_email_template(
        username=user.username,
        message="Otrzymaliśmy prośbę o zresetowanie Twojego hasła. Kliknij poniższy przycisk, aby ustawić nowe hasło:",
        action_url=reset_url
    )
    send_email(subject, user.email, body)

def send_cancellation_email(user, user_email, new_date, new_time ):
    subject = "Braid hair glamour - Anulowanie rezerwacji"
    body = render_email_template(
        username=user.username,
        message=f"Twoja rezerwacja z dnia {new_date} o godzinie {new_time} została anulowana.Kliknij niżej w celu zarezerwowania ponownie.",
        action_url="http://localhost:3000/rezerwacje"
    )
    send_email(subject, user_email, body)

def send_update_email(user, user_email, new_date, new_time):
    subject = "Braid hair glamour - Zmiana rezerwacji"
    body = render_email_template(
    username=user.username,
    message=f"Twoja rezerwacja została zmieniona na: {new_date} o godzinie {new_time}.Kliknij poniżej, aby przejść do konta",
    action_url="http://localhost:3000/konto"
    )
    send_email(subject, user_email, body)
