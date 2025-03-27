const express = require('express');
const router = express.Router();
const { saveScore, getLeaderboard, getUserScores, getUserStats } = require('../controllers/scoreController');
const { authMiddleware } = require('../middleware/auth');

router.get('/leaderboard', getLeaderboard);

router.post('/', authMiddleware, saveScore);
router.get('/user', authMiddleware, getUserScores);
router.get('/user/stats', authMiddleware, getUserStats);

module.exports = router; 