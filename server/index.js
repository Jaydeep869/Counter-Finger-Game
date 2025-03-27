const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');

const authRoutes = require('./routes/auth');
const scoreRoutes = require('./routes/scores');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

mongoose.connect(process.env.MONGODB_URI, {
  
  serverSelectionTimeoutMS: 5000, 
  socketTimeoutMS: 45000, 
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use(express.json());
app.use(cors());

// Production optimizations
if (isProduction) {
  // Security headers
  app.use(helmet());
  
  // Compress responses
  app.use(compression());
  
  // Rate limiting can be added here
}

app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is up and running' });
});

if (isProduction) {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  if (!isProduction) {
    console.error(err);
  }
  
  res.status(statusCode).json({
    error: {
      message,
      ...(isProduction ? {} : { stack: err.stack })
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
}); 