import React, { useState } from 'react';
import { Box, Button, Typography, LinearProgress, Alert } from '@mui/material';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
    setError('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }
    // TODO: Integrate with backend API and update progress
  };

  return (
    <Box maxWidth={500} mx="auto" mt={6} p={3} boxShadow={3} borderRadius={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>Upload File</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        sx={{
          border: '2px dashed #1976d2',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          mb: 2,
          bgcolor: '#f9f9f9',
          cursor: 'pointer',
        }}
      >
        <input
          type="file"
          style={{ display: 'none' }}
          id="file-upload"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
          {file ? file.name : 'Drag and drop a file here, or click to select'}
        </label>
      </Box>
      {progress > 0 && <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />}
      <Button variant="contained" color="primary" fullWidth onClick={handleUpload}>
        Upload
      </Button>
    </Box>
  );
}