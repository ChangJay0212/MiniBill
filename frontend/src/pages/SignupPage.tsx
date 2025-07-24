
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiSignup } from '../services/api';
import {
    Container, Box, TextField, Button, Typography, Alert,
    CssBaseline, Avatar, Paper
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

const SignupPage: React.FC = () => {
    const [account, setAccount] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            const userData = { account, name, email, password };
            const data = await apiSignup(userData);
            if (data.message) {
                setSuccess(data.message);
                // Optionally, redirect to login after a short delay
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError('Signup failed: No message received.');
            }
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Paper elevation={6} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <PersonAddOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="account"
                            label="Account"
                            name="account"
                            autoComplete="username"
                            autoFocus
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Box textAlign="center">
                            <Link to="/login">
                                {"Already have an account? Sign In"}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default SignupPage;
