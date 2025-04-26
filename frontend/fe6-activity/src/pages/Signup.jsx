import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const base_url = import.meta.env.VITE_API_BASE_URL;

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleNext = async (e) => {
    e.preventDefault();
    // Validate 10 characters before @vnrvjiet.in
    const emailRegex = /^[a-zA-Z0-9]{10}@vnrvjiet\.in$/;
    
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setError('Email must belong to clg domain');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${base_url}/api/auth/signup`, {
        username: formData.email.split('@')[0],
        email: formData.email,
        password: formData.password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.error || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        backgroundColor: 'background.default'
      }}
    >
      <Container maxWidth="md">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleNext} sx={{ width: '100%' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Create Account
            </Typography>

            <TextField
              label="Email"
              fullWidth
              margin="normal"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <TextField
              label="Password"
              fullWidth
              margin="normal"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            
            <TextField
              label="Confirm Password"
              fullWidth
              margin="normal"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Link href="/login" variant="body2">
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup; 