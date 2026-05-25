require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./modules/auth/auth.routes');
const gamificationRoutes = require('./modules/gamification/gamification.routes');
const adminRoutes = require('./modules/admin/admin.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ message: 'FinoRise API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/modules', require('./modules/learning/module.routes'));
app.use('/api/admin', adminRoutes);
app.use('/api/rewards', require('./modules/rewards/reward.routes'));

module.exports = app;
