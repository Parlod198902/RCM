from datetime import datetime, timezone
import bcrypt
from app import db


class Maestro(db.Model):
    __tablename__ = "maestros"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), nullable=False)
    apellido_paterno = db.Column(db.String(80), nullable=False)
    apellido_materno = db.Column(db.String(80), nullable=True)
    correo = db.Column(db.String(120), unique=True, nullable=False)
    contrasena_hash = db.Column(db.String(255), nullable=False)
    rol = db.Column(
        db.Enum("directivo", "docente", name="rol_enum"),
        nullable=False,
        default="docente",
    )
    fecha_registro = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    estudiantes_asignados = db.relationship(
        "Estudiante", back_populates="maestro", foreign_keys="Estudiante.maestro_id"
    )
    alertas_recibidas = db.relationship(
        "Alerta", back_populates="maestro", foreign_keys="Alerta.maestro_id"
    )
    planes_creados = db.relationship(
        "PlanApoyo", back_populates="maestro", foreign_keys="PlanApoyo.maestro_id"
    )
    desempeno = db.relationship(
        "DesempenoDocente", back_populates="maestro", uselist=False
    )
    settings = db.relationship(
        "UserSettings", back_populates="maestro", uselist=False
    )

    def nombre_completo(self):
        partes = [self.nombre, self.apellido_paterno]
        if self.apellido_materno:
            partes.append(self.apellido_materno)
        return " ".join(partes)

    def set_password(self, password: str):
        self.contrasena_hash = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

    def check_password(self, password: str) -> bool:
        return bcrypt.checkpw(
            password.encode("utf-8"), self.contrasena_hash.encode("utf-8")
        )

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "apellido_paterno": self.apellido_paterno,
            "apellido_materno": self.apellido_materno,
            "nombre_completo": self.nombre_completo(),
            "correo": self.correo,
            "rol": self.rol,
            "fecha_registro": self.fecha_registro.isoformat() if self.fecha_registro else None,
        }
