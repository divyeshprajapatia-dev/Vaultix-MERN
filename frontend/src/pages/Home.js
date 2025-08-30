import React from 'react';
import { Box, Typography, Button, Grid, Paper, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SecurityIcon from '@mui/icons-material/Security';
import LinkIcon from '@mui/icons-material/Link';
import StorageIcon from '@mui/icons-material/Storage';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" fontWeight={900} color="primary.main" mb={2}>
          Vaultix
        </Typography>
        <Typography variant="h5" color="text.secondary" mb={4}>
          Decentralized, Secure File Storage with Pinata & IPFS
        </Typography>
        <Button
          component={Link}
          to={user ? "/dashboard" : "/register"}
          variant="contained"
          size="large"
          sx={{ px: 5, py: 1.5, fontSize: 20, borderRadius: 3, boxShadow: 2 }}
        >
          {user ? "Go to Dashboard" : "Get Started"}
        </Button>
      </Box>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={3}>
          <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
            <CloudUploadIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" fontWeight={700} mb={1}>Easy Uploads</Typography>
            <Typography color="text.secondary">Drag-and-drop or click to upload files instantly to IPFS.</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
            <SecurityIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" fontWeight={700} mb={1}>Privacy & Security</Typography>
            <Typography color="text.secondary">Your files are encrypted and only accessible by you.</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
            <LinkIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" fontWeight={700} mb={1}>Shareable Links</Typography>
            <Typography color="text.secondary">Share files with anyone using secure, unique links.</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
            <StorageIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" fontWeight={700} mb={1}>Decentralized Storage</Typography>
            <Typography color="text.secondary">Files are stored on IPFS, not on a single server.</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}