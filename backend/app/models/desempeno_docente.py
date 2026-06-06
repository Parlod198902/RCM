from datetime import datetime, timezone, date
from app import db


class DesempenoDocente(db.Model):
    __tablename__ = "desempeno_docente"

    id = db.Column(db.Integer, primary_key=True)
    maestro_id = db.Column(
        db.Integer, db.ForeignKey("maestros.id", ondelete="CASCADE"),
        nullable=False, unique=True
    )
    revision_tareas_count = db.Column(db.Integer, default=0)
    retroalimentacion_count = db.Column(db.Integer, default=0)
    ultima_actividad_fecha = db.Column(db.DateTime, nullable=True)
    estado_desempeno = db.Column(
        db.Enum("activo", "inactivo", "revision", name="estado_desempeno_enum"),
        default="activo",
    )
    periodo = db.Column(db.Date, default=date.today)

    # Relationships
    maestro = db.relationship("Maestro", back_populates="desempeno")

    def to_dict(self):
        return {
            "id": self.id,
            "maestro_id": self.maestro_id,
            "revision_tareas_count": self.revision_tareas_count,
            "retroalimentacion_count": self.retroalimentacion_count,
            "ultima_actividad_fecha": self.ultima_actividad_fecha.isoformat()
            if self.ultima_actividad_fecha else None,
            "estado_desempeno": self.estado_desempeno,
            "periodo": self.periodo.isoformat() if self.periodo else None,
        }
