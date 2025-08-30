import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Alert, Avatar, Grid, Divider, Stack } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Profile() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Demo stats (replace with real data if available)
  const totalFiles = user?.totalFilesUploaded || 0;
  const totalStorage = user?.totalStorageUsed ? `${(user.totalStorageUsed / (1024 * 1024)).toFixed(2)} MB` : '0 MB';

  const handleSave = (e) => {
    e.preventDefault();
    setSuccess('Profile updated! (Demo only)');
    setError('');
    // TODO: Integrate with backend API for real update
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3 }}>
      <Paper sx={{ p: 4, borderRadius: 4 }} elevation={4}>
        <Stack direction="row" spacing={3} alignItems="center" mb={3}>
          <Avatar sx={{ width: 72, height: 72, fontSize: 36, bgcolor: 'primary.main' }}>
            {user?.name ? user.name[0].toUpperCase() : '?'}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700}>{user?.name}</Typography>
            <Typography color="text.secondary">{user?.email}</Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</Typography>
          </Box>
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">Total Files</Typography>
            <Typography variant="h6" fontWeight={700}>{totalFiles}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">Storage Used</Typography>
            <Typography variant="h6" fontWeight={700}>{totalStorage}</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSave}>
          <TextField
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={email}
            fullWidth
            margin="normal"
            disabled
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} fullWidth>
            Save Changes
          </Button>
        </form>
        <Divider sx={{ my: 3 }} />
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" color="primary" startIcon={<LockIcon />} disabled>
            Change Password
          </Button>
          <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={logout}>
            Logout
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}