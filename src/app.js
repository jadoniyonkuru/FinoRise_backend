require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import routes
const authRoutes = require('./modules/auth/auth.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🚀 FinoRise API is running!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes);

module.exports = app;