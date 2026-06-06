from flask import Blueprint, request, send_file, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.services.report_service import ReportService
import io

reports_bp = Blueprint("reports", __name__)
report_service = ReportService()


def _get_maestro_id(claims):
    if claims.get("rol") == "docente":
        from flask_jwt_extended import get_jwt_identity
        return int(get_jwt_identity())
    return None


@reports_bp.get("/excel")
@jwt_required()
def download_excel():
    claims = get_jwt()
    maestro_id = _get_maestro_id(claims)

    data = report_service.generate_excel(maestro_id=maestro_id)
    return send_file(
        io.BytesIO(data),
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        as_attachment=True,
        download_name="reporte_rcm.xlsx",
    )


@reports_bp.get("/pdf")
@jwt_required()
def download_pdf():
    try:
        from weasyprint import HTML
    except ImportError:
        return jsonify({"error": "WeasyPrint no disponible en este entorno"}), 501

    claims = get_jwt()
    maestro_id = _get_maestro_id(claims)

    html_content = report_service.generate_pdf_html(maestro_id=maestro_id)
    pdf_bytes = HTML(string=html_content).write_pdf()

    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        as_attachment=True,
        download_name="reporte_rcm.pdf",
    )
