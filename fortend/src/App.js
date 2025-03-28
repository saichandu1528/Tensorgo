import { googleLogout } from '@react-oauth/google';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

function App() {
  const [invoices, setInvoices] = useState([]);
  const [status, setStatus] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  useEffect(() => {
    if (!user || !localStorage.getItem('user')) {
      navigate('/login');
      return;
    }

    const decoded = jwtDecode(localStorage.getItem('user'));

    fetch(`http://localhost:5000/invoices/${decoded.sub}`)
      .then((res) => res.json())
      .then((res) => setInvoices(res))
      .catch((err) => console.error(err));
  }, [navigate, user]);

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('user');
    navigate('/login');
  };

  const triggerZapier = async (invoice) => {
    setStatus((prev) => ({ ...prev, [invoice._id]: "sending" })); 

    try {
      await axios.post('http://localhost:5000/trigger-zapier', invoice);
      setStatus((prev) => ({ ...prev, [invoice._id]: "sent" })); 
    } catch (error) {
      setStatus((prev) => ({ ...prev, [invoice._id]: "failed" })); 
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
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar position="static" sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', boxShadow: 'none' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Dashboard
          </Typography>
          <div>
          <Button variant="contained" color="primary" sx={{ mx: 1 }} onClick={() => navigate('/upload')}>
            Add Invoice
          </Button>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
          </div>
        </Toolbar>
      </AppBar>

      <motion.div 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          margin: '40px 0',
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Welcome, {user?.name} 
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8, mt: 1 }}>
          Manage your invoices efficiently!
        </Typography>
      </motion.div>

      <Grid container spacing={3} sx={{ px: 4 }}>
        {invoices.length > 0 ? (
          invoices.map((inv) => (
            <Grid item xs={12} sm={6} md={4} key={inv._id}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card sx={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(15px)', color: '#fff', borderRadius: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {inv.name}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      price: {inv.amount}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      To: {inv.recipientEmail}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Due Date: {inv.dueDate.split('T')[0]}
                    </Typography>

                    <Button 
                      variant="contained" 
                      sx={{ mt: 2, background: '#ff9800', color: '#fff' }} 
                      onClick={() => triggerZapier(inv)}
                      disabled={status[inv._id] === "sending"} 
                    >
                      {status[inv._id] === "sending" ? <CircularProgress size={20} sx={{ color: 'white' }} /> : "Send Reminder"}
                    </Button>

                    {status[inv._id] === "sent" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        <Typography sx={{ color: "#00e676", mt: 1 }}>✅ Sent</Typography>
                      </motion.div>
                    )}
                    {status[inv._id] === "failed" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        <Typography sx={{ color: "#ff3d00", mt: 1 }}>❌ Failed</Typography>
                      </motion.div>
                    )}

                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography textAlign="center" variant="h6" sx={{ opacity: 0.8 }}>
              No invoices found.
            </Typography>
          </Grid>
        )}
      </Grid>
    </motion.div>
  );
}

export default App;
