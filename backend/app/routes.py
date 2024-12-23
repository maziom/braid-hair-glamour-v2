from flask import Blueprint, jsonify, request, session
from flask_login import login_user, logout_user, login_required, current_user
from . import db, bcrypt, login_manager
from .models import User, Booking, Message, AvailableHours
from .email_utils import send_email


main = Blueprint('main', __name__)

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
    new_booking = Booking(user_id=current_user.id, date=data['date'], time=data['time'])
    db.session.add(new_booking)
    db.session.commit()
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
        return jsonify({'message': 'Rezerwacja została zaktualizowana'})
    return jsonify({'message': 'Rezerwacja nie została znaleziona lub brak uprawnień'}), 404

@main.route('/api/rezerwacje/<int:id>', methods=['DELETE'])
@login_required
def usun_rezerwacje(id):
    booking = Booking.query.get(id)
    if booking and (booking.user_id == current_user.id or current_user.role == 'admin'):
        db.session.delete(booking)
        db.session.commit()
        return jsonify({'message': 'Rezerwacja została usunięta'})
    return jsonify({'message': 'Rezerwacja nie została znaleziona lub brak uprawnień'}), 404

@main.route('/api/wiadomosci', methods=['POST'])
def wyslij_wiadomosc():
    data = request.get_json()
    receiver = User.query.filter_by(username='admin').first()
    if not receiver:
        return jsonify({'message': 'Admin nie został znaleziony'}), 404
    
   # Obsługa braku zalogowanego użytkownika
    sender_id = current_user.id if hasattr(current_user, 'id') and current_user.is_authenticated else None

    new_message = Message(
        sender_id=sender_id,
        receiver_id=receiver.id,
        content=data['content']
    )
    db.session.add(new_message)
    db.session.commit()
    return jsonify({'message': 'Wiadomość została wysłana'})


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
    filename = f"profile_pictures/{current_user.id}_{file.filename}"
    file.save(f"./static/{filename}")  
    current_user.profile_picture = filename
    db.session.commit()
    return jsonify({'message': 'Zdjęcie zostało zapisane', 'file_path': filename})

@main.route('/api/godziny', methods=['POST'])
@login_required
def dodaj_godziny():
    if current_user.role != 'admin':
        return jsonify({'message': 'Brak uprawnień'}), 403

    data = request.get_json()
    new_hour = AvailableHours(admin_id=current_user.id, date=data['date'], time=data['time'])
    db.session.add(new_hour)
    db.session.commit()
    return jsonify({'message': 'Godzina została dodana'})


@main.route('/api/godziny', methods=['GET'])
def pobierz_godziny():
    godziny = AvailableHours.query.all()
    godziny_list = [{'id': g.id, 'date': g.date, 'time': g.time, 'admin_id': g.admin_id} for g in godziny]
    return jsonify({'hours': godziny_list})

@main.route('/api/wiadomosci/odpowiedz', methods=['POST'])
@login_required
def odpowiedz_na_wiadomosc():
    data = request.get_json()
    original_message = Message.query.get(data['original_message_id'])
    if not original_message or original_message.receiver_id != current_user.id:
        return jsonify({'message': 'Nie znaleziono wiadomości lub brak uprawnień'}), 403

    new_message = Message(
        sender_id=current_user.id,
        receiver_id=original_message.sender_id,
        content=data['content']
    )
    db.session.add(new_message)
    db.session.commit()
    return jsonify({'message': 'Odpowiedź została wysłana'})


@main.route('/api/wiadomosci/oznacz_odczytane', methods=['PUT'])
@login_required
def oznacz_odczytane():
    data = request.get_json()
    message = Message.query.get(data['message_id'])
    if message and message.receiver_id == current_user.id:
        message.is_read = True
        db.session.commit()
        return jsonify({'message': 'Wiadomość oznaczona jako odczytana'})
    return jsonify({'message': 'Nie znaleziono wiadomości lub brak uprawnień'}), 404

@main.route('/api/wiadomosci/nieodczytane', methods=['GET'])
@login_required
def liczba_nieodczytanych():
    if current_user.role != 'admin':
        return jsonify({'message': 'Brak uprawnień'}), 403

    nieodczytane = Message.query.filter_by(receiver_id=current_user.id, is_read=False).count()
    return jsonify({'unread_messages': nieodczytane})


