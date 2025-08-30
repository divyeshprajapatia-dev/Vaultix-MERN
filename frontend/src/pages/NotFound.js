import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h3" color="primary" mb={2}>404</Typography>
      <Typography variant="h6" mb={3}>Page Not Found</Typography>
      <Button component={Link} to="/" variant="contained">Go Home</Button>
    </Box>
  );
}