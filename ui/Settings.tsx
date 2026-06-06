import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Switch, 
  FormControlLabel, 
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import { NotificationsActive, Security, ColorLens } from '@mui/icons-material';

export function Settings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleToggle = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    
    if (setting === 'email') setEmailAlerts(checked);
    if (setting === 'sms') setSmsAlerts(checked);
    if (setting === 'dark') setDarkMode(checked);

    // Simulando llamada PUT /api/settings
    setShowSnackbar(true);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Configuración
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Gestiona tus preferencias de alertas y visualización del sistema RCM.
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <NotificationsActive color="primary" />
            <Typography variant="h6">Notificaciones y Alertas (Resend)</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Box display="flex" flexDirection="column" gap={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">Alertas por Correo Electrónico</Typography>
                <Typography variant="body2" color="text.secondary">
                  Recibe notificaciones inmediatas cuando un alumno pase a estado rojo (riesgo alto).
                </Typography>
              </Box>
              <Switch 
                checked={emailAlerts} 
                onChange={handleToggle('email')} 
                color="primary"
              />
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">Resumen Semanal</Typography>
                <Typography variant="body2" color="text.secondary">
                  Recibe un reporte semanal del estatus de tus grupos asignados.
                </Typography>
              </Box>
              <Switch 
                checked={smsAlerts} 
                onChange={handleToggle('sms')} 
                color="primary"
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <ColorLens color="primary" />
            <Typography variant="h6">Apariencia</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">Modo Oscuro</Typography>
              <Typography variant="body2" color="text.secondary">
                Cambiar el tema visual de la interfaz.
              </Typography>
            </Box>
            <Switch 
              checked={darkMode} 
              onChange={handleToggle('dark')} 
              color="primary"
            />
          </Box>
        </CardContent>
      </Card>

      <Snackbar 
        open={showSnackbar} 
        autoHideDuration={3000} 
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Preferencias actualizadas correctamente en el servidor.
        </Alert>
      </Snackbar>
    </Box>
  );
}