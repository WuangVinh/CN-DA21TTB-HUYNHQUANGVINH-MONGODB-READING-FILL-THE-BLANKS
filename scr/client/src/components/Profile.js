import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Avatar
} from '@material-ui/core';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
    profileCard: {
        marginBottom: theme.spacing(3),
    },
    avatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        marginBottom: theme.spacing(2),
    },
    statsCard: {
        height: '100%',
    },
    editButton: {
        marginTop: theme.spacing(2),
    },
    historyTable: {
        marginTop: theme.spacing(3),
    }
}));

const Profile = () => {
    const classes = useStyles();
    const [user, setUser] = useState(null);
    const [quizHistory, setQuizHistory] = useState([]);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        currentPassword: '',
        newPassword: ''
    });
    const history = useHistory();

    useEffect(() => {
        fetchUserData();
        fetchQuizHistory();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                history.push('/login');
                return;
            }
            
            const response = await axios.get('http://localhost:5000/api/user/profile', {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data) {
                setUser(response.data);
                setFormData({
                    username: response.data.username,
                    email: response.data.email,
                    currentPassword: '',
                    newPassword: ''
                });
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                history.push('/login');
            }
        }
    };

    const fetchQuizHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await axios.get('http://localhost:5000/api/user/quiz-history', {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data) {
                setQuizHistory(response.data);
            }
        } catch (error) {
            console.error('Error fetching quiz history:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/user/profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditing(false);
            fetchUserData();
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!user) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container className={classes.root}>
            <Grid container spacing={3}>
                {/* Profile Information */}
                <Grid item xs={12} md={6}>
                    <Paper className={classes.profileCard}>
                        <CardContent>
                            <Avatar className={classes.avatar}>
                                {user.username.charAt(0).toUpperCase()}
                            </Avatar>
                            {!editing ? (
                                <>
                                    <Typography variant="h5" gutterBottom>
                                        {user.username}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        {user.email}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        className={classes.editButton}
                                        onClick={() => setEditing(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                </>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <TextField
                                        fullWidth
                                        label="Username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Current Password"
                                        name="currentPassword"
                                        type="password"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="New Password"
                                        name="newPassword"
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        className={classes.editButton}
                                    >
                                        Save Changes
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setEditing(false)}
                                        className={classes.editButton}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Cancel
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Paper>
                </Grid>

                {/* Quiz Statistics */}
                <Grid item xs={12} md={6}>
                    <Card className={classes.statsCard}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Quiz Statistics
                            </Typography>
                            <Typography>
                                Total Quizzes: {quizHistory.length}
                            </Typography>
                            <Typography>
                                Average Score: {
                                    quizHistory.length > 0
                                        ? (quizHistory.reduce((acc, curr) => acc + curr.score, 0) / quizHistory.length).toFixed(2)
                                        : 0
                                }%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Quiz History */}
                <Grid item xs={12}>
                    <Paper className={classes.historyTable}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Quiz Type</TableCell>
                                    <TableCell>Score</TableCell>
                                    <TableCell>Time Taken</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {quizHistory.map((quiz) => (
                                    <TableRow key={quiz._id}>
                                        <TableCell>
                                            {new Date(quiz.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{quiz.quizType}</TableCell>
                                        <TableCell>{quiz.score}%</TableCell>
                                        <TableCell>{quiz.timeTaken} minutes</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Profile;
