from app.models.user import Maestro
from app.repositories.base_repository import BaseRepository


class DocenteRepository(BaseRepository):
    def __init__(self):
        super().__init__(Maestro)

    def get_by_user_id(self, maestro_id: int):
        return Maestro.query.filter_by(id=maestro_id, rol="docente").first()
