const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username });

        // Tìm user bằng email hoặc username
        const user = await User.findOne({
            $or: [
                { email: username },
                { username: username }
            ]
        });

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Kiểm tra password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Tạo JWT token
        const token = jwt.sign(
            { id: user._id },
            'your_jwt_secret',
            { expiresIn: '1h' }
        );

        console.log('Login successful');
        
        // Trả về response thành công
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
        console.error('Server error during login:', error);
        res.status(500).json({ 
            message: 'Server error during login',
            error: error.message 
        });
    }
});

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log('Register attempt:', { username, email });

        // Kiểm tra user tồn tại
        const existingUser = await User.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Username or email already exists'
            });
        }

        // Tạo user mới
        const newUser = new User({
            username,
            email,
            password
        });

        await newUser.save();
        console.log('Registration successful');

        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error('Server error during registration:', error);
        res.status(500).json({
            message: 'Server error during registration',
            error: error.message
        });
    }
});

module.exports = router;