from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_cors import CORS

db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
login_manager.login_view = 'main.logowanie'

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'your_secret_key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SESSION_COOKIE_HTTPONLY'] = False
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    app.config['SESSION_COOKIE_SECURE'] = True

    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    
  
    CORS(app, supports_credentials=True)

    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)

    @login_manager.unauthorized_handler
    def unauthorized_callback():
        return jsonify({'message': 'Proszę się zalogować, aby uzyskać dostęp do tej strony.'}), 401

    return app
