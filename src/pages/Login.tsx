import React, { useState } from 'react';
import { 
  Button, 
  TextField, 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Alert 
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }

    try {
      const response = await axios.post('https://reqres.in/api/login', {
        email,
        password
      });

      if (response.data.token) {
        sessionStorage.setItem('authToken', response.data.token); 
        navigate('/userlist');
      }
    } catch (err) {
        setError('Invalid credentials. Please try again.');
        console.error('Login error:', err);
      }
  };

  return (
    <Container 
      component="main" 
      maxWidth="xs" 
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
      }}
    >
      <Paper 
        elevation={6} 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: 4 
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box 
          component="form" 
          onSubmit={handleLogin} 
          sx={{ width: '100%', mt: 1 }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;


 