import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../api/auth';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      if (res.success) {
        login(res.token, res.user);
        navigate('/dashboard');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 350, borderRadius: 3 }}>
        <Typography variant="h5" mb={2} fontWeight={700}>Login to Vaultix</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <Typography variant="body2" mt={2} textAlign="center">
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>
      </Paper>
    </Box>
  );
}