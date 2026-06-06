from datetime import datetime, timezone
from app import db


class PlanApoyo(db.Model):
    __tablename__ = "planes_apoyo"

    id = db.Column(db.Integer, primary_key=True)
    estudiante_id = db.Column(
        db.Integer, db.ForeignKey("estudiantes.id", ondelete="CASCADE"), nullable=False
    )
    orientacion_academica = db.Column(db.Text)
    canalizacion_soporte = db.Column(
        db.Enum("tutorias", "psicologia", "pedagogica", name="canalizacion_enum"),
        nullable=True,
    )
    fecha_creacion = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )
    # FK al maestro que creó el plan
    maestro_id = db.Column(
        db.Integer, db.ForeignKey("maestros.id", ondelete="SET NULL"), nullable=True
    )

    # Relationships
    estudiante = db.relationship("Estudiante", back_populates="planes_apoyo")
    maestro = db.relationship(
        "Maestro", back_populates="planes_creados", foreign_keys=[maestro_id]
    )

    def to_dict(self):
        return {
            "id": self.id,
            "estudiante_id": self.estudiante_id,
            "orientacion_academica": self.orientacion_academica,
            "canalizacion_soporte": self.canalizacion_soporte,
            "fecha_creacion": self.fecha_creacion.isoformat() if self.fecha_creacion else None,
            "maestro_id": self.maestro_id,
        }
