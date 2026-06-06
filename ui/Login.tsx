import React from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router';

export function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('jwt_token', 'mock_token');
    navigate('/');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#f1f5f9'
    }}>
      <Card sx={{ maxWidth: 400, width: '100%', p: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="center" mb={3}>
            <Box sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: '#1A365D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h4" color="white" fontWeight="bold">R</Typography>
            </Box>
          </Box>
          <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
            Iniciar Sesión
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" mb={4}>
            Ingresa al sistema RCM
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField 
              fullWidth 
              label="Correo Institucional" 
              variant="outlined" 
              margin="normal"
              defaultValue="docente@escuela.edu"
            />
            <TextField 
              fullWidth 
              label="Contraseña" 
              type="password" 
              variant="outlined" 
              margin="normal"
              defaultValue="password123"
            />
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              color="primary" 
              size="large" 
              sx={{ mt: 3, mb: 2 }}
            >
              Ingresar al Sistema
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}