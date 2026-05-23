require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

require('./modules/users/user.model');
require('./modules/gamification/badge.model');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({ alter: true });
    console.log('Tables synced');

    app.listen(PORT, () => {
      console.log(`FinoRise server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start:', err.message);
    process.exit(1);
  }
};

start();
