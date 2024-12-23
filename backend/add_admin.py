from app import create_app, db, bcrypt
from app.models import User

app = create_app()

with app.app_context():
   
    existing_user = User.query.filter_by(username='admin').first()
    if existing_user:
        print("Użytkownik 'admin' już istnieje.")
    else:
       
        hashed_password = bcrypt.generate_password_hash('adminpassword').decode('utf-8')
      
        new_user = User(username='admin', password=hashed_password, email= 'szczpanski77@gmail.com', role='admin')
        db.session.add(new_user)
        db.session.commit()
        print("Użytkownik 'admin' został dodany do bazy danych.")
