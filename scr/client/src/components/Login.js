import React, { useState } from 'react';
import {
    Container,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Box,
    makeStyles,
    CircularProgress,
    Snackbar,
    Divider,
    Link,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #FFF8E1 0%, #FFFAF0 100%)',
    },
    card: {
        maxWidth: 400,
        margin: 'auto',
        borderRadius: 15,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(3),
    },
    submitButton: {
        marginTop: theme.spacing(2),
        background: 'linear-gradient(45deg, #D69E2E 30%, #ECC94B 90%)',
        color: 'white',
        padding: theme.spacing(1.5),
        '&:hover': {
            background: 'linear-gradient(45deg, #B7791F 30%, #D69E2E 90%)',
        },
    },
    divider: {
        margin: theme.spacing(3, 0),
    },
    registerSection: {
        textAlign: 'center',
        marginTop: theme.spacing(2),
    },
    registerLink: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        fontWeight: 'bold',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
}));

const Login = () => {
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username: formData.username,
                password: formData.password
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                history.push('/');
            } else {
                setError('Invalid response from server');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                setError(error.response.data.message || 'Server error');
            } else if (error.request) {
                setError('No response from server. Please check your connection.');
            } else {
                setError('An error occurred: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Box className={classes.root}>
            <Container maxWidth="sm">
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="h5" align="center" gutterBottom>
                            Login
                        </Typography>
                        
                        <form onSubmit={handleSubmit} className={classes.form}>
                            <TextField
                                name="username"
                                label="Username"
                                variant="outlined"
                                required
                                value={formData.username}
                                onChange={handleChange}
                            />
                            
                            <TextField
                                name="password"
                                label="Password"
                                type="password"
                                variant="outlined"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                            
                            <Button
                                type="submit"
                                variant="contained"
                                className={classes.submitButton}
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Login'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Container>

            <Snackbar 
                open={!!error} 
                autoHideDuration={6000} 
                onClose={() => setError('')}
            >
                <Typography style={{ color: 'red', backgroundColor: 'white', padding: '10px' }}>
                    {error}
                </Typography>
            </Snackbar>
        </Box>
    );
};

export default Login;
