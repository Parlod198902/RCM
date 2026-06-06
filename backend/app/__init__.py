from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_migrate import Migrate

db = SQLAlchemy()
jwt = JWTManager()
socketio = SocketIO()
migrate = Migrate()


def create_app(config_name="development"):
    app = Flask(__name__)

    # Config
    from app.config.settings import config
    app.config.from_object(config[config_name])

    # Extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app, origins=[app.config["FRONTEND_URL"], "http://localhost:5173", "http://127.0.0.1:5173"], supports_credentials=True)
    socketio.init_app(
        app,
        cors_allowed_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5001"],
        async_mode="threading",
    )

    # Blueprints
    from app.routes.auth import auth_bp
    from app.routes.students import students_bp
    from app.routes.alerts import alerts_bp
    from app.routes.dashboard import dashboard_bp
    from app.routes.reports import reports_bp
    from app.routes.upload import upload_bp
    from app.routes.settings import settings_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(students_bp, url_prefix="/api/students")
    app.register_blueprint(alerts_bp, url_prefix="/api/alerts")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(reports_bp, url_prefix="/api/reports")
    app.register_blueprint(upload_bp, url_prefix="/api/upload")
    app.register_blueprint(settings_bp, url_prefix="/api/settings")

    return app
