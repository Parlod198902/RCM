import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Divider, Avatar, Skeleton, Chip } from '@mui/material';
import { Email, Badge, School } from '@mui/icons-material';

export function Profile() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ nombre: string, matricula: string, correo: string, rol: string } | null>(null);

  useEffect(() => {
    // Simulando una llamada al backend (GET /api/profile)
    const fetchProfile = async () => {
      setLoading(true);
      setTimeout(() => {
        setUser({
          nombre: "Elena Martínez",
          matricula: "DOC-8492",
          correo: "elena.martinez@institucion.edu",
          rol: "Docente"
        });
        setLoading(false);
      }, 800);
    };

    fetchProfile();
  }, []);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Mi Perfil
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Información general de solo lectura extraída de la base de datos de la institución.
      </Typography>

      <Card>
        <CardContent sx={{ p: 4 }}>
          {loading ? (
            <Box>
              <Box display="flex" alignItems="center" gap={3} mb={4}>
                <Skeleton variant="circular" width={80} height={80} />
                <Box>
                  <Skeleton variant="text" width={200} height={40} />
                  <Skeleton variant="text" width={120} height={24} />
                </Box>
              </Box>
              <Divider sx={{ my: 3 }} />
              <Grid container spacing={3}>
                {[1, 2, 3].map(i => (
                  <Grid size={{ xs: 12, sm: 6 }} key={i}>
                    <Skeleton variant="text" width={100} />
                    <Skeleton variant="text" width={180} height={32} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : user ? (
            <Box>
              <Box display="flex" alignItems="center" gap={3} mb={4}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32 }}>
                  {user.nombre.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">{user.nombre}</Typography>
                  <Chip 
                    label={user.rol} 
                    color="primary" 
                    size="small" 
                    sx={{ mt: 1, fontWeight: 'bold' }} 
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                    <Badge color="action" />
                    <Typography variant="body2" color="text.secondary">Matrícula / ID</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium" sx={{ pl: 4 }}>
                    {user.matricula}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                    <Email color="action" />
                    <Typography variant="body2" color="text.secondary">Correo Institucional</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium" sx={{ pl: 4 }}>
                    {user.correo}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                    <School color="action" />
                    <Typography variant="body2" color="text.secondary">Rol en Sistema RCM</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium" sx={{ pl: 4 }}>
                    {user.rol}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Typography color="error">Error cargando información de perfil.</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}