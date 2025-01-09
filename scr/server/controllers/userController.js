const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    console.log('Register request:', req.body);
    const { email, password } = req.body;

    // Kiểm tra email đã tồn tại
    let user = await User.findOne({ email });
    if (user) {
      console.log('Email already exists');
      return res.status(400).json({ message: 'Email already exists' });
    }

     // Tạo user mới
    user = new User({
      email,
      password: Password
    });

    await user.save();
    console.log('User registered successfully');
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login request:', req.body);

    const { email, password } = req.body;

    // Kiểm tra email và password có được gửi không
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Tìm user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Tạo token
    const token = jwt.sign(
      { userId: user._id },
      'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
