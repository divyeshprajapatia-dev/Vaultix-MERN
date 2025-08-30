import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenu, setMobileMenu] = React.useState(false);
  const navigate = useNavigate();

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ color: '#fff', textDecoration: 'none', fontWeight: 700, letterSpacing: 1 }}
          >
            Vaultix
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/about">About</Button>
          {user && <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>}
          {user && <Button color="inherit" component={Link} to="/upload">Upload</Button>}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/profile">Profile</Button>
              <IconButton onClick={handleMenu} color="inherit" sx={{ ml: 1 }}>
                <Avatar>{user.name ? user.name[0].toUpperCase() : '?'}</Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem disabled>{user.name}</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Box>
        {/* Mobile menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton color="inherit" onClick={() => setMobileMenu(!mobileMenu)}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={null} open={mobileMenu} onClose={() => setMobileMenu(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem component={Link} to="/" onClick={() => setMobileMenu(false)}>Home</MenuItem>
            <MenuItem component={Link} to="/about" onClick={() => setMobileMenu(false)}>About</MenuItem>
            {user && <MenuItem component={Link} to="/dashboard" onClick={() => setMobileMenu(false)}>Dashboard</MenuItem>}
            {user && <MenuItem component={Link} to="/upload" onClick={() => setMobileMenu(false)}>Upload</MenuItem>}
            {user && <MenuItem component={Link} to="/profile" onClick={() => setMobileMenu(false)}>Profile</MenuItem>}
            {!user && <MenuItem component={Link} to="/login" onClick={() => setMobileMenu(false)}>Login</MenuItem>}
            {!user && <MenuItem component={Link} to="/register" onClick={() => setMobileMenu(false)}>Register</MenuItem>}
            {user && <MenuItem onClick={handleLogout}>Logout</MenuItem>}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}