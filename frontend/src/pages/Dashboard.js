import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, IconButton, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Snackbar, Container, Grid, Card, CardContent, CardActions, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useAuth } from '../context/AuthContext';
import { listFilesApi, deleteFileApi } from '../api/files';

export default function Dashboard() {
  const { token } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [shareDialog, setShareDialog] = useState({ open: false, link: '' });
  const [snackbar, setSnackbar] = useState('');

  const fetchFiles = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await listFilesApi(token);
      if (res.success) setFiles(res.files);
      else setError(res.message || 'Failed to load files');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFiles(); /* eslint-disable-next-line */ }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteFileApi(id, token);
      setFiles(files.filter(f => f._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const handleShare = (ipfsUrl) => {
    setShareDialog({ open: true, link: ipfsUrl });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbar('Link copied to clipboard!');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" mb={4} fontWeight={900} textAlign="center">Your Files</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : files.length === 0 ? (
        <Alert severity="info">No files uploaded yet.</Alert>
      ) : (
        <Grid container spacing={4}>
          {files.map(file => (
            <Grid item xs={12} sm={6} md={4} key={file._id}>
              <Card elevation={4} sx={{ borderRadius: 4 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom noWrap>{file.originalName}</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Size: {file.formattedSize || file.fileSize}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
                  <Tooltip title="Download">
                    <IconButton href={file.publicUrl} target="_blank" rel="noopener">
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Get Shareable Link">
                    <IconButton color="primary" onClick={() => handleShare(file.publicUrl)}>
                      <LinkIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <span>
                      <IconButton color="error" onClick={() => handleDelete(file._id)} disabled={deleting === file._id}>
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={shareDialog.open} onClose={() => setShareDialog({ open: false, link: '' })}>
        <DialogTitle>Shareable Link</DialogTitle>
        <DialogContent>
          <TextField
            label="Shareable Link"
            value={shareDialog.link}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => handleCopy(shareDialog.link)}><ContentCopyIcon /></IconButton>
              )
            }}
            InputLabelProps={{ shrink: true }}
            readOnly
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog({ open: false, link: '' })}>Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!snackbar}
        autoHideDuration={2500}
        onClose={() => setSnackbar('')}
        message={snackbar}
      />
    </Container>
  );
}