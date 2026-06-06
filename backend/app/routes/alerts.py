from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.repositories.alerta_repository import AlertaRepository
from app.models.alerta import Alerta
from app import db

alerts_bp = Blueprint("alerts", __name__)
alerta_repo = AlertaRepository()


@alerts_bp.get("/")
@jwt_required()
def get_alerts():
    claims = get_jwt()
    maestro_id = int(get_jwt_identity())
    if claims.get("rol") == "docente":
        alertas = alerta_repo.get_by_maestro(maestro_id)
    else:
        alertas = alerta_repo.get_all_ordered()
    return jsonify([a.to_dict() for a in alertas]), 200


@alerts_bp.post("/")
@jwt_required()
def create_alert():
    data = request.get_json()
    if not data or not data.get("mensaje") or not data.get("maestro_id"):
        return jsonify({"error": "mensaje y maestro_id son requeridos"}), 400

    alerta = Alerta(
        tipo_alerta=data.get("tipo_alerta", "estudiante"),
        mensaje=data["mensaje"],
        estudiante_id=data.get("estudiante_id"),
        maestro_id=data["maestro_id"],
    )
    db.session.add(alerta)
    db.session.commit()
    return jsonify(alerta.to_dict()), 201


@alerts_bp.put("/read")
@jwt_required()
def mark_all_read():
    claims = get_jwt()
    maestro_id = int(get_jwt_identity()) if claims.get("rol") == "docente" else None
    alerta_repo.mark_all_resolved(maestro_id)
    return jsonify({"message": "Alertas marcadas como resueltas"}), 200


@alerts_bp.put("/<int:id>/read")
@jwt_required()
def mark_one_read(id):
    alerta = alerta_repo.get_by_id(id)
    if not alerta:
        return jsonify({"error": "Alerta no encontrada"}), 404
    alerta.estado = "resuelta"
    db.session.commit()
    return jsonify(alerta.to_dict()), 200


@alerts_bp.delete("/<int:id>")
@jwt_required()
def delete_alert(id):
    alerta = alerta_repo.get_by_id(id)
    if not alerta:
        return jsonify({"error": "Alerta no encontrada"}), 404
    alerta_repo.delete(alerta)
    return jsonify({"message": "Alerta eliminada"}), 200
