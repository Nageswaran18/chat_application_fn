import React, { useState, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import config from '../config/config.json';
import { TextField, Button, Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { Google as GoogleIcon, Facebook as FacebookIcon } from '@mui/icons-material';
import { GoogleLogin } from '@react-oauth/google'; 

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.API_BASE_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { access, refresh } = data;

        sessionStorage.setItem('access_token', access);
        sessionStorage.setItem('refresh_token', refresh);

        const decoded = jwtDecode(access);
        setUser({ id: decoded.user_id, role: decoded.role });

        navigate('/home');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // const handleGoogleloginClick = () => {
  //   window.location.href = `${config.API_BASE_URL}/accounts/google/login/`;
  // };



  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const credential = credentialResponse.credential;
      console.log("Google credential:", credential);
  
      // Send credential token to backend
      const response = await fetch(`${config.API_BASE_URL}/google-login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credential }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const { access, refresh, user } = data;
  
        sessionStorage.setItem('access_token', access);
        sessionStorage.setItem('refresh_token', refresh);
  
        setUser({ id: user.id, email: user.email, name: user.name });
  
        navigate('/home');
      } else {
        console.error('Google login backend error');
      }
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google login failed:', error);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ width: 400, padding: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Login
            </Button>
          </form>

          <Divider sx={{ my: 2 }}>OR</Divider>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            width="100%"
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<FacebookIcon />}
          >
            Login with Facebook
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
