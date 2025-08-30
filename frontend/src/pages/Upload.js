import React, { useState } from 'react';
import { Box, Typography, Paper, Button, LinearProgress, Alert, TextField, Container, Stack, Avatar } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useAuth } from '../context/AuthContext';
import { uploadFileApi } from '../api/files';

export default function Upload() {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
    setError('');
    setSuccess('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    setProgress(0);
    try {
      const res = await uploadFileApi(file, description, token, (e) => {
        if (e.total) setProgress(Math.round((e.loaded * 100) / e.total));
      });
      if (res.success) {
        setSuccess('File uploaded successfully!');
        setFile(null);
        setDescription('');
        setProgress(0);
      } else {
        setError(res.message || 'Upload failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
            <CloudUploadIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={900} mb={0.5}>Upload File</Typography>
            <Typography color="text.secondary">Drag and drop your file below, or click to select.</Typography>
          </Box>
        </Stack>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          sx={{
            border: '2px dashed #3f51b5',
            borderRadius: 3,
            p: 4,
            textAlign: 'center',
            mb: 2,
            bgcolor: '#f9f9f9',
            cursor: 'pointer',
            minHeight: 120,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <input
            type="file"
            style={{ display: 'none' }}
            id="file-upload"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload" style={{ cursor: 'pointer', width: '100%' }}>
            {file ? (
              <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
                <InsertDriveFileIcon color="primary" />
                <Typography>{file.name}</Typography>
              </Stack>
            ) : (
              <Typography color="text.secondary">Drag and drop a file here, or <span style={{ color: '#3f51b5', textDecoration: 'underline' }}>click to select</span></Typography>
            )}
          </label>
        </Box>
        <TextField
          label="Description (optional)"
          fullWidth
          margin="normal"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        {progress > 0 && <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />}
        <Button variant="contained" color="primary" fullWidth onClick={handleUpload} disabled={loading} sx={{ py: 1.2, fontSize: 18 }}>
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
        <Box mt={4}>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>Supported file types: images, documents, videos, audio, archives, and more.</Typography>
          <Typography variant="subtitle2" color="text.secondary">Your files are encrypted and stored securely on IPFS via Pinata.</Typography>
        </Box>
      </Paper>
    </Container>
  );
}