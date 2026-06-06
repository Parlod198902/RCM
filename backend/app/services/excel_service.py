import pandas as pd
from datetime import datetime, timezone
from app import db
from app.models.estudiante import Estudiante
from app.models.participacion import Participacion
from app.models.actividad import CActividad
from app.models.alerta import Alerta
from app.models.settings import UserSettings

# Columnas mínimas requeridas
REQUIRED_COLUMNS = {"nombre", "participacion"}


class ExcelService:
    def process_file(self, filepath: str, docente_id: int = None, user_id: int = None):
        """
        Procesa el archivo Excel/CSV.

        Lógica de negocio:
        - Si el alumno (mismo nombre + maestro) ya existe → agrega nueva participación
          con la fecha/hora actual (nuevo registro histórico).
        - Si el alumno NO existe → lo crea.
        - El nivel_riesgo del estudiante se recalcula con el promedio de TODAS sus
          participaciones registradas hasta ahora.
        - Se genera alerta solo si el nivel empeoró respecto al anterior.
        """
        try:
            if filepath.endswith(".csv"):
                df = pd.read_csv(filepath)
            else:
                df = pd.read_excel(filepath)
        except Exception as e:
            return None, f"Error leyendo archivo: {str(e)}"

        # Normalizar nombres de columnas
        df.columns = [c.strip().lower() for c in df.columns]

        missing = REQUIRED_COLUMNS - set(df.columns)
        if missing:
            return None, f"Columnas faltantes: {', '.join(missing)}"

        df = df.dropna(subset=["nombre"])

        # Obtener umbrales del usuario
        umbral_verde, umbral_amarillo = 80.0, 60.0
        if user_id:
            settings = UserSettings.query.filter_by(maestro_id=user_id).first()
            if settings:
                umbral_verde = settings.umbral_verde
                umbral_amarillo = settings.umbral_amarillo

        processed, errors = 0, 0
        nuevas_alertas = []
        timestamp_carga = datetime.now(timezone.utc)

        for _, row in df.iterrows():
            try:
                nombre = str(row["nombre"]).strip()
                if not nombre or nombre.lower() == "nan":
                    errors += 1
                    continue

                participacion_val = float(row["participacion"])
                rendimiento_val   = float(row.get("rendimiento", participacion_val))

                # ── Buscar o crear estudiante ──────────────────────────────
                estudiante = None
                if docente_id:
                    estudiante = Estudiante.query.filter(
                        Estudiante.nombre == nombre,
                        Estudiante.maestro_id == docente_id,
                    ).first()

                if not estudiante:
                    ap_pat = str(row.get("apellido_paterno", "")).strip() or "—"
                    ap_mat = str(row.get("apellido_materno", "")).strip() or None
                    grupo  = str(row.get("grupo", "")).strip() or None

                    estudiante = Estudiante(
                        nombre=nombre,
                        apellido_paterno=ap_pat,
                        apellido_materno=ap_mat,
                        grupo=grupo,
                        maestro_id=docente_id,
                    )
                    db.session.add(estudiante)
                    db.session.flush()
                else:
                    # Actualizar grupo si viene en el archivo
                    if "grupo" in row and str(row["grupo"]).strip():
                        estudiante.grupo = str(row["grupo"]).strip()

                nivel_anterior = estudiante.nivel_riesgo

                # ── Registrar NUEVA participación con timestamp de esta carga ──
                p = Participacion(
                    estudiante_id=estudiante.id,
                    valor=participacion_val,
                    fecha_calculo=timestamp_carga,
                )
                db.session.add(p)

                # Registrar actividad si viene tipo
                if "tipo_actividad" in row:
                    tipo = str(row.get("tipo_actividad", "")).strip().lower()
                    if tipo in ("entrega", "asistencia", "interaccion"):
                        act = CActividad(
                            estudiante_id=estudiante.id,
                            nombre=str(row.get("actividad", "Actividad importada")).strip(),
                            tipo_actividad=tipo,
                            fecha=timestamp_carga,
                        )
                        db.session.add(act)

                # ── Recalcular riesgo con promedio de TODAS las participaciones ──
                # Incluimos la nueva que acabamos de agregar (flush para que esté disponible)
                db.session.flush()
                todas = Participacion.query.filter_by(
                    estudiante_id=estudiante.id
                ).all()
                promedio = sum(p.valor for p in todas) / len(todas)
                promedio_actual = (participacion_val + rendimiento_val) / 2

                # Usamos el promedio de esta carga para el nivel (más representativo)
                if promedio_actual >= umbral_verde:
                    estudiante.nivel_riesgo = "verde"
                elif promedio_actual >= umbral_amarillo:
                    estudiante.nivel_riesgo = "amarillo"
                else:
                    estudiante.nivel_riesgo = "rojo"

                # ── Alerta solo si el nivel empeoró ───────────────────────
                niveles = {"verde": 0, "amarillo": 1, "rojo": 2}
                if (nivel_anterior != estudiante.nivel_riesgo and
                        niveles.get(estudiante.nivel_riesgo, 0) > niveles.get(nivel_anterior, 0)):
                    if docente_id:
                        msg = (
                            f"{estudiante.nombre_completo()} cambió a nivel "
                            f"{estudiante.nivel_riesgo.upper()}. "
                            f"Participación: {participacion_val:.0f}%, "
                            f"Rendimiento: {rendimiento_val:.0f}%."
                        )
                        alerta = Alerta(
                            tipo_alerta="estudiante",
                            mensaje=msg,
                            estudiante_id=estudiante.id,
                            maestro_id=docente_id,
                        )
                        db.session.add(alerta)
                        nuevas_alertas.append(alerta)

                # Actualizar fecha de última actualización
                estudiante.fecha_actualizacion = timestamp_carga
                processed += 1

            except Exception as ex:
                errors += 1
                db.session.rollback()
                continue

        db.session.commit()
        return {
            "procesados": processed,
            "errores": errors,
            "alertas": len(nuevas_alertas),
            "timestamp": timestamp_carga.isoformat(),
        }, None

    def get_preview(self, filepath: str):
        """Retorna las primeras 5 filas como vista previa."""
        try:
            if filepath.endswith(".csv"):
                df = pd.read_csv(filepath, nrows=5)
            else:
                df = pd.read_excel(filepath, nrows=5)
            df.columns = [c.strip().lower() for c in df.columns]
            return df.fillna("").to_dict(orient="records"), None
        except Exception as e:
            return None, str(e)
