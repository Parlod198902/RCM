from datetime import datetime, timezone
from app import db


class Estudiante(db.Model):
    __tablename__ = "estudiantes"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), nullable=False)
    apellido_paterno = db.Column(db.String(80), nullable=False)
    apellido_materno = db.Column(db.String(80), nullable=True)
    grupo = db.Column(db.String(20))
    nivel_riesgo = db.Column(
        db.Enum("verde", "amarillo", "rojo", name="nivel_riesgo_enum"),
        default="verde",
    )
    fecha_actualizacion = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    # FK al maestro responsable
    maestro_id = db.Column(
        db.Integer, db.ForeignKey("maestros.id", ondelete="SET NULL"), nullable=True
    )

    # Relationships
    maestro = db.relationship(
        "Maestro", back_populates="estudiantes_asignados", foreign_keys=[maestro_id]
    )
    participaciones = db.relationship(
        "Participacion", back_populates="estudiante", cascade="all, delete-orphan"
    )
    actividades = db.relationship(
        "CActividad", back_populates="estudiante", cascade="all, delete-orphan"
    )
    alertas = db.relationship(
        "Alerta", back_populates="estudiante", foreign_keys="Alerta.estudiante_id",
        cascade="all, delete-orphan"
    )
    planes_apoyo = db.relationship(
        "PlanApoyo", back_populates="estudiante", cascade="all, delete-orphan"
    )

    def nombre_completo(self):
        partes = [self.nombre, self.apellido_paterno]
        if self.apellido_materno:
            partes.append(self.apellido_materno)
        return " ".join(partes)

    def calcular_riesgo(self, umbral_verde=80.0, umbral_amarillo=60.0):
        if not self.participaciones:
            return self.nivel_riesgo
        promedio = sum(p.valor for p in self.participaciones) / len(self.participaciones)
        if promedio >= umbral_verde:
            self.nivel_riesgo = "verde"
        elif promedio >= umbral_amarillo:
            self.nivel_riesgo = "amarillo"
        else:
            self.nivel_riesgo = "rojo"
        return self.nivel_riesgo

    def to_dict(self):
        # Calcular participación como promedio de todos los registros
        participacion = 0.0
        historial = []
        if self.participaciones:
            valores = sorted(self.participaciones, key=lambda p: p.fecha_calculo)
            participacion = sum(p.valor for p in valores) / len(valores)
            historial = [
                {"valor": p.valor, "fecha": p.fecha_calculo.isoformat() if p.fecha_calculo else None}
                for p in valores
            ]
        return {
            "id": self.id,
            "nombre": self.nombre,
            "apellido_paterno": self.apellido_paterno,
            "apellido_materno": self.apellido_materno,
            "nombre_completo": self.nombre_completo(),
            "grupo": self.grupo,
            "nivel_riesgo": self.nivel_riesgo,
            "participacion": round(participacion, 1),
            "historial_participaciones": historial,
            "total_registros": len(self.participaciones),
            "maestro_id": self.maestro_id,
            "fecha_actualizacion": self.fecha_actualizacion.isoformat()
            if self.fecha_actualizacion else None,
        }
