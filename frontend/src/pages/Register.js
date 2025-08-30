import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerApi } from '../api/auth';

export default function Register() {
  const { login } = useAuth();
  const [name, setName] = useState('');
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
      const res = await registerApi(name, email, password);
      if (res.success) {
        login(res.token, res.user);
        navigate('/dashboard');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 350, borderRadius: 3 }}>
        <Typography variant="h5" mb={2} fontWeight={700}>Create your Vaultix account</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            type="text"
            fullWidth
            margin="normal"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
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
            helperText="At least 6 characters"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <Typography variant="body2" mt={2} textAlign="center">
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
}