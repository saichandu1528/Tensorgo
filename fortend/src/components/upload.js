import { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function Upload() {
  const [invoice, setInvoice] = useState({name:'', amount: '', dueDate: '', recipientEmail: '', userId: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('user');
    if (!token) return navigate('/login');

    const decoded = jwtDecode(token);
    setInvoice((prev) => ({ ...prev, userId: decoded.sub }));
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/invoices', { ...invoice, status: 'pending' });
      navigate('/'); 
    } catch (error) {
      console.error('Error adding invoice:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.8 }}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1f4037 0%, #99f2c8 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3, background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', color: '#fff' }}>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Add Invoice
          </Typography>
          <form onSubmit={handleSubmit}>
          <TextField
              label="Invoice name"
              fullWidth
              type="string"
              variant="outlined"
              sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' } }}
              onChange={(e) => setInvoice({ ...invoice, name: e.target.value })}
              required
            />
            <TextField
              label="Amount"
              fullWidth
              type="number"
              variant="outlined"
              sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' } }}
              onChange={(e) => setInvoice({ ...invoice, amount: e.target.value })}
              required
            />
            <TextField
              label="Due Date"
              fullWidth
              type="date"
              variant="outlined"
              sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' } }}
              onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Recipient Email"
              fullWidth
              type="email"
              variant="outlined"
              sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' } }}
              onChange={(e) => setInvoice({ ...invoice, recipientEmail: e.target.value })}
              required
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, background: '#ff9800' }}>
              Submit Invoice
            </Button>
          </form>
        </Paper>
      </Container>
    </motion.div>
  );
}

export default Upload;
