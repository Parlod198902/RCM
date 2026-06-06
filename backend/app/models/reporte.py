from datetime import datetime, timezone
from app import db


class Reporte(db.Model):
    __tablename__ = "reportes"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    tipo = db.Column(db.String(20), nullable=False)   # pdf | excel
    fecha_generacion = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )
    # generado_por eliminado — es dato derivado (se obtiene del JWT en el momento)

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "tipo": self.tipo,
            "fecha_generacion": self.fecha_generacion.isoformat(),
        }


class ArchivoImportado(db.Model):
    __tablename__ = "archivos_importados"

    id = db.Column(db.Integer, primary_key=True)
    nombre_archivo = db.Column(db.String(255), nullable=False)
    fecha = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    maestro_id = db.Column(
        db.Integer, db.ForeignKey("maestros.id", ondelete="SET NULL"), nullable=True
    )
    registros_procesados = db.Column(db.Integer, default=0)
    errores = db.Column(db.Integer, default=0)
    estado = db.Column(db.String(20), default="procesado")

    def to_dict(self):
        return {
            "id": self.id,
            "nombre_archivo": self.nombre_archivo,
            "fecha": self.fecha.isoformat(),
            "maestro_id": self.maestro_id,
            "registros_procesados": self.registros_procesados,
            "errores": self.errores,
            "estado": self.estado,
        }
