from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.settings import UserSettings
from app import db

settings_bp = Blueprint("settings", __name__)


@settings_bp.get("/")
@jwt_required()
def get_settings():
    maestro_id = int(get_jwt_identity())
    s = UserSettings.query.filter_by(maestro_id=maestro_id).first()
    if not s:
        s = UserSettings(maestro_id=maestro_id)
        db.session.add(s)
        db.session.commit()
    return jsonify(s.to_dict()), 200


@settings_bp.put("/")
@jwt_required()
def update_settings():
    maestro_id = int(get_jwt_identity())
    s = UserSettings.query.filter_by(maestro_id=maestro_id).first()
    if not s:
        s = UserSettings(maestro_id=maestro_id)
        db.session.add(s)

    data = request.get_json()
    allowed = ["alertas_correo", "resumen_semanal", "modo_oscuro", "umbral_verde", "umbral_amarillo"]
    for field in allowed:
        if field in data:
            setattr(s, field, data[field])

    db.session.commit()
    return jsonify(s.to_dict()), 200
