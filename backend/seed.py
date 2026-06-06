"""Seed script — datos de demo con esquema final (maestros + estudiantes)."""
import os
from app import create_app, db
from app.models.user import Maestro
from app.models.estudiante import Estudiante
from app.models.participacion import Participacion
from app.models.actividad import CActividad
from app.models.alerta import Alerta
from app.models.plan_apoyo import PlanApoyo
from app.models.desempeno_docente import DesempenoDocente
from app.models.settings import UserSettings

app = create_app(os.getenv("FLASK_ENV", "development"))

# (nombre, ap_paterno, ap_materno, grupo, participacion, rendimiento)
ESTUDIANTES = [
    ("Ana",    "Silva",    "Ramos",   "6A", 95, 92),
    ("Carlos", "Ruiz",     "Mendoza", "6A", 60, 75),
    ("Miguel", "López",    "Torres",  "4B", 30, 58),
    ("Lucía",  "Gómez",    "Herrera", "3A", 90, 88),
    ("Jorge",  "Martínez", "Vega",    "2C", 65, 71),
    ("Sofía",  "Morales",  "Castro",  "6A", 58, 62),
    ("Laura",  "Ramírez",  "Flores",  "4B", 50, 55),
    ("Pedro",  "Castillo", "Núñez",   "3A", 38, 45),
]

with app.app_context():
    db.create_all()

    if Maestro.query.filter_by(correo="docente@escuela.edu").first():
        print("ℹ️  Datos ya existentes, seed omitido.")
    else:
        # ── Maestro (docente) ─────────────────────────────────────────────────
        docente = Maestro(
            nombre="Elena",
            apellido_paterno="Martínez",
            apellido_materno="López",
            correo="docente@escuela.edu",
            rol="docente",
        )
        docente.set_password("password123")
        db.session.add(docente)
        db.session.flush()

        db.session.add(UserSettings(maestro_id=docente.id))
        db.session.add(DesempenoDocente(
            maestro_id=docente.id,
            revision_tareas_count=12,
            retroalimentacion_count=8,
            estado_desempeno="activo",
        ))

        # ── Maestro (directivo) ───────────────────────────────────────────────
        directivo = Maestro(
            nombre="Roberto",
            apellido_paterno="Sánchez",
            apellido_materno="Pérez",
            correo="directivo@escuela.edu",
            rol="directivo",
        )
        directivo.set_password("password123")
        db.session.add(directivo)
        db.session.flush()
        db.session.add(UserSettings(maestro_id=directivo.id))

        # ── Estudiantes ───────────────────────────────────────────────────────
        for nombre, ap_pat, ap_mat, grupo, part, rend in ESTUDIANTES:
            est = Estudiante(
                nombre=nombre,
                apellido_paterno=ap_pat,
                apellido_materno=ap_mat,
                grupo=grupo,
                maestro_id=docente.id,
            )
            db.session.add(est)
            db.session.flush()

            # Participaciones (dos registros: participación y rendimiento)
            db.session.add(Participacion(estudiante_id=est.id, valor=part))
            db.session.add(Participacion(estudiante_id=est.id, valor=rend))

            # Actividades de ejemplo
            db.session.add(CActividad(
                estudiante_id=est.id,
                nombre="Entrega Proyecto Parcial",
                tipo_actividad="entrega",
            ))
            db.session.add(CActividad(
                estudiante_id=est.id,
                nombre="Sesión Síncrona Semana 8",
                tipo_actividad="asistencia",
            ))

            # Calcular nivel de riesgo
            promedio = (part + rend) / 2
            if promedio >= 80:
                est.nivel_riesgo = "verde"
            elif promedio >= 60:
                est.nivel_riesgo = "amarillo"
            else:
                est.nivel_riesgo = "rojo"

            # Alertas para estudiantes en riesgo
            if est.nivel_riesgo in ("amarillo", "rojo"):
                db.session.add(Alerta(
                    tipo_alerta="estudiante",
                    mensaje=(
                        f"{est.nombre_completo()} tiene nivel "
                        f"{est.nivel_riesgo.upper()}. "
                        f"Participación: {part}%, Rendimiento: {rend}%."
                    ),
                    estudiante_id=est.id,
                    maestro_id=docente.id,
                ))

            # Plan de apoyo para riesgo crítico
            if est.nivel_riesgo == "rojo":
                db.session.add(PlanApoyo(
                    estudiante_id=est.id,
                    orientacion_academica=(
                        "Cita urgente con Dirección de Carrera. "
                        "Planificar recuperación intensiva."
                    ),
                    canalizacion_soporte="tutorias",
                    maestro_id=docente.id,
                ))

        db.session.commit()
        print("✅ Seed completado — esquema final con maestros y estudiantes.")
