import os
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from werkzeug.utils import secure_filename
from app.services.excel_service import ExcelService
from app.models.reporte import ArchivoImportado
from app import db, socketio

upload_bp = Blueprint("upload", __name__)
excel_service = ExcelService()

ALLOWED_EXTENSIONS = {"xlsx", "xls", "csv"}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@upload_bp.post("/excel")
@jwt_required()
def upload_excel():
    if "file" not in request.files:
        return jsonify({"error": "No se envió ningún archivo"}), 400

    file = request.files["file"]
    if not file.filename or not allowed_file(file.filename):
        return jsonify({"error": "Formato no permitido. Use .xlsx, .xls o .csv"}), 400

    user_id = int(get_jwt_identity())
    claims = get_jwt()
    maestro_id = user_id if claims.get("rol") == "docente" else None

    upload_folder = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)

    filename = secure_filename(file.filename)
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)

    result, error = excel_service.process_file(
        filepath, docente_id=maestro_id, user_id=user_id
    )

    if error:
        return jsonify({"error": error}), 422

    archivo = ArchivoImportado(
        nombre_archivo=filename,
        maestro_id=maestro_id,
        registros_procesados=result["procesados"],
        errores=result["errores"],
    )
    db.session.add(archivo)
    db.session.commit()

    # Notificar via socket
    socketio.emit("dashboard_actualizado", result)

    return jsonify(result), 200


@upload_bp.post("/preview")
@jwt_required()
def preview_excel():
    if "file" not in request.files:
        return jsonify({"error": "No se envió ningún archivo"}), 400

    file = request.files["file"]
    if not file.filename or not allowed_file(file.filename):
        return jsonify({"error": "Formato no permitido"}), 400

    upload_folder = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)

    filename = secure_filename(file.filename)
    filepath = os.path.join(upload_folder, f"preview_{filename}")
    file.save(filepath)

    rows, error = excel_service.get_preview(filepath)
    if error:
        return jsonify({"error": error}), 422
    return jsonify({"preview": rows}), 200
