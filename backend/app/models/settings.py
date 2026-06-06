from app import db


class UserSettings(db.Model):
    __tablename__ = "user_settings"

    id = db.Column(db.Integer, primary_key=True)
    maestro_id = db.Column(
        db.Integer, db.ForeignKey("maestros.id", ondelete="CASCADE"),
        unique=True, nullable=False
    )
    alertas_correo = db.Column(db.Boolean, default=True)
    resumen_semanal = db.Column(db.Boolean, default=False)
    modo_oscuro = db.Column(db.Boolean, default=False)
    umbral_verde = db.Column(db.Float, default=80.0)
    umbral_amarillo = db.Column(db.Float, default=60.0)

    # Relationships
    maestro = db.relationship("Maestro", back_populates="settings")

    def to_dict(self):
        return {
            "alertas_correo": self.alertas_correo,
            "resumen_semanal": self.resumen_semanal,
            "modo_oscuro": self.modo_oscuro,
            "umbral_verde": self.umbral_verde,
            "umbral_amarillo": self.umbral_amarillo,
        }
