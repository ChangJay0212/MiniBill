
import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { logout, isAuthenticated, permissionLevel } = useAuth();

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to MiniBill!
        </Typography>
        {isAuthenticated ? (
          <>
            <Typography variant="h6" component="h2" gutterBottom>
              You are logged in!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Your permission level: {permissionLevel}
            </Typography>
            <Button variant="contained" color="secondary" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <Typography variant="h6" component="h2" gutterBottom>
            Please log in to continue.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
