import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, Avatar, Stack } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinkIcon from '@mui/icons-material/Link';
import StorageIcon from '@mui/icons-material/Storage';
import GroupIcon from '@mui/icons-material/Group';

export default function About() {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 6, p: 3 }}>
      <Paper sx={{ p: 4, borderRadius: 4, mb: 4 }} elevation={4}>
        <Typography variant="h4" mb={2} fontWeight={900} color="primary.main">About Vaultix</Typography>
        <Typography variant="body1" mb={2}>
          <b>Vaultix</b> is a next-generation decentralized file storage platform. Our mission is to empower users with secure, private, and censorship-resistant file storage using the power of IPFS and Pinata. Vaultix is designed for privacy-focused individuals, teams, and organizations who want to take control of their data.
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon><SecurityIcon color="primary" /></ListItemIcon>
            <ListItemText primary="End-to-end encrypted, private file storage" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CloudUploadIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Easy drag-and-drop uploads to IPFS" />
          </ListItem>
          <ListItem>
            <ListItemIcon><LinkIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Shareable links for every file" />
          </ListItem>
          <ListItem>
            <ListItemIcon><StorageIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Powered by Pinata and decentralized web" />
          </ListItem>
        </List>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" mb={1} fontWeight={700}>Our Technology</Typography>
        <Typography variant="body2" mb={2}>
          Vaultix leverages <b>IPFS</b> (InterPlanetary File System) for decentralized storage and <b>Pinata</b> for reliable pinning and fast access. Your files are encrypted and distributed across a global network, making them secure, resilient, and always available.
        </Typography>
        <Typography variant="h6" mb={1} fontWeight={700}>Meet the Team</Typography>
        <Stack direction="row" spacing={4} alignItems="center" mt={2}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>D</Avatar>
          <Box>
            <Typography fontWeight={700}>Divyesh Prajapatia</Typography>
            <Typography variant="body2" color="text.secondary">Founder & Full Stack Developer</Typography>
          </Box>
        </Stack>
      </Paper>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        &copy; {new Date().getFullYear()} Vaultix. All rights reserved.
      </Typography>
    </Box>
  );
}