from app import create_app, db
from dotenv import load_dotenv
import os

load_dotenv()
app_key = os.getenv('EMAILLABS_APP_KEY')
app_secret = os.getenv('EMAILLABS_APP_SECRET')

app = create_app()

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
