from datetime import datetime, timezone
from app import db


class Participacion(db.Model):
    __tablename__ = "participaciones"

    id = db.Column(db.Integer, primary_key=True)
    estudiante_id = db.Column(
        db.Integer, db.ForeignKey("estudiantes.id", ondelete="CASCADE"), nullable=False
    )
    valor = db.Column(db.Float, nullable=False)  # 0-100 porcentaje
    fecha_calculo = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    estudiante = db.relationship("Estudiante", back_populates="participaciones")

    def to_dict(self):
        return {
            "id": self.id,
            "estudiante_id": self.estudiante_id,
            "valor": self.valor,
            "fecha_calculo": self.fecha_calculo.isoformat() if self.fecha_calculo else None,
        }
