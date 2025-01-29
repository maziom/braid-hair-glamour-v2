import os
from flask import Blueprint, jsonify, request, session
from flask_login import login_user, logout_user, login_required, current_user
from . import db, bcrypt, login_manager
from .models import User, Booking, Message, AvailableHours
from .email_utils import send_email
from .generatetoken import generate_reset_token, verify_reset_token
from .rendertemplate import render_email_template
from .email_service import (
    send_registration_email,
    send_booking_confirmation_email,
    send_password_reset_email,
    send_admin_new_message_notification,
    send_update_email,
    send_cancellation_email
)

main = Blueprint('main', __name__, template_folder="app/templates")

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@main.route('/api/sprawdz_nazwe_uzytkownika', methods=['GET'])
def sprawdz_nazwe_uzytkownika():
    username = request.args.get('username')
    if not username:
        return jsonify({'message': 'Brak nazwy użytkownika'}), 400

    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({'available': False, 'message': 'Nazwa użytkownika jest zajęta'}), 200
    return jsonify({'available': True, 'message': 'Nazwa użytkownika jest dostępna'}), 200

@main.route('/api/sprawdz_email', methods=['GET'])
def sprawdz_email():
    email = request.args.get('email')

    if not email:
        return jsonify({"available": False, "message": "E-mail jest wymagany."}), 400

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"available": False, "message": "E-mail jest już zajęty."})

    return jsonify({"available": True, "message": "E-mail jest dostępny."})


