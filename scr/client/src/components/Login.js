import React, { useState, useEffect } from 'react';
import {
    Container,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Box,
    makeStyles
} from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
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
        marginTop: theme.spacing(2)
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
    successMessage: {
        color: '#2F855A',
        backgroundColor: '#F0FFF4',
        padding: theme.spacing(2),
        borderRadius: theme.spacing(1),
        marginBottom: theme.spacing(2),
    },
    errorMessage: {
        color: '#C53030',
        backgroundColor: '#FFF5F5',
        padding: theme.spacing(2),
        borderRadius: theme.spacing(1),
        marginBottom: theme.spacing(2),
    }
}));

const Login = () => {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            history.replace({ ...location, state: {} });
        }
    }, [location, history]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                window.location.href = '/';
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Box className={classes.root}>
            <Container maxWidth="sm">
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="h5" align="center" gutterBottom>
                            Login
                        </Typography>
                        
                        {successMessage && (
                            <Typography 
                                className={classes.successMessage}
                                onClick={() => setSuccessMessage('')}
                            >
                                {successMessage}
                            </Typography>
                        )}
                        
                        {error && (
                            <Typography 
                                className={classes.errorMessage}
                                onClick={() => setError('')}
                            >
                                {error}
                            </Typography>
                        )}

                        <form onSubmit={handleSubmit} className={classes.form}>
                            <TextField
                                name="username"
                                label="Username"
                                variant="outlined"
                                required
                                fullWidth
                                value={formData.username}
                                onChange={handleChange}
                            />
                            
                            <TextField
                                name="password"
                                label="Password"
                                type="password"
                                variant="outlined"
                                required
                                fullWidth
                                value={formData.password}
                                onChange={handleChange}
                            />
                            
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                className={classes.submitButton}
                            >
                                Login
                            </Button>

                            <Button
                                variant="text"
                                fullWidth
                                color="primary"
                                onClick={() => history.push('/register')}
                                style={{ marginTop: '1rem' }}
                            >
                                Don't have an account? Register
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default Login;
