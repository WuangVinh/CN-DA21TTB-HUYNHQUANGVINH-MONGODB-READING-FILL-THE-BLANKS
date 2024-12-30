const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Result = require('../models/Result');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Get all questions
router.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find()
            .select('-__v')
            .sort({ question_id: 1 });
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Error fetching questions' });
    }
});

// Get question by ID
router.get('/questions/:id', async (req, res) => {
    try {
        const question = await Question.findOne({ question_id: req.params.id })
            .select('-__v');
            
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        
        res.json(question);
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ message: 'Error fetching question' });
    }
});

// Save quiz result
router.post('/results', async (req, res) => {
    try {
        console.log('Received result data:', req.body); // Log để debug

        const {
            userId,
            questionId,
            answers,
            score,
            totalQuestions,
            percentage,
            timeSpent
        } = req.body;

        // Validate required fields
        if (!questionId || score === undefined || !totalQuestions) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                received: req.body 
            });
        }

        // Create new result
        const result = new Result({
            userId: userId || 'guest',
            questionId,
            answers,
            score,
            totalQuestions,
            percentage,
            timeSpent,
            completedAt: new Date()
        });

        // Save to database
        const savedResult = await result.save();
        console.log('Saved result:', savedResult); // Log để debug

        res.status(201).json({
            message: 'Result saved successfully',
            result: savedResult
        });

    } catch (error) {
        console.error('Error saving result:', error);
        res.status(500).json({ 
            message: 'Error saving result',
            error: error.message 
        });
    }
});

// Get results by user ID
router.get('/results/:userId', async (req, res) => {
    try {
        const results = await Result.find({ userId: req.params.userId })
            .sort({ completedAt: -1 });
        res.json(results);
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ message: 'Error fetching results' });
    }
});

// API đăng nhập
router.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username }); // Thêm log để debug

        // Tìm người dùng
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Tạo token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        // Trả về thông tin
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Server error during login',
            error: error.message 
        });
    }
});

// API đăng ký
router.post('/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Tạo người dùng mới
        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/user/stats', auth, async (req, res) => {
    const results = await Result.find({ userId: req.user.id });
    res.json(results);
});

// Route để lấy thông tin người dùng
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Không trả về mật khẩu
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
