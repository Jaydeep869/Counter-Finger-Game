const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, updateUser } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.put('/update', authMiddleware, updateUser);

module.exports = router; 