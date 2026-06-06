import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, useSearchParams } from 'react-router';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Badge,
  Popover,
  Button
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Settings as SettingsIcon, 
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  WarningAmber as WarningIcon,
  UploadFile as UploadFileIcon
} from '@mui/icons-material';

const drawerWidth = 240;

export function Layout() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notiAnchorEl, setNotiAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotiClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotiAnchorEl(event.currentTarget);
  };

  const handleNotiClose = () => {
    setNotiAnchorEl(null);
  };

  const handleAlertClick = (studentId: number) => {
    handleNotiClose();
    if (location.pathname !== '/' && location.pathname !== '/docente/alumnos') {
      navigate(`/?studentId=${studentId}`);
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('studentId', studentId.toString());
      setSearchParams(newParams);
    }
  };

  const navigateTo = (path: string) => {
    navigate(path);
    handleClose();
    setMobileOpen(false);
  };

  const handleLogout = () => {
    // Simulando limpieza de sesión
    localStorage.removeItem('jwt_token');
    navigate('/login');
    handleClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: 'Dashboard Directivos', path: '/', icon: <DashboardIcon /> },
    { label: 'Mis Alumnos', path: '/docente/alumnos', icon: <PersonIcon /> },
    { label: 'Carga de Datos', path: '/ingesta', icon: <UploadFileIcon /> },
  ];

  const alerts = [
    { id: 3, student: 'Miguel López', score: 58, status: 'Rojo', color: '#EF4444' },
    { id: 2, student: 'Carlos Ruiz', score: 75, status: 'Amarillo', color: '#EAB308' }
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
          RCM Institucional
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton 
              selected={location.pathname === item.path}
              onClick={() => navigateTo(item.path)}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="subtitle1" color="white" fontWeight="bold">R</Typography>
              </Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
                RCM - Sistema de Monitoreo
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <IconButton color="inherit" onClick={handleNotiClick}>
              <Badge badgeContent={alerts.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Popover
              open={Boolean(notiAnchorEl)}
              anchorEl={notiAnchorEl}
              onClose={handleNotiClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{ sx: { width: 340, mt: 1.5, borderRadius: 2 } }}
            >
              <Box p={2} borderBottom="1px solid" borderColor="divider">
                <Typography variant="subtitle1" fontWeight="bold">Alertas Tempranas</Typography>
              </Box>
              <List sx={{ p: 0 }}>
                {alerts.map((alert, index) => (
                  <React.Fragment key={alert.id}>
                    <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', p: 2 }}>
                      <Box display="flex" gap={1.5} mb={1}>
                        <WarningIcon sx={{ color: alert.color, mt: 0.5 }} fontSize="small" />
                        <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                          <strong>⚠️ Atención:</strong> El alumno <strong>{alert.student}</strong> ha bajado su rendimiento global al {alert.score}%. Nivel de riesgo actualizado a <strong style={{ color: alert.color }}>{alert.status}</strong>.
                        </Typography>
                      </Box>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        color="inherit" 
                        sx={{ ml: 4, mt: 1, textTransform: 'none', borderRadius: 4, fontSize: '0.75rem' }}
                        onClick={() => handleAlertClick(alert.id)}
                      >
                        Ver perfil
                      </Button>
                    </ListItem>
                    {index < alerts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Popover>

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              sx={{ ml: 1 }}
            >
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>EM</Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                elevation: 3,
                sx: { mt: 1.5, minWidth: 200, borderRadius: 2 }
              }}
            >
              <Box sx={{ px: 2, py: 1.5, mb: 1, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle1" fontWeight="bold">Elena Martínez</Typography>
                <Typography variant="body2" color="text.secondary">Docente</Typography>
              </Box>
              
              <MenuItem onClick={() => navigateTo('/profile')}>
                <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                Mi Perfil
              </MenuItem>
              <MenuItem onClick={() => navigateTo('/settings')}>
                <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                Configuración
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px dashed rgba(145, 158, 171, 0.24)' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: '100vh'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}