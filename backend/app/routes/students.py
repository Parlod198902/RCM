from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.repositories.estudiante_repository import EstudianteRepository
from app.models.estudiante import Estudiante
from app.models.participacion import Participacion
from app import db

students_bp = Blueprint("students", __name__)
estudiante_repo = EstudianteRepository()


def _get_maestro_id():
    claims = get_jwt()
    if claims.get("rol") == "docente":
        return int(get_jwt_identity())
    return None


@students_bp.get("/")
@jwt_required()
def get_students():
    try:
        claims = get_jwt()
        grupo = request.args.get("grupo")
        nivel_riesgo = request.args.get("nivel_riesgo")
        maestro_id = int(get_jwt_identity()) if claims.get("rol") == "docente" else None

        from app.models.estudiante import Estudiante as E
        query = E.query
        if maestro_id:
            query = query.filter(E.maestro_id == maestro_id)
        if grupo:
            query = query.filter(E.grupo == grupo)
        if nivel_riesgo:
            query = query.filter(E.nivel_riesgo == nivel_riesgo)

        estudiantes = query.all()
        return jsonify([e.to_dict() for e in estudiantes]), 200
    except Exception as ex:
        import traceback
        return jsonify({"error": str(ex), "trace": traceback.format_exc()}), 500


@students_bp.get("/<int:id>")
@jwt_required()
def get_student(id):
    est = estudiante_repo.get_by_id(id)
    if not est:
        return jsonify({"error": "Estudiante no encontrado"}), 404
    return jsonify(est.to_dict()), 200


@students_bp.post("/")
@jwt_required()
def create_student():
    data = request.get_json()
    if not data or not data.get("nombre"):
        return jsonify({"error": "nombre es requerido"}), 400

    est = Estudiante(
        nombre=data["nombre"],
        apellido_paterno=data.get("apellido_paterno", ""),
        apellido_materno=data.get("apellido_materno"),
        grupo=data.get("grupo"),
        maestro_id=data.get("maestro_id") or _get_maestro_id(),
    )
    db.session.add(est)
    db.session.flush()

    if "participacion" in data:
        p = Participacion(estudiante_id=est.id, valor=float(data["participacion"]))
        db.session.add(p)

    est.calcular_riesgo()
    db.session.commit()
    return jsonify(est.to_dict()), 201


@students_bp.put("/<int:id>")
@jwt_required()
def update_student(id):
    est = estudiante_repo.get_by_id(id)
    if not est:
        return jsonify({"error": "Estudiante no encontrado"}), 404

    data = request.get_json()
    for field in ["nombre", "apellido_paterno", "apellido_materno", "grupo", "maestro_id"]:
        if field in data:
            setattr(est, field, data[field])

    if "participacion" in data:
        p = Participacion(estudiante_id=est.id, valor=float(data["participacion"]))
        db.session.add(p)

    est.calcular_riesgo()
    db.session.commit()
    return jsonify(est.to_dict()), 200


@students_bp.delete("/<int:id>")
@jwt_required()
def delete_student(id):
    est = estudiante_repo.get_by_id(id)
    if not est:
        return jsonify({"error": "Estudiante no encontrado"}), 404
    estudiante_repo.delete(est)
    return jsonify({"message": "Estudiante eliminado"}), 200
