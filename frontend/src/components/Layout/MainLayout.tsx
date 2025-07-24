import React from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Menu, MenuItem 
} from '@mui/material';
import { 
  Receipt, People, Security, Home, 
  AddBusiness, Assignment, Logout 
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated, logout, permissionLevel } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            💰 MiniBill
          </Typography>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            startIcon={<Home />}
            sx={{ mx: 0.5 }}
          >
            Home
          </Button>
          {isAuthenticated && (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/my-transactions"
                startIcon={<Receipt />}
                sx={{ mx: 0.5 }}
              >
                My Transactions
              </Button>
              {permissionLevel === 99 && (
                <>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/admin/transactions"
                    startIcon={<Assignment />}
                    sx={{ mx: 0.5 }}
                  >
                    All Transactions
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/admin/transaction-management"
                    startIcon={<AddBusiness />}
                    sx={{ mx: 0.5 }}
                  >
                    Transaction Management
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/admin/users"
                    startIcon={<People />}
                    sx={{ mx: 0.5 }}
                  >
                    Users
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/admin/permissions"
                    startIcon={<Security />}
                    sx={{ mx: 0.5 }}
                  >
                    Permissions
                  </Button>
                </>
              )}
              <Button 
                color="inherit" 
                onClick={handleLogout}
                startIcon={<Logout />}
                sx={{ mx: 0.5 }}
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default MainLayout;