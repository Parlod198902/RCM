import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  Chip, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import { useSearchParams } from 'react-router';
import { StudentDrawer } from './StudentDrawer';
import { Download as DownloadIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

export function MisAlumnos() {
  const [searchParams, setSearchParams] = useSearchParams();

  const students = [
    { id: 1, name: "Ana Silva", matricula: "A01123456", status: "verde", score: 92, participation: "Alta" },
    { id: 2, name: "Carlos Ruiz", matricula: "A01123457", status: "amarillo", score: 75, participation: "Media" },
    { id: 3, name: "Miguel López", matricula: "A01123458", status: "rojo", score: 58, participation: "Baja" },
    { id: 4, name: "Lucía Gómez", matricula: "A01123459", status: "verde", score: 88, participation: "Alta" },
    { id: 5, name: "Jorge Martínez", matricula: "A01123460", status: "amarillo", score: 71, participation: "Media" },
  ];

  const handleRowClick = (id: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('studentId', id.toString());
    setSearchParams(newParams);
  };

  const getColor = (status: string) => {
    switch (status) {
      case 'verde': return 'success.main';
      case 'amarillo': return 'warning.main';
      case 'rojo': return 'error.main';
      default: return 'grey.500';
    }
  };

  const getLabel = (status: string) => {
    switch (status) {
      case 'verde': return 'Sin Riesgo';
      case 'amarillo': return 'Riesgo Medio';
      case 'rojo': return 'Riesgo Crítico';
      default: return 'Desconocido';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          Mis Alumnos
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<DownloadIcon />}
          disableElevation
          sx={{ borderRadius: 2 }}
        >
          Generar Reporte Excel
        </Button>
      </Box>
      
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Matrícula</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nombre del Alumno</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nivel de Riesgo</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Participación</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Rendimiento</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow 
                  key={student.id} 
                  hover 
                  sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                  onClick={() => handleRowClick(student.id)}
                >
                  <TableCell>{student.matricula}</TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{student.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getLabel(student.status)} 
                      size="small" 
                      sx={{ 
                        bgcolor: getColor(student.status), 
                        color: student.status === 'amarillo' ? 'black' : 'white',
                        fontWeight: 'bold',
                        width: 120
                      }} 
                    />
                  </TableCell>
                  <TableCell>{student.participation}</TableCell>
                  <TableCell>{student.score}%</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary" onClick={(e) => { e.stopPropagation(); handleRowClick(student.id); }}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      
      <StudentDrawer />
    </Box>
  );
}