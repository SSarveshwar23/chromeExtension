from flask import Flask
from flask_cors import CORS
from .main.routes import main_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    # Register blueprints
    
    app.register_blueprint(main_bp)

    return app