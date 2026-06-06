from datetime import datetime, timezone
from app import db


class Alerta(db.Model):
    __tablename__ = "alertas"

    id = db.Column(db.Integer, primary_key=True)
    tipo_alerta = db.Column(
        db.Enum("estudiante", "docente", name="tipo_alerta_enum"),
        nullable=False,
        default="estudiante",
    )
    mensaje = db.Column(db.Text, nullable=False)
    fecha_envio = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )
    estado = db.Column(
        db.Enum("activa", "resuelta", "ignorada", name="estado_alerta_enum"),
        default="activa",
    )
    # FK al estudiante relacionado (opcional)
    estudiante_id = db.Column(
        db.Integer, db.ForeignKey("estudiantes.id", ondelete="SET NULL"), nullable=True
    )
    # FK al maestro que recibe la alerta
    maestro_id = db.Column(
        db.Integer, db.ForeignKey("maestros.id", ondelete="CASCADE"), nullable=False
    )

    # Relationships
    estudiante = db.relationship(
        "Estudiante", back_populates="alertas", foreign_keys=[estudiante_id]
    )
    maestro = db.relationship(
        "Maestro", back_populates="alertas_recibidas", foreign_keys=[maestro_id]
    )

    def to_dict(self):
        return {
            "id": self.id,
            "tipo_alerta": self.tipo_alerta,
            "mensaje": self.mensaje,
            "fecha_envio": self.fecha_envio.isoformat() if self.fecha_envio else None,
            "estado": self.estado,
            "estudiante_id": self.estudiante_id,
            "estudiante_nombre": self.estudiante.nombre_completo() if self.estudiante else None,
            "maestro_id": self.maestro_id,
        }
