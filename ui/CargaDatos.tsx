import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Fade } from '@mui/material';
import { CloudUpload as CloudUploadIcon, Description as FileIcon } from '@mui/icons-material';

export function CargaDatos() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Box maxWidth="800px" mx="auto" pt={4}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary.main">
        Ingesta de Datos
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Carga los archivos Excel (.xlsx, .csv) con la actividad reciente de los estudiantes para actualizar el modelo predictivo de riesgo.
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 6,
          textAlign: 'center',
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: isDragging ? 'primary.main' : 'grey.300',
          bgcolor: isDragging ? 'primary.50' : 'grey.50',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          borderRadius: 3
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        component="label"
      >
        <input 
          type="file" 
          hidden 
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
          onChange={handleFileChange}
        />
        
        {!file ? (
          <Fade in>
            <Box>
              <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 1 }}>
                <CloudUploadIcon color="primary" fontSize="large" />
              </Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Arrastra y suelta tu archivo aquí
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                o haz clic para buscar en tu computadora (Máx. 10MB)
              </Typography>
              <Button variant="contained" color="primary" component="span" disableElevation sx={{ borderRadius: 2 }}>
                Seleccionar Archivo
              </Button>
            </Box>
          </Fade>
        ) : (
          <Fade in>
            <Box>
              <FileIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {file.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
              <Box display="flex" gap={2} justifyContent="center">
                <Button variant="outlined" color="inherit" onClick={(e) => { e.preventDefault(); setFile(null); }}>
                  Cancelar
                </Button>
                <Button variant="contained" color="primary" disableElevation>
                  Procesar Datos
                </Button>
              </Box>
            </Box>
          </Fade>
        )}
      </Paper>
    </Box>
  );
}