import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user') != null) {
      navigate('/home', { state: { user: localStorage.getItem('user') } });
    }
  }, []);

  return (
    <Box 
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}
    >
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ maxWidth: 400, p: 3, borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Welcome to My App
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
              Sign in with Google to continue
            </Typography>

            <GoogleLogin
              onSuccess={(res) => {
                const decoded = jwtDecode(res.credential);
                localStorage.setItem('user', res.credential);
                navigate('/home', { state: { user: decoded } });
              }}
            />

          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}

export default Login;
