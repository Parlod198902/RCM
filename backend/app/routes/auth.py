from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.auth_service import AuthService

auth_bp = Blueprint("auth", __name__)
auth_service = AuthService()


@auth_bp.post("/login")
def login():
    data = request.get_json()
    if not data or not data.get("correo") or not data.get("password"):
        return jsonify({"error": "Correo y contraseña requeridos"}), 400

    result, error = auth_service.login(data["correo"], data["password"])
    if error:
        return jsonify({"error": error}), 401
    return jsonify(result), 200


@auth_bp.post("/register")
def register():
    data = request.get_json()
    required = ["nombre", "correo", "password"]
    if not data or any(f not in data for f in required):
        return jsonify({"error": "Campos requeridos: nombre, correo, password"}), 400

    result, error = auth_service.register(
        data["nombre"], data["correo"], data["password"], data.get("rol", "docente")
    )
    if error:
        return jsonify({"error": error}), 409
    return jsonify(result), 201


@auth_bp.get("/profile")
@jwt_required()
def profile():
    user_id = int(get_jwt_identity())
    result, error = auth_service.get_profile(user_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(result), 200
