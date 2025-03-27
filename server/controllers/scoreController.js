const Score = require('../models/Score');
const User = require('../models/User');

// Environment check
const isProduction = process.env.NODE_ENV === 'production';

// Helper for logging only in development
const devLog = (...args) => {
  if (!isProduction) {
    console.log(...args);
  }
};

// Save a new score
const saveScore = async (req, res) => {
  try {
    const { score } = req.body;
    const userId = req.user._id;
    const username = req.user.username;

    devLog(`Saving score ${score} for user ${username}`);

    // Create new score entry
    const newScore = new Score({
      user: userId,
      username,
      score,
      gameType: 'counter'
    });

    await newScore.save();

    // Update user's high score if necessary
    if (score > req.user.highScore) {
      await User.findByIdAndUpdate(userId, { highScore: score });
      devLog(`Updated high score for ${username} to ${score}`);
    }

    res.status(201).json({ success: true, score: newScore });
  } catch (error) {
    console.error('Save score error:', error);
    res.status(500).json({ 
      message: 'Server error saving score',
      error: isProduction ? 'Internal server error' : error.message 
    });
  }
};

// Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    devLog(`Getting leaderboard page ${page}, limit ${limit}`);

    // Find highest score per user using aggregation
    const highestScoresPerUser = await Score.aggregate([
      {
        $sort: { score: -1 } // Sort by score in descending order
      },
      {
        $group: {
          _id: "$user",
          score: { $first: "$score" },
          username: { $first: "$username" },
          gameType: { $first: "$gameType" },
          createdAt: { $first: "$createdAt" }
        }
      },
      {
        $sort: { score: -1 } // Sort again by score in descending order
      },
      {
        $skip: skip
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          _id: 1,
          user: "$_id",
          score: 1,
          username: 1,
          gameType: 1,
          createdAt: 1
        }
      }
    ]);
    
    // Count total unique users with scores
    const totalUniqueUsers = await Score.aggregate([
      {
        $group: {
          _id: "$user"
        }
      },
      {
        $count: "totalUsers"
      }
    ]);
    
    const total = totalUniqueUsers.length > 0 ? totalUniqueUsers[0].totalUsers : 0;
    
    res.json({
      scores: highestScoresPerUser,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ 
      message: 'Server error fetching leaderboard',
      error: isProduction ? 'Internal server error' : error.message 
    });
  }
};

// Get user's scores
const getUserScores = async (req, res) => {
  try {
    const userId = req.user._id;
    
    devLog(`Getting scores for user ${req.user.username}`);
    
    const scores = await Score.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({ scores });
  } catch (error) {
    console.error('Get user scores error:', error);
    res.status(500).json({ 
      message: 'Server error fetching user scores',
      error: isProduction ? 'Internal server error' : error.message 
    });
  }
};

// Get user's game statistics
const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    devLog(`Getting statistics for user ${req.user.username}`);
    
    // Count total games played by the user
    const gamesPlayed = await Score.countDocuments({ user: userId });
    
    // Get highest score
    const highScore = req.user.highScore;
    
    // Get average score
    const aggregateResult = await Score.aggregate([
      { $match: { user: userId } },
      { $group: { 
          _id: null, 
          averageScore: { $avg: "$score" },
          totalScore: { $sum: "$score" }
        } 
      }
    ]);
    
    const averageScore = aggregateResult.length > 0 
      ? Math.round(aggregateResult[0].averageScore) 
      : 0;
    
    const totalScore = aggregateResult.length > 0 
      ? aggregateResult[0].totalScore 
      : 0;
    
    res.json({
      stats: {
        gamesPlayed,
        highScore,
        averageScore,
        totalScore
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ 
      message: 'Server error fetching user stats',
      error: isProduction ? 'Internal server error' : error.message 
    });
  }
};

module.exports = {
  saveScore,
  getLeaderboard,
  getUserScores,
  getUserStats
}; 