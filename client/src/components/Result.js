import React, { useState, useEffect } from 'react';
import {
    Container,
    Card,
    Typography,
    Box,
    Button,
    makeStyles,
    CircularProgress,
    Divider,
    Avatar,
    Fade,
    IconButton,
    Tooltip
} from '@material-ui/core';
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Timer as TimerIcon,
    EmojiEvents as TrophyIcon,
    Replay as RetryIcon,
    Home as HomeIcon,
    Share as ShareIcon,
    GetApp as DownloadIcon,
    CheckCircleOutline as CorrectIcon,
    CancelOutlined as WrongIcon
} from '@material-ui/icons';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFF8E1 0%, #FFFAF0 100%)',
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(8),
    },
    container: {
        position: 'relative',
        maxWidth: 800,
    },
    card: {
        borderRadius: 20,
        overflow: 'visible',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    },
    header: {
        position: 'relative',
        background: 'linear-gradient(45deg, #D69E2E 30%, #ECC94B 90%)',
        color: 'white',
        padding: theme.spacing(6, 3, 8),
        textAlign: 'center',
        borderRadius: '20px 20px 0 0',
    },
    trophy: {
        width: 80,
        height: 80,
        marginBottom: theme.spacing(2),
        animation: '$bounce 2s infinite',
    },
    scoreCard: {
        position: 'relative',
        margin: '-50px auto 0',
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: theme.spacing(3),
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    score: {
        fontSize: '3.5rem',
        fontWeight: 'bold',
        background: 'linear-gradient(45deg, #D69E2E 30%, #ECC94B 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: theme.spacing(1),
    },
    percentage: {
        fontSize: '1.5rem',
        color: '#975A16',
        fontWeight: 500,
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: theme.spacing(3),
        padding: theme.spacing(4),
    },
    statCard: {
        backgroundColor: '#FFFBEB',
        padding: theme.spacing(2),
        borderRadius: 15,
        textAlign: 'center',
        transition: 'transform 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
        },
    },
    statIcon: {
        backgroundColor: '#FEF3C7',
        color: '#D69E2E',
        marginBottom: theme.spacing(1),
    },
    statLabel: {
        color: '#975A16',
        fontSize: '0.875rem',
        marginTop: theme.spacing(1),
    },
    statValue: {
        color: '#744210',
        fontWeight: 600,
        fontSize: '1.25rem',
    },
    answersSection: {
        padding: theme.spacing(4),
    },
    answerCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: theme.spacing(3),
        marginBottom: theme.spacing(2),
        transition: 'all 0.3s ease',
        position: 'relative',
        border: '1px solid #E2E8F0',
        '&:hover': {
            transform: 'translateX(10px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
    },
    answerCardCorrect: {
        borderLeft: '4px solid #48BB78',
        '&:hover': {
            borderLeft: '4px solid #48BB78',
        },
    },
    answerCardWrong: {
        borderLeft: '4px solid #F56565',
        '&:hover': {
            borderLeft: '4px solid #F56565',
        },
    },
    statusIcon: {
        position: 'absolute',
        right: theme.spacing(3),
        top: theme.spacing(3),
        fontSize: 28,
    },
    correctIcon: {
        color: '#48BB78',
    },
    wrongIcon: {
        color: '#F56565',
    },
    answerText: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(1),
        padding: theme.spacing(1.5),
        borderRadius: 10,
        backgroundColor: '#F7FAFC',
    },
    correctAnswer: {
        color: '#276749',
        backgroundColor: '#F0FFF4',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        '& svg': {
            color: '#48BB78',
        },
    },
    wrongAnswer: {
        color: '#C53030',
        backgroundColor: '#FFF5F5',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        '& svg': {
            color: '#F56565',
        },
    },
    questionNumber: {
        color: '#4A5568',
        fontWeight: 600,
        marginBottom: theme.spacing(2),
    },
    answerLabel: {
        fontWeight: 500,
        marginRight: theme.spacing(1),
        color: '#718096',
    },
    answerValue: {
        fontWeight: 600,
        color: '#2D3748',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: theme.spacing(4),
        gap: theme.spacing(2),
    },
    button: {
        borderRadius: 50,
        padding: theme.spacing(1.5, 4),
        textTransform: 'none',
        fontWeight: 600,
        boxShadow: 'none',
        '&.retry': {
            backgroundColor: '#D69E2E',
            color: 'white',
            '&:hover': {
                backgroundColor: '#B7791F',
            },
        },
    },
    '@keyframes bounce': {
        '0%, 100%': {
            transform: 'translateY(0)',
        },
        '50%': {
            transform: 'translateY(-10px)',
        },
    },
}));

