from datetime import datetime, timezone
from app import db


class CActividad(db.Model):
    """Catálogo de actividades por estudiante."""
    __tablename__ = "c_actividades"

    id = db.Column(db.Integer, primary_key=True)
    estudiante_id = db.Column(
        db.Integer, db.ForeignKey("estudiantes.id", ondelete="CASCADE"), nullable=False
    )
    nombre = db.Column(db.String(200), nullable=False)
    tipo_actividad = db.Column(
        db.Enum("entrega", "asistencia", "interaccion", name="tipo_actividad_enum"),
        nullable=False,
    )
    fecha = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    estudiante = db.relationship("Estudiante", back_populates="actividades")

    def to_dict(self):
        return {
            "id": self.id,
            "estudiante_id": self.estudiante_id,
            "nombre": self.nombre,
            "tipo_actividad": self.tipo_actividad,
            "fecha": self.fecha.isoformat() if self.fecha else None,
        }
