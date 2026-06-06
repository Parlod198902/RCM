import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Button,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import { useState } from 'react';
import {
  Warning,
  Error as ErrorIcon,
  Info,
  Close,
  CheckCircle,
  TrendingDown,
  AssignmentLate
} from '@mui/icons-material';

interface Alert {
  id: number;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  student?: string;
  time: string;
  read: boolean;
}

const alertsData: Alert[] = [
  {
    id: 1,
    type: 'error',
    title: 'Estudiante en Estado Crítico',
    description: 'Carlos Eduardo Rodríguez ha bajado su participación al 45%. Se requiere intervención inmediata.',
    student: 'Carlos Rodríguez - A00123457',
    time: 'Hace 1 hora',
    read: false
  },
  {
    id: 2,
    type: 'error',
    title: 'Estudiante en Estado Crítico',
    description: 'Miguel Ángel Castillo tiene 38% de participación y solo 6 tareas completadas.',
    student: 'Miguel Castillo - A00123463',
    time: 'Hace 2 horas',
    read: false
  },
  {
    id: 3,
    type: 'warning',
    title: 'Disminución en Participación',
    description: 'María Fernanda García ha disminuido su participación un 25% en las últimas 2 semanas.',
    student: 'María García - A00123458',
    time: 'Hace 3 horas',
    read: false
  },
  {
    id: 4,
    type: 'warning',
    title: 'Tareas Pendientes de Revisión',
    description: 'Tienes 5 tareas del grupo 6A pendientes de revisión desde hace 3 días.',
    time: 'Hace 5 horas',
    read: false
  },
  {
    id: 5,
    type: 'warning',
    title: 'Bajo Rendimiento en Materia',
    description: 'Laura Gabriela Ramírez ha completado solo 5 de 10 tareas en Algoritmos.',
    student: 'Laura Ramírez - A00123460',
    time: 'Hace 6 horas',
    read: true
  },
  {
    id: 6,
    type: 'info',
    title: 'Actualización del Sistema',
    description: 'Nueva funcionalidad disponible: Exportar reportes en formato PDF.',
    time: 'Hace 1 día',
    read: true
  },
  {
    id: 7,
    type: 'warning',
    title: 'Estudiante en Riesgo',
    description: 'Sofía Isabel Morales tiene 58% de participación y está en estado de riesgo medio.',
    student: 'Sofía Morales - A00123462',
    time: 'Hace 1 día',
    read: true
  },
  {
    id: 8,
    type: 'info',
    title: 'Recordatorio de Carga de Datos',
    description: 'No has cargado datos de actividad esta semana. Recuerda mantener actualizado el sistema.',
    time: 'Hace 2 días',
    read: true
  }
];

export function Alertas() {
  const [alerts, setAlerts] = useState(alertsData);
  const [tabValue, setTabValue] = useState(0);

  const handleDismiss = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleMarkRead = (id: number) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const handleMarkAllRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (tabValue === 0) return !alert.read;
    if (tabValue === 1) return alert.type === 'error' || alert.type === 'warning';
    return true;
  });

  const unreadCount = alerts.filter(a => !a.read).length;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <ErrorIcon sx={{ color: '#f44336' }} />;
      case 'warning':
        return <Warning sx={{ color: '#ff9800' }} />;
      default:
        return <Info sx={{ color: '#2196f3' }} />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      default:
        return '#2196f3';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          Notificaciones y Alertas
        </Typography>
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            startIcon={<CheckCircle />}
            onClick={handleMarkAllRead}
          >
            Marcar todas como leídas
          </Button>
        )}
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, value) => setTabValue(value)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            label={
              <Badge badgeContent={unreadCount} color="error">
                No Leídas
              </Badge>
            }
          />
          <Tab label="Críticas y Advertencias" />
          <Tab label="Todas" />
        </Tabs>
      </Paper>

      {filteredAlerts.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay alertas {tabValue === 0 ? 'sin leer' : 'en esta categoría'}
          </Typography>
        </Paper>
      ) : (
        <List>
          {filteredAlerts.map((alert) => (
            <Paper
              key={alert.id}
              sx={{
                mb: 2,
                border: '1px solid #e0e0e0',
                borderLeft: `4px solid ${getAlertColor(alert.type)}`,
                bgcolor: alert.read ? 'transparent' : '#f9f9f9',
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: 2
                }
              }}
            >
              <ListItem
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {!alert.read && (
                      <IconButton
                        edge="end"
                        onClick={() => handleMarkRead(alert.id)}
                        title="Marcar como leída"
                      >
                        <CheckCircle />
                      </IconButton>
                    )}
                    <IconButton
                      edge="end"
                      onClick={() => handleDismiss(alert.id)}
                      title="Descartar"
                    >
                      <Close />
                    </IconButton>
                  </Box>
                }
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%', pr: 10 }}>
                  <Box sx={{ mt: 1 }}>
                    {getAlertIcon(alert.type)}
                  </Box>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography fontWeight="bold" variant="body1">
                          {alert.title}
                        </Typography>
                        {!alert.read && (
                          <Chip label="Nueva" size="small" color="primary" />
                        )}
                        <Chip
                          label={alert.type === 'error' ? 'Urgente' : alert.type === 'warning' ? 'Advertencia' : 'Info'}
                          size="small"
                          color={alert.type === 'error' ? 'error' : alert.type === 'warning' ? 'warning' : 'info'}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.primary">
                          {alert.description}
                        </Typography>
                        {alert.student && (
                          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            {alert.type === 'error' ? (
                              <TrendingDown sx={{ fontSize: 16, color: '#f44336' }} />
                            ) : (
                              <AssignmentLate sx={{ fontSize: 16, color: '#ff9800' }} />
                            )}
                            <Typography variant="caption" fontWeight="medium">
                              {alert.student}
                            </Typography>
                          </Box>
                        )}
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          {alert.time}
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
}