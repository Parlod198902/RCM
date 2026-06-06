import React from 'react';
import { RouterProvider } from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { router } from './routes';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {React.createElement(ThemeProvider, { theme },
        <>
          <CssBaseline />
          <RouterProvider router={router} />
        </>
      )}
    </div>
  );
}