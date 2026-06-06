from flask_jwt_extended import create_access_token
from app.repositories.user_repository import UserRepository

user_repo = UserRepository()


class AuthService:
    def login(self, correo: str, password: str):
        user = user_repo.get_by_email(correo)
        if not user or not user.check_password(password):
            return None, "Credenciales inválidas"

        token = create_access_token(
            identity=str(user.id),
            additional_claims={"rol": user.rol, "nombre": user.nombre_completo()},
        )
        return {"token": token, "user": user.to_dict()}, None

    def register(self, nombre: str, correo: str, password: str, rol: str = "docente"):
        if user_repo.get_by_email(correo):
            return None, "El correo ya está registrado"
        user = user_repo.create_with_settings(
            nombre=nombre,
            apellido_paterno="",
            correo=correo,
            password=password,
            rol=rol,
        )
        return user.to_dict(), None

    def get_profile(self, user_id: int):
        user = user_repo.get_by_id(user_id)
        if not user:
            return None, "Usuario no encontrado"
        return user.to_dict(), None
