import os
import resend
from flask import current_app


class NotificationService:
    def _get_client(self):
        resend.api_key = current_app.config.get("RESEND_API_KEY", "")
        return resend

    def send_risk_alert(self, to_email: str, docente_nombre: str, estudiante_nombre: str, nivel: str):
        if not current_app.config.get("RESEND_API_KEY"):
            current_app.logger.warning("RESEND_API_KEY not configured, skipping email.")
            return False

        color = "#EF4444" if nivel == "rojo" else "#EAB308"
        label = "RIESGO CRÍTICO" if nivel == "rojo" else "RIESGO MEDIO"

        html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1A365D; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">⚠️ Alerta RCM — {label}</h1>
          </div>
          <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <p>Estimado/a <strong>{docente_nombre}</strong>,</p>
            <p>El estudiante <strong>{estudiante_nombre}</strong> ha sido clasificado en nivel
               <span style="color:{color}; font-weight:bold;">{label}</span>.</p>
            <p>Por favor ingresa al sistema RCM para revisar el perfil del estudiante y tomar las acciones necesarias.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">Sistema RCM — Reporteador de Control y Monitoreo</p>
          </div>
        </div>
        """

        try:
            client = self._get_client()
            client.Emails.send({
                "from": current_app.config["RESEND_FROM_EMAIL"],
                "to": [to_email],
                "subject": f"[RCM] Alerta: {estudiante_nombre} — {label}",
                "html": html,
            })
            return True
        except Exception as e:
            current_app.logger.error(f"Error sending email: {e}")
            return False

    def send_weekly_summary(self, to_email: str, docente_nombre: str, stats: dict):
        if not current_app.config.get("RESEND_API_KEY"):
            return False

        html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1A365D; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">📊 Resumen Semanal RCM</h1>
          </div>
          <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <p>Estimado/a <strong>{docente_nombre}</strong>, aquí tu resumen semanal:</p>
            <table style="width:100%; border-collapse: collapse;">
              <tr><td style="padding:8px; border-bottom:1px solid #e5e7eb;">Total estudiantes</td>
                  <td style="padding:8px; border-bottom:1px solid #e5e7eb; font-weight:bold;">{stats.get('total', 0)}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #e5e7eb; color:#22C55E;">Sin Riesgo</td>
                  <td style="padding:8px; border-bottom:1px solid #e5e7eb; font-weight:bold;">{stats.get('verde', 0)}</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #e5e7eb; color:#EAB308;">Riesgo Medio</td>
                  <td style="padding:8px; border-bottom:1px solid #e5e7eb; font-weight:bold;">{stats.get('amarillo', 0)}</td></tr>
              <tr><td style="padding:8px; color:#EF4444;">Riesgo Crítico</td>
                  <td style="padding:8px; font-weight:bold;">{stats.get('rojo', 0)}</td></tr>
            </table>
          </div>
        </div>
        """

        try:
            client = self._get_client()
            client.Emails.send({
                "from": current_app.config["RESEND_FROM_EMAIL"],
                "to": [to_email],
                "subject": "[RCM] Resumen Semanal de tus Grupos",
                "html": html,
            })
            return True
        except Exception as e:
            current_app.logger.error(f"Error sending weekly summary: {e}")
            return False
