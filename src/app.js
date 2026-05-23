require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./modules/auth/auth.routes');
const gamificationRoutes = require('./modules/gamification/gamification.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'FinoRise API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes);
app.use('/api/gamification', gamificationRoutes);

module.exports = app;
