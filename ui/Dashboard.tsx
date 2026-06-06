import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, MenuItem, Select, FormControl, InputLabel, Button } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download as DownloadIcon } from '@mui/icons-material';

const riskData = [
  { name: 'Sin Riesgo', value: 1250, color: '#22C55E' },
  { name: 'Riesgo Medio', value: 430, color: '#EAB308' },
  { name: 'Riesgo Crítico', value: 120, color: '#EF4444' },
];

const performanceByCareer = [
  { name: 'Ingeniería', verde: 400, amarillo: 150, rojo: 50 },
  { name: 'Negocios', verde: 350, amarillo: 100, rojo: 30 },
  { name: 'Diseño', verde: 300, amarillo: 80, rojo: 20 },
  { name: 'Salud', verde: 200, amarillo: 100, rojo: 20 },
];

export function Dashboard() {
  const [careerFilter, setCareerFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          Dashboard Institucional
        </Typography>
        
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'white' }}>
            <InputLabel>Carrera</InputLabel>
            <Select value={careerFilter} label="Carrera" onChange={(e) => setCareerFilter(e.target.value as string)}>
              <MenuItem value="all">Todas las carreras</MenuItem>
              <MenuItem value="ing">Ingeniería</MenuItem>
              <MenuItem value="neg">Negocios</MenuItem>
              <MenuItem value="dis">Diseño</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'white' }}>
            <InputLabel>Grupo</InputLabel>
            <Select value={groupFilter} label="Grupo" onChange={(e) => setGroupFilter(e.target.value as string)}>
              <MenuItem value="all">Todos los grupos</MenuItem>
              <MenuItem value="a">Grupo A</MenuItem>
              <MenuItem value="b">Grupo B</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Estudiantes</Typography>
              <Typography variant="h3" fontWeight="bold">1,800</Typography>
            </CardContent>
          </Card>
        </Grid>
        {riskData.map((risk) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={risk.name}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderBottom: 4, borderBottomColor: risk.color, height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>{risk.name}</Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ color: risk.color }}>{risk.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Distribución Global</Typography>
                <Button size="small" startIcon={<DownloadIcon />} color="inherit">Exportar</Button>
              </Box>
              <Box sx={{ width: '100%', height: 300, minHeight: 300, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`pie-cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Niveles de Riesgo por Carrera</Typography>
                <Button size="small" startIcon={<DownloadIcon />} color="inherit">Exportar</Button>
              </Box>
              <Box sx={{ width: '100%', height: 300, minHeight: 300, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceByCareer} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="verde" name="Sin Riesgo" stackId="a" fill="#22C55E" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="amarillo" name="Riesgo Medio" stackId="a" fill="#EAB308" />
                    <Bar dataKey="rojo" name="Riesgo Crítico" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}