import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Grid, 
    Card, 
    CardContent, 
    Button, 
    Typography,
    Box,
    Chip,
    makeStyles,
    CircularProgress,
    Avatar,
    IconButton,
    InputBase,
    Paper
} from '@material-ui/core';
import { 
    Timer as TimerIcon,
    School as SchoolIcon,
    Star as StarIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Assignment as QuizIcon,
    ArrowForward as ArrowIcon
} from '@material-ui/icons';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(8),
    },
    header: {
        textAlign: 'center',
        marginBottom: theme.spacing(6),
        padding: theme.spacing(4),
        backgroundColor: '#FFD700',
        borderRadius: '0 0 50% 50% / 20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
    headerTitle: {
        color: '#000',
        fontWeight: 800,
        fontSize: '2rem',
    },
    headerSubtitle: {
        color: '#333',
        fontWeight: 500,
        fontSize: '1.2rem',
    },
    searchBar: {
        position: 'relative',
        maxWidth: 600,
        margin: '20px auto',
        borderRadius: 50,
        backgroundColor: 'white',
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
    searchInput: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 20,
        transition: 'all 0.3s ease',
        background: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
        },
    },
    cardMedia: {
        position: 'relative',
        backgroundColor: '#FFF8E1',
        height: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '20px 20px 0 0',
    },
    quizIcon: {
        width: 60,
        height: 60,
        backgroundColor: '#D69E2E',
        color: 'white',
    },
    cardContent: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    title: {
        fontWeight: 700,
        color: '#2D3748',
        marginBottom: theme.spacing(2),
        fontSize: '1.25rem',
    },
    infoContainer: {
        display: 'flex',
        alignItems: 'center',
        color: '#718096',
        marginBottom: theme.spacing(1),
        '& svg': {
            marginRight: theme.spacing(1),
            color: '#D69E2E',
        },
    },
    startButton: {
        marginTop: 'auto',
        padding: '10px 24px',
        borderRadius: 50,
        background: '#D69E2E',
        color: 'white',
        fontWeight: 600,
        textTransform: 'none',
        fontSize: '1rem',
        boxShadow: '0 4px 14px rgba(214, 158, 46, 0.4)',
        '&:hover': {
            background: '#C47F1C',
        },
    },
    guideSection: {
        marginTop: theme.spacing(6),
        padding: theme.spacing(4),
        backgroundColor: '#FFF3C4',
        borderRadius: 10,
    },
}));

