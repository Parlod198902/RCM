from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.repositories.estudiante_repository import EstudianteRepository
from app.repositories.alerta_repository import AlertaRepository

dashboard_bp = Blueprint("dashboard", __name__)
estudiante_repo = EstudianteRepository()
alerta_repo = AlertaRepository()


@dashboard_bp.get("/stats")
@jwt_required()
def get_stats():
    claims = get_jwt()
    maestro_id = int(get_jwt_identity())
    stats = estudiante_repo.get_stats()
    unread = alerta_repo.get_unread_count(
        maestro_id=maestro_id if claims.get("rol") == "docente" else None
    )
    stats["alertas_sin_leer"] = unread
    return jsonify(stats), 200


@dashboard_bp.get("/charts")
@jwt_required()
def get_charts():
    by_grupo = estudiante_repo.get_by_grupo_stats()
    return jsonify({"por_grupo": by_grupo}), 200