@main.route('/api/rejestracja', methods=['POST'])
def rejestracja():
    data = request.get_json()
    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Wszystkie pola są wymagane'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Adres e-mail jest już używany'}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    role = data.get('role', 'user')
    new_user = User(username=data['username'], email=data['email'], password=hashed_password, role=role)

    try:
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)

        send_registration_email(new_user)

        return jsonify({'message': 'Użytkownik został utworzony', 'user': {
            'username': new_user.username,
            'email': new_user.email,
            'role': new_user.role
        }}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Błąd podczas tworzenia użytkownika', 'error': str(e)}), 500



@main.route('/api/logowanie', methods=['POST'])
def logowanie():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        login_user(user)
        session.permanent = True
        return jsonify({'message': 'Zalogowano pomyślnie', 'user': {'username': user.username, 'role': user.role}})
    return jsonify({'message': 'Nieprawidłowe dane logowania'}), 401

@main.route('/api/wylogowanie', methods=['POST'])
@login_required
def wylogowanie():
    logout_user()
    session.clear()
    return jsonify({'message': 'Wylogowano pomyślnie'})

@main.route('/api/profil', methods=['GET'])
@login_required
def profil():
    bookings = Booking.query.filter_by(user_id=current_user.id).all()
    booking_list = [{'id': b.id, 'date': b.date, 'time': b.time} for b in bookings]
    return jsonify({'username': current_user.username, 'role': current_user.role, 'bookings': booking_list})

@main.route('/api/rezerwacje', methods=['POST'])
@login_required
def utworz_rezerwacje():
    data = request.get_json()
    
    # Tworzenie nowej rezerwacji
    new_booking = Booking(user_id=current_user.id, date=data['date'], time=data['time'])
    db.session.add(new_booking)
    db.session.commit()

    # Usuwanie zarezerwowanej godziny z tabeli AvailableHours
    godzina = AvailableHours.query.filter_by(date=data['date'], time=data['time']).first()
    if godzina:
        db.session.delete(godzina)
        db.session.commit()

    # Wyślij e-mail z potwierdzeniem rezerwacji
    send_booking_confirmation_email(current_user, data['date'], data['time'])

    return jsonify({'message': 'Rezerwacja została utworzona'})

@main.route('/api/rezerwacje', methods=['GET'])
@login_required
def pobierz_rezerwacje():
    if current_user.role == 'admin':
        bookings = Booking.query.all()
    else:
        bookings = Booking.query.filter_by(user_id=current_user.id).all()

    booking_list = [{
        'id': b.id, 
        'user_id': b.user_id, 
        'username': User.query.get(b.user_id).username, 
        'profile_picture': User.query.get(b.user_id).profile_picture, 
        'date': b.date, 
        'time': b.time
    } for b in bookings]
    return jsonify({'bookings': booking_list})

@main.route('/api/rezerwacje/<int:id>', methods=['PUT'])
@login_required
def zaktualizuj_rezerwacje(id):
    data = request.get_json()
    booking = Booking.query.get(id)
    if booking and (booking.user_id == current_user.id or current_user.role == 'admin'):
        booking.date = data['date']
        booking.time = data['time']
        db.session.commit()

         # Wyślij e-mail o zmianie rezerwacji
        send_update_email(booking.user, booking.user.email, data['date'], data['time'])

        return jsonify({'message': 'Rezerwacja została zaktualizowana'})
    return jsonify({'message': 'Rezerwacja nie została znaleziona lub brak uprawnień'}), 404

@main.route('/api/rezerwacje/<int:id>', methods=['DELETE'])
@login_required
def usun_rezerwacje(id):
    booking = Booking.query.get(id)
    if booking and (booking.user_id == current_user.id or current_user.role == 'admin'):
        db.session.delete(booking)
        db.session.commit()
         
           # Wyślij e-mail o anulowaniu rezerwacji
        send_cancellation_email(booking.user, booking.user.email, booking.date, booking.time )

        return jsonify({'message': 'Rezerwacja została usunięta'})
    return jsonify({'message': 'Rezerwacja nie została znaleziona lub brak uprawnień'}), 404

@main.route('/api/wiadomosci', methods=['POST'])
def wyslij_wiadomosc():
    data = request.get_json()

    
    sender_email = data.get('email') if data.get('email') else "anonim@brak.pl"
    sender_username = data.get('name') if data.get('name') else "Anonim"

    receiver = User.query.filter_by(username='admin').first()
    if not receiver:
        return jsonify({'message': 'Admin nie został znaleziony'}), 404

    # Obsługa braku zalogowanego użytkownika
    sender_id = current_user.id if current_user.is_authenticated else None

    new_message = Message(
        sender_id=sender_id,
        receiver_id=receiver.id,
        content=data['content']
    )
    db.session.add(new_message)
    db.session.commit()

    # Wyślij e-mail powiadamiający admina o nowej wiadomości
    send_admin_new_message_notification(
        admin_email=receiver.email,
        sender_email=sender_email,
        sender_username=sender_username,
        message_content=data['content']
    )

    return jsonify({'message': 'Wysłano wiadomość e-mail do admina'}), 200

@main.route('/api/wiadomosci', methods=['GET'])
@login_required
def pobierz_wiadomosci():
    if current_user.role == 'admin':
        messages = Message.query.all()  
    else:
        messages = Message.query.filter_by(receiver_id=current_user.id).all()
    
    received = [{'id': m.id, 'sender': m.sender.username, 'content': m.content, 'timestamp': m.timestamp} for m in messages]
    return jsonify({'messages': received})

@main.route('/api/uzytkownik/zdjecie', methods=['POST'])
@login_required
def dodaj_zdjecie():
    if 'profile_picture' not in request.files:
        return jsonify({'message': 'Nie załączono pliku'}), 400

    file = request.files['profile_picture']
    folder_path = "./static/profile_pictures"
    os.makedirs(folder_path, exist_ok=True)  # Tworzy folder, jeśli nie istnieje
    
    filename = f"{current_user.id}_{file.filename}"
    file_path = os.path.join(folder_path, filename)
    
    file.save(file_path)  
    current_user.profile_picture = f"profile_pictures/{filename}"
    db.session.commit()
    
    return jsonify({'message': 'Zdjęcie zostało zapisane', 'file_path': current_user.profile_picture})

@main.route('/api/godziny', methods=['POST'])
def dodaj_godziny():
    data = request.get_json()
    new_hour = AvailableHours(date=data['date'], time=data['time'])
    db.session.add(new_hour)
    db.session.commit()
    return jsonify({'message': 'Godzina została dodana'})


@main.route('/api/godziny', methods=['GET'])
def pobierz_godziny():
    # Pobieramy datę z parametru zapytania (query parameter)
    selected_date = request.args.get('date')

    if selected_date:
        # Filtrujemy godziny na podstawie daty
        godziny = AvailableHours.query.filter_by(date=selected_date).all()
    else:
        # Jeśli nie podano daty, zwróć wszystkie godziny
        godziny = AvailableHours.query.all()

    godziny_list = [{'id': g.id, 'date': g.date, 'time': g.time} for g in godziny]
    return jsonify({'hours': godziny_list})


@main.route('/api/godziny/<int:id>', methods=['DELETE'])
def usun_godziny(id):
    hour = AvailableHours.query.get(id)
    if hour:
        db.session.delete(hour)
        db.session.commit()
        return jsonify({'message': 'Godzina została usunięta'})
    return jsonify({'message': 'Godzina nie została znaleziona'}), 404


@main.route('/api/reset_hasla', methods=['POST'])
def reset_hasla():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'message': 'Adres e-mail jest wymagany'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'Użytkownik z takim adresem e-mail nie istnieje'}), 404

    # Generowanie tokenu resetującego
    reset_token = generate_reset_token(user.email)
    reset_url = f"http://localhost:3000/reset-hasla?token={reset_token}"

    send_password_reset_email(user, reset_url)

    return jsonify({'message': 'Wysłano wiadomość e-mail z linkiem resetującym hasło'}), 200

@main.route('/api/ustaw_haslo', methods=['POST'])
def ustaw_haslo():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password')

    if not token or not new_password:
        return jsonify({'message': 'Token i nowe hasło są wymagane'}), 400

    # Weryfikacja tokenu
    email = verify_reset_token(token)
    if not email:
        return jsonify({'message': 'Nieprawidłowy lub wygasły token'}), 400

    # Znalezienie użytkownika na podstawie e-maila
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'Użytkownik nie istnieje'}), 404

    # Zaktualizowanie hasła
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    user.password = hashed_password
    db.session.commit()

    return jsonify({'message': 'Hasło zostało zaktualizowane'}), 200

