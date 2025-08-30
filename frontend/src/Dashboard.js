import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Dashboard() {
  // Placeholder data
  const files = [
    { id: 1, name: 'example1.pdf', url: '#' },
    { id: 2, name: 'example2.jpg', url: '#' },
  ];

  return (
    <Box maxWidth={600} mx="auto" mt={6} p={3} boxShadow={3} borderRadius={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>Your Files</Typography>
      <Paper>
        <List>
          {files.map(file => (
            <ListItem
              key={file.id}
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="download" href={file.url}>
                    <DownloadIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}