const QuizList = () => {
    const classes = useStyles();
    const history = useHistory();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/questions');
                setQuestions(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleStartQuiz = (questionId) => {
        history.replace(`/quiz/${questionId}`);
    };

    const filteredQuestions = questions.filter(question =>
        question.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress style={{ color: '#D69E2E' }} />
            </Box>
        );
    }

    return (
        <Box className={classes.root}>
            <Box className={classes.header}>
                <Typography variant="h3" className={classes.headerTitle}>
                  Fill in the Banks Exam
                </Typography>
                <Typography variant="h6" className={classes.headerSubtitle}>
                Good luck in the exam
                </Typography>
            </Box>

            <Container maxWidth="lg">
                <Paper component="form" className={classes.searchBar}>
                    <SearchIcon style={{ color: '#718096' }} />
                    <InputBase
                        className={classes.searchInput}
                        placeholder="Search by title or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <IconButton className={classes.filterButton}>
                        <FilterIcon />
                    </IconButton>
                </Paper>

                <Grid container spacing={4}>
                    {filteredQuestions.map((question) => (
                        <Grid item key={question._id} xs={12} sm={6} md={4}>
                            <Card className={classes.card}>
                                <Box className={classes.cardMedia}>
                                    <Avatar className={classes.quizIcon}>
                                        <QuizIcon />
                                    </Avatar>
                                </Box>
                                
                                <CardContent className={classes.cardContent}>
                                    <Box className={classes.chipContainer}>
                                        <Chip
                                            label={question.difficulty.toUpperCase()}
                                            className={classes.difficultyChip}
                                            size="small"
                                        />
                                        <Chip
                                            label={question.category.replace(/_/g, ' ')}
                                            className={classes.categoryChip}
                                            size="small"
                                        />
                                    </Box>

                                    <Typography className={classes.title}>
                                        {question.title || `Reading ${question.question_id}`}
                                    </Typography>

                                    <Box className={classes.infoContainer}>
                                        <TimerIcon />
                                        <Typography>
                                            {question.blanks?.length * 2 || 10} minutes
                                        </Typography>
                                    </Box>

                                    <Box className={classes.infoContainer}>
                                        <SchoolIcon />
                                        <Typography>
                                            {question.blanks?.length || 0} questions
                                        </Typography>
                                    </Box>

                                    <Box className={classes.infoContainer}>
                                        <StarIcon />
                                        <Typography>
                                            {question.points || question.blanks?.length || 0} points
                                        </Typography>
                                    </Box>

                                    <Button
                                        fullWidth
                                        className={classes.startButton}
                                        onClick={() => handleStartQuiz(question.question_id)}
                                        endIcon={<ArrowIcon />}
                                    >
                                        Start Practice
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box className={classes.guideSection}>
                    <Typography variant="h5" gutterBottom>
                        Hướng dẫn làm dạng bài PTE Fill In The Blanks
                    </Typography>
                    <Typography variant="body1">
                        Để làm bài Fill In The Blanks trong PTE, bạn cần chú ý những điểm sau:
                    </Typography>
                    <Typography variant="body1" paragraph>
                        1. Đọc kỹ câu hỏi và các lựa chọn trước khi điền vào chỗ trống.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        2. Sử dụng ngữ cảnh của câu để giúp bạn chọn từ phù hợp.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        3. Chú ý đến ngữ pháp và cấu trúc câu khi điền từ.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        4. Nếu không chắc chắn, hãy thử các lựa chọn khác nhau và xem xét ngữ cảnh.
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Trước khi đọc:
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Trước khi chú ý đến các chỗ trống, hãy đọc nhanh để hiểu nội dung chính của đoạn văn. Việc này giúp học viên xác định được chủ đề, bối cảnh và mạch ý chính của bài đọc, từ đó dễ dàng chọn từ điền phù hợp hơn.
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Trong khi đọc:
                    </Typography>
                    <Typography variant="body1" paragraph>
                        - Xác định loại từ cần điền: Tại mỗi chỗ trống, trước hết xác định loại từ cần điền. Sử dụng các dấu hiệu ngữ pháp và ngữ nghĩa trong câu để loại bỏ các lựa chọn không phù hợp.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        - Ngữ pháp: Nếu chỗ trống yêu cầu một danh từ số nhiều, loại bỏ các lựa chọn danh từ số ít. Tương tự, nếu chỗ trống cần một động từ chia thì quá khứ, hãy bỏ qua các động từ ở thì hiện tại.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        - Mối liên kết ngữ nghĩa: Chú ý đến các đại từ và từ nối để đảm bảo sự liên kết logic giữa các câu trong đoạn văn. Ví dụ, nếu đoạn văn có từ “they,” bạn có thể dự đoán từ điền vào chỗ trống trước đó có thể là một danh từ số nhiều.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        - Chọn từ dựa trên ngữ cảnh: Xem xét từ hoặc cụm từ đứng trước và sau chỗ trống để chọn từ phù hợp. Ví dụ, trong cụm từ “due to the,” học viên sẽ cần một danh từ hoặc danh động từ ngay sau đó.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        - Đối chiếu các lựa chọn: Sau khi phân tích ngữ pháp và ngữ nghĩa, đối chiếu các lựa chọn để chọn từ thích hợp. Nếu không chắc chắn về từ cần điền, hãy bỏ qua chỗ trống đó tạm thời và tiếp tục điền các chỗ trống khác. Khi nhiều chỗ trống đã được điền, ngữ cảnh sẽ rõ ràng hơn, giúp học viên dễ chọn từ phù hợp cho các chỗ còn lại.
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Sau khi đọc:
                    </Typography>
                    <Typography variant="body1" paragraph>
                        - Kiểm tra lại toàn bộ đoạn văn: Sau khi đã điền hết các chỗ trống, đọc lại đoạn văn để đảm bảo mạch ý và ngữ pháp hợp lý. Xem xét sự liên kết giữa các câu và đoạn văn để đảm bảo đáp án đã đúng ngữ cảnh.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        - Sắp xếp lại nếu cần thiết: Nếu nhận thấy đoạn văn vẫn chưa hợp lý, hãy cân nhắc thay đổi một số lựa chọn để đảm bảo tính logic và sự liền mạch của nội dung.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        - Điền tất cả các chỗ trống: Ngay cả khi bạn không chắc chắn về đáp án, cố gắng không bỏ trống bất kỳ chỗ nào. Đoán đáp án vẫn tốt hơn là để trống để tối ưu điểm số đạt được.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default QuizList; 