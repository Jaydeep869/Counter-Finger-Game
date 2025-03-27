const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Score = require('../models/Score');

const isProduction = process.env.NODE_ENV === 'production';

const devLog = (...args) => {
  if (!isProduction) {
    console.log(...args);
  }
};

const register = async (req, res) => {
  try {
    devLog('Register request received:', req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      devLog('Missing required fields:', { username: !!username, email: !!email, password: !!password });
      return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      devLog('User already exists:', { email, username });
      return res.status(400).json({ message: 'User already exists with that email or username' });
    }

    const user = new User({
      username,
      email,
      password
    });

    await user.save();
    devLog('User saved to database:', { id: user._id, username: user.username });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        highScore: user.highScore
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration', error: isProduction ? 'Internal server error' : error.message });
  }
};

const login = async (req, res) => {
  try {
    devLog('Login request received:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      devLog('Missing login credentials:', { email: !!email, password: !!password });
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      devLog('User not found:', { email });
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    devLog('Password match result:', isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    devLog('Login successful:', { username: user.username });
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        highScore: user.highScore
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: isProduction ? 'Internal server error' : error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    devLog('Getting current user:', req.user?._id);
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error fetching user data', error: isProduction ? 'Internal server error' : error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user._id;

    if (!username) {
      return res.status(400).json({ message: 'Please provide a username' });
    }

    const existingUser = await User.findOne({ username, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    await Score.updateMany({ user: userId }, { username });

    devLog('User updated:', { id: updatedUser._id, username: updatedUser.username });
    
    res.json({
      message: 'Username updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error updating user', error: isProduction ? 'Internal server error' : error.message });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateUser
}; 