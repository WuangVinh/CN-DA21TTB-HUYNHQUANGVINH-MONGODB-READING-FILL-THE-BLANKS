import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Card, 
    CardContent, 
    Typography,
    Box,
    TextField,
    Button,
    LinearProgress,
    Chip,
    makeStyles,
    CircularProgress,
    Divider
} from '@material-ui/core';
import {
    Timer as TimerIcon,
    NavigateNext,
    NavigateBefore,
    Check,
    Save as SaveIcon
} from '@material-ui/icons';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        backgroundColor: '#FFF8E1',
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    card: {
        borderRadius: 16,
        boxShadow: '0 4px 20px rgba(183, 121, 31, 0.1)',
    },
    header: {
        background: 'linear-gradient(45deg, #D69E2E 30%, #ECC94B 90%)',
        color: 'white',
        padding: theme.spacing(3),
        borderRadius: '16px 16px 0 0',
    },
    quizContainer: {
        display: 'flex',
        gap: theme.spacing(4),
        padding: theme.spacing(3),
        '@media (max-width: 960px)': {
            flexDirection: 'column',
        },
    },
    questionSection: {
        flex: '2',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: theme.spacing(3),
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    },
    answersSection: {
        flex: '1',
        maxHeight: 'calc(100vh - 250px)',
        overflowY: 'auto',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: theme.spacing(3),
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: theme.spacing(2),
    },
    readingText: {
        fontSize: '1.1rem',
        lineHeight: 1.8,
        color: '#2D3748',
        marginBottom: theme.spacing(4),
        whiteSpace: 'pre-line',
    },
    blankInput: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        margin: '0 8px',
        minWidth: '200px',
    },
    textField: {
        width: '100%',
        '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
            '&:hover': {
                borderColor: '#D69E2E',
            },
            '& fieldset': {
                borderColor: '#E2E8F0',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#B7791F',
            }
        },
        '& .MuiOutlinedInput-input': {
            paddingLeft: '40px', // Space for number
            color: '#2D3748',
            fontWeight: 500,
        }
    },
    answerNumber: {
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 2,
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: '#ECC94B',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '0.875rem',
    },
    answerItem: {
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2),
        borderRadius: 8,
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        '&:hover': {
            backgroundColor: '#FEFCBF',
        }
    },
    answerOptions: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    optionChip: {
        margin: theme.spacing(0.5),
        padding: theme.spacing(1, 2),
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        backgroundColor: 'white',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: '#FEFCBF',
            borderColor: '#D69E2E',
        },
        '&.selected': {
            backgroundColor: '#D69E2E',
            color: 'white',
            borderColor: '#B7791F',
        }
    },
    timer: {
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        fontSize: '1.2rem',
        '& .MuiSvgIcon-root': {
            marginRight: theme.spacing(1),
        },
    },
    progress: {
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        '& .MuiLinearProgress-bar': {
            backgroundColor: 'white',
        },
        marginTop: theme.spacing(2),
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing(4),
        padding: theme.spacing(3),
        borderTop: '1px solid #EDF2F7',
    },
    button: {
        padding: '12px 24px',
        borderRadius: 25,
        textTransform: 'none',
        fontWeight: 600,
        '&.submit': {
            background: 'linear-gradient(45deg, #D69E2E 30%, #ECC94B 90%)',
            color: 'white',
            boxShadow: '0 3px 10px rgba(214, 158, 46, 0.3)',
            '&:hover': {
                background: 'linear-gradient(45deg, #B7791F 30%, #D69E2E 90%)',
            },
            '&.Mui-disabled': {
                background: '#E2E8F0',
                color: '#A0AEC0',
            },
        },
    },
    warningText: {
        color: '#C53030',
        fontSize: '0.875rem',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        marginTop: theme.spacing(2),
    },
}));

const Quiz = () => {
    const classes = useStyles();
    const { id } = useParams();
    const history = useHistory();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/questions/${id}`);
                setQuiz(response.data);
                setTimeLeft(response.data.blanks.length * 120); // 2 minutes per blank
                setLoading(false);
            } catch (error) {
                console.error('Error fetching quiz:', error);
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleAnswerChange = (blankId, value) => {
        setAnswers(prev => ({
            ...prev,
            [blankId]: value
        }));
    };

    const handleSubmit = () => {
        const results = {
            quiz: quiz,
            answers: answers,
            timeSpent: quiz.blanks.length * 120 - timeLeft
        };
        history.push('/result', { results });
    };

    // Check if all blanks are filled
    const isAllAnswered = () => {
        return quiz.blanks.every(blank => answers[blank.id]);
    };

    const renderQuestionText = () => {
        const parts = quiz.question_text.split('____');
        return parts.map((part, index, array) => (
            <React.Fragment key={index}>
                {part}
                {index < array.length - 1 && (
                    <div className={classes.blankInput}>
                        <span className={classes.answerNumber}>{index + 1}</span>
                        <TextField
                            value={answers[quiz.blanks[index].id] || ''}
                            className={classes.textField}
                            variant="outlined"
                            size="small"
                            placeholder={`Answer ${index + 1}`}
                            disabled
                        />
                    </div>
                )}
            </React.Fragment>
        ));
    };

    const renderAnswerOptions = () => (
        <div className={classes.answersSection}>
            <Typography variant="h6" gutterBottom>
                Answer Options
            </Typography>
            {quiz.blanks.map((blank, index) => (
                <div key={blank.id} className={classes.answerItem}>
                    <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                        Blank {index + 1}:
                    </Typography>
                    <div className={classes.answerOptions}>
                        {blank.options.map((option) => (
                            <div
                                key={option}
                                className={`${classes.optionChip} ${
                                    answers[blank.id] === option ? 'selected' : ''
                                }`}
                                onClick={() => handleAnswerChange(blank.id, option)}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress style={{ color: '#D69E2E' }} />
            </Box>
        );
    }

    if (!quiz) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography color="error">Quiz not found</Typography>
            </Box>
        );
    }

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <Box className={classes.root}>
            <Container maxWidth="lg">
                <Card className={classes.card}>
                    <Box className={classes.header}>
                        <Typography variant="h5" gutterBottom>
                            {quiz.title}
                        </Typography>
                        <Box className={classes.timer}>
                            <TimerIcon />
                            {formatTime(timeLeft)}
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={(timeLeft / (quiz.blanks.length * 120)) * 100}
                            className={classes.progress}
                        />
                    </Box>

                    <CardContent>
                        <div className={classes.quizContainer}>
                            <div className={classes.questionSection}>
                                {renderQuestionText()}
                            </div>
                            {renderAnswerOptions()}
                        </div>

                        <Box className={classes.buttonContainer}>
                            <Button
                                variant="outlined"
                                color="primary"
                                className={classes.button}
                                onClick={() => history.push('/')}
                            >
                                Back to List
                            </Button>
                            <Button
                                variant="contained"
                                className={`${classes.button} ${classes.submitButton} submit`}
                                onClick={handleSubmit}
                                startIcon={<Check />}
                                disabled={!isAllAnswered()}
                            >
                                Submit Answers
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default Quiz;
