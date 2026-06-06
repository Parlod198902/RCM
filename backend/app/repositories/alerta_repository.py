from app.models.alerta import Alerta
from app.repositories.base_repository import BaseRepository
from app import db


class AlertaRepository(BaseRepository):
    def __init__(self):
        super().__init__(Alerta)

    def get_by_maestro(self, maestro_id: int):
        return (
            Alerta.query
            .filter_by(maestro_id=maestro_id)
            .order_by(Alerta.fecha_envio.desc())
            .all()
        )

    def get_unread_count(self, maestro_id: int = None):
        query = Alerta.query.filter_by(estado="activa")
        if maestro_id:
            query = query.filter_by(maestro_id=maestro_id)
        return query.count()

    def mark_all_resolved(self, maestro_id: int = None):
        query = Alerta.query.filter_by(estado="activa")
        if maestro_id:
            query = query.filter_by(maestro_id=maestro_id)
        query.update({"estado": "resuelta"})
        db.session.commit()

    def get_all_ordered(self):
        return Alerta.query.order_by(Alerta.fecha_envio.desc()).all()
