from app.models.estudiante import Estudiante
from app.models.participacion import Participacion
from app.repositories.base_repository import BaseRepository
from app import db


class EstudianteRepository(BaseRepository):
    def __init__(self):
        super().__init__(Estudiante)

    def get_by_maestro(self, maestro_id: int):
        return Estudiante.query.filter(Estudiante.maestro_id == maestro_id).all()

    def get_filtered(self, grupo=None, nivel_riesgo=None, maestro_id=None):
        query = Estudiante.query
        if grupo:
            query = query.filter(Estudiante.grupo == grupo)
        if nivel_riesgo:
            query = query.filter(Estudiante.nivel_riesgo == nivel_riesgo)
        if maestro_id:
            query = query.filter(Estudiante.maestro_id == maestro_id)
        return query.all()

    def get_stats(self):
        total = Estudiante.query.count()
        verde = Estudiante.query.filter(Estudiante.nivel_riesgo == "verde").count()
        amarillo = Estudiante.query.filter(Estudiante.nivel_riesgo == "amarillo").count()
        rojo = Estudiante.query.filter(Estudiante.nivel_riesgo == "rojo").count()
        return {"total": total, "verde": verde, "amarillo": amarillo, "rojo": rojo}

    def get_by_grupo_stats(self):
        from sqlalchemy import func
        results = (
            db.session.query(
                Estudiante.grupo,
                Estudiante.nivel_riesgo,
                func.count(Estudiante.id).label("count"),
            )
            .group_by(Estudiante.grupo, Estudiante.nivel_riesgo)
            .all()
        )
        data = {}
        for grupo, nivel, count in results:
            key = grupo or "Sin grupo"
            if key not in data:
                data[key] = {"grupo": key, "verde": 0, "amarillo": 0, "rojo": 0}
            data[key][nivel] = count
        return list(data.values())

    def add_participacion(self, estudiante_id: int, valor: float):
        p = Participacion(estudiante_id=estudiante_id, valor=valor)
        db.session.add(p)
        return p
