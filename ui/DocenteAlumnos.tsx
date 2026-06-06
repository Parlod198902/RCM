import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Visibility,
  Download,
  Search,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import { StatusBadge } from './StatusBadge';

const studentsData = [
  {
    id: 1,
    nombre: 'Ana Patricia Martínez López',
    matricula: 'A00123456',
    carrera: 'Ing. Sistemas',
    grupo: '6A',
    participacion: 95,
    tareas: 18,
    totalTareas: 20,
    status: 'active' as const,
    trend: 'up'
  },
  {
    id: 2,
    nombre: 'Carlos Eduardo Rodríguez Sánchez',
    matricula: 'A00123457',
    carrera: 'Ing. Sistemas',
    grupo: '6A',
    participacion: 45,
    tareas: 8,
    totalTareas: 20,
    status: 'critical' as const,
    trend: 'down'
  },
  {
    id: 3,
    nombre: 'María Fernanda García Torres',
    matricula: 'A00123458',
    carrera: 'Ing. Sistemas',
    grupo: '6A',
    participacion: 72,
    tareas: 14,
    totalTareas: 20,
    status: 'warning' as const,
    trend: 'down'
  },
  {
    id: 4,
    nombre: 'José Luis Hernández Pérez',
    matricula: 'A00123459',
    carrera: 'Ing. Sistemas',
    grupo: '6A',
    participacion: 88,
    tareas: 17,
    totalTareas: 20,
    status: 'active' as const,
    trend: 'up'
  },
  {
    id: 5,
    nombre: 'Laura Gabriela Ramírez Cruz',
    matricula: 'A00123460',
    carrera: 'Ing. Sistemas',
    grupo: '6A',
    participacion: 68,
    tareas: 13,
    totalTareas: 20,
    status: 'warning' as const,
    trend: 'down'
  },
  {
    id: 6,
    nombre: 'Diego Alejandro Flores Méndez',
    matricula: 'A00123461',
    carrera: 'Ing. Sistemas',
    grupo: '6A',
    participacion: 92,
    tareas: 19,
    totalTareas: 20,
    status: 'active' as const,
    trend: 'up'
  },
  {
    id: 7,
    nombre: 'Sofía Isabel Morales Reyes',
    matricula: 'A00123462',
    carrera: 'Ing. Sistemas',
    grupo: '6A',
    participacion: 58,
    tareas: 11,
    totalTareas: 20,
    status: 'warning' as const,
    trend: 'down'
  },
  {
    id: 8,
    nombre: 'Miguel Ángel Castillo Vargas',
    matricula: 'A00123463',
    carrera: 'Ing. Sistemas',
    grupo: '6A',
    participacion: 38,
    tareas: 6,
    totalTareas: 20,
    status: 'critical' as const,
    trend: 'down'
  }
];

export function DocenteAlumnos() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredStudents = studentsData.filter(student =>
    student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.matricula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateReport = () => {
    alert('Generando reporte en Excel... Esta funcionalidad exportaría los datos a un archivo Excel.');
  };

  const statusCounts = {
    active: studentsData.filter(s => s.status === 'active').length,
    warning: studentsData.filter(s => s.status === 'warning').length,
    critical: studentsData.filter(s => s.status === 'critical').length
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">Mis Alumnos - Grupo 6A</Typography>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleGenerateReport}
          sx={{ bgcolor: '#1976d2' }}
        >
          Generar Reporte Excel/PDF
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Paper sx={{ p: 2, flex: 1, minWidth: 200, borderLeft: '4px solid #4caf50' }}>
          <Typography variant="body2" color="text.secondary">Estudiantes Activos</Typography>
          <Typography variant="h4" fontWeight="bold" color="#4caf50">{statusCounts.active}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, minWidth: 200, borderLeft: '4px solid #ff9800' }}>
          <Typography variant="body2" color="text.secondary">En Riesgo</Typography>
          <Typography variant="h4" fontWeight="bold" color="#ff9800">{statusCounts.warning}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, minWidth: 200, borderLeft: '4px solid #f44336' }}>
          <Typography variant="body2" color="text.secondary">Estado Crítico</Typography>
          <Typography variant="h4" fontWeight="bold" color="#f44336">{statusCounts.critical}</Typography>
        </Paper>
      </Box>

      {/* Search and Filter */}
      <Paper sx={{ p: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nombre o matrícula..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell><strong>Matrícula</strong></TableCell>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell align="center"><strong>Estado</strong></TableCell>
                <TableCell align="center"><strong>Participación</strong></TableCell>
                <TableCell align="center"><strong>Tareas Completadas</strong></TableCell>
                <TableCell align="center"><strong>Tendencia</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow
                  key={student.id}
                  sx={{
                    '&:hover': { bgcolor: '#f9f9f9' },
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/docente/alumno/${student.id}`)}
                >
                  <TableCell>{student.matricula}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">{student.nombre}</Typography>
                    <Typography variant="caption" color="text.secondary">{student.carrera}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <StatusBadge status={student.status} />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ minWidth: 120 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight="bold">{student.participacion}%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={student.participacion}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: student.status === 'active' ? '#4caf50' :
                                     student.status === 'warning' ? '#ff9800' : '#f44336'
                          }
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${student.tareas}/${student.totalTareas}`}
                      size="small"
                      sx={{ minWidth: 60 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {student.trend === 'up' ? (
                      <TrendingUp sx={{ color: '#4caf50' }} />
                    ) : (
                      <TrendingDown sx={{ color: '#f44336' }} />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/docente/alumno/${student.id}`);
                      }}
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredStudents.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">No se encontraron estudiantes</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
