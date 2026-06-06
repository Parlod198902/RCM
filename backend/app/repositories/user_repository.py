from app.models.user import Maestro
from app.models.settings import UserSettings
from app.repositories.base_repository import BaseRepository
from app import db


class UserRepository(BaseRepository):
    def __init__(self):
        super().__init__(Maestro)

    def get_by_email(self, correo: str):
        return Maestro.query.filter_by(correo=correo).first()

    def create_with_settings(self, nombre: str, apellido_paterno: str,
                              correo: str, password: str,
                              rol: str = "docente", apellido_materno: str = None):
        maestro = Maestro(
            nombre=nombre,
            apellido_paterno=apellido_paterno,
            apellido_materno=apellido_materno,
            correo=correo,
            rol=rol,
        )
        maestro.set_password(password)
        db.session.add(maestro)
        db.session.flush()

        db.session.add(UserSettings(maestro_id=maestro.id))
        db.session.commit()
        return maestro