const Result = () => {
    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();
    const [saving, setSaving] = useState(true);
    const [saveError, setSaveError] = useState(null);
    
    const calculateScore = (results) => {
        if (!results?.quiz?.blanks || !results?.answers) {
            return 0;
        }
        let correct = 0;
        results.quiz.blanks.forEach(blank => {
            if (results.answers[blank.id] === blank.correctAnswer) {
                correct++;
            }
        });
        return correct;
    };
    
    useEffect(() => {
        console.log('Location state:', location.state);
        if (!location.state?.results?.quiz?.blanks) {
            console.error('Missing quiz data, redirecting to home');
            history.replace('/');
            return null;
        }
        
        const saveResult = async () => {
            if (!location.state?.results?.quiz?.blanks) {
                console.error('Invalid quiz data');
                setSaveError('Invalid quiz data');
                setSaving(false);
                return;
            }
            
            try {
                const { results } = location.state;
                const score = calculateScore(results);
                const totalQuestions = results.quiz.blanks.length;
                const percentage = Math.round((score / totalQuestions) * 100);

                const API_URL = 'http://localhost:5000/api/results';
                
                console.log('Sending data:', {
                    userId: 'guest',
                    questionId: results.quiz.question_id,
                    answers: results.answers,
                    score,
                    totalQuestions,
                    percentage,
                    timeSpent: results.timeSpent || 0
                });

                const response = await axios.post(API_URL, {
                    userId: 'guest',
                    questionId: results.quiz.question_id,
                    answers: results.answers,
                    score,
                    totalQuestions,
                    percentage,
                    timeSpent: results.timeSpent || 0
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Save response:', response.data);
                setSaving(false);

            } catch (error) {
                console.error('Error details:', error.response?.data || error.message);
                setSaveError(error.response?.data?.message || 'Failed to save result');
                setSaving(false);
            }
        };

        saveResult();
    }, [location.state]);

    if (!location.state?.results?.quiz?.blanks) {
        console.error('Missing quiz data, redirecting to home');
        history.replace('/');
        return null;
    }

    const { results } = location.state;
    const score = calculateScore(results);
    const totalQuestions = results.quiz.blanks.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const timeSpent = results.timeSpent || 0;

    const handleTryAgain = () => {
        history.replace(`/quiz/${results.quiz.question_id}`);
    };

    return (
        <Box className={classes.root}>
            <Container className={classes.container}>
                <Fade in timeout={1000}>
                    <Card className={classes.card}>
                        <Box className={classes.header}>
                            <TrophyIcon className={classes.trophy} />
                            <Typography variant="h4" gutterBottom>
                                Quiz Completed!
                            </Typography>
                            <Typography variant="subtitle1">
                                Great job on completing the quiz
                            </Typography>
                        </Box>

                        <Box className={classes.scoreCard}>
                            <Typography className={classes.score}>
                                {score}/{totalQuestions}
                            </Typography>
                            <Typography className={classes.percentage}>
                                {percentage}% Correct
                            </Typography>
                        </Box>

                        <Box className={classes.statsGrid}>
                            <Box className={classes.statCard}>
                                <Avatar className={classes.statIcon}>
                                    <TimerIcon />
                                </Avatar>
                                <Typography className={classes.statValue}>
                                    {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
                                </Typography>
                                <Typography className={classes.statLabel}>
                                    Time Spent
                                </Typography>
                            </Box>
                            <Box className={classes.statCard}>
                                <Avatar className={classes.statIcon}>
                                    <CheckCircleIcon />
                                </Avatar>
                                <Typography className={classes.statValue}>
                                    {score}
                                </Typography>
                                <Typography className={classes.statLabel}>
                                    Correct Answers
                                </Typography>
                            </Box>
                            <Box className={classes.statCard}>
                                <Avatar className={classes.statIcon}>
                                    <CancelIcon />
                                </Avatar>
                                <Typography className={classes.statValue}>
                                    {totalQuestions - score}
                                </Typography>
                                <Typography className={classes.statLabel}>
                                    Incorrect Answers
                                </Typography>
                            </Box>
                        </Box>

                        <Divider />

                        <Box className={classes.answersSection}>
                            <Typography variant="h6" gutterBottom>
                                Detailed Review
                            </Typography>
                            {results.quiz.blanks.map((blank, index) => {
                                const isCorrect = results.answers[blank.id] === blank.correctAnswer;
                                return (
                                    <Fade in timeout={500 * (index + 1)} key={blank.id}>
                                        <Box 
                                            className={`${classes.answerCard} ${
                                                isCorrect ? classes.answerCardCorrect : classes.answerCardWrong
                                            }`}
                                        >
                                            {isCorrect ? (
                                                <CheckCircleIcon className={`${classes.statusIcon} ${classes.correctIcon}`} />
                                            ) : (
                                                <CancelIcon className={`${classes.statusIcon} ${classes.wrongIcon}`} />
                                            )}
                                            
                                            <Typography className={classes.questionNumber}>
                                                Question {index + 1}
                                            </Typography>

                                            {isCorrect ? (
                                                <Box className={`${classes.answerText} ${classes.correctAnswer}`}>
                                                    <CorrectIcon />
                                                    <Typography className={classes.answerLabel}>
                                                        Your answer:
                                                    </Typography>
                                                    <Typography className={classes.answerValue}>
                                                        {blank.correctAnswer}
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <>
                                                    <Box className={`${classes.answerText} ${classes.wrongAnswer}`}>
                                                        <WrongIcon />
                                                        <Typography className={classes.answerLabel}>
                                                            Your answer:
                                                        </Typography>
                                                        <Typography className={classes.answerValue}>
                                                            {results.answers[blank.id] || 'Not answered'}
                                                        </Typography>
                                                    </Box>
                                                    <Box className={`${classes.answerText} ${classes.correctAnswer}`} style={{ marginTop: 8 }}>
                                                        <CorrectIcon />
                                                        <Typography className={classes.answerLabel}>
                                                            Correct answer:
                                                        </Typography>
                                                        <Typography className={classes.answerValue}>
                                                            {blank.correctAnswer}
                                                        </Typography>
                                                    </Box>
                                                </>
                                            )}
                                        </Box>
                                    </Fade>
                                );
                            })}
                        </Box>

                        <Box className={classes.buttonContainer}>
                            <Button
                                variant="outlined"
                                className={classes.button}
                                startIcon={<HomeIcon />}
                                onClick={() => history.push('/')}
                            >
                                Back to List
                            </Button>
                            <Box>
                                <Tooltip title="Share Results">
                                    <IconButton>
                                        <ShareIcon />
                                    </IconButton>
                                </Tooltip>
                                
                            </Box>
                           
                        </Box>
                    </Card>
                </Fade>
            </Container>
        </Box>
    );
};

export default Result;