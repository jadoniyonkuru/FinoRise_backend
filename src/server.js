require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

require('./modules/users/user.model');

// ── Gamification ─────────────────────────────
require('./modules/gamification/badge.model');

// ── Learning Modules ──────────────────────────
// (built by partner)

// ── Simulations ───────────────────────────────
require('./modules/simulations/simulation.model');
require('./modules/simulations/simulationSession.model');
require('./modules/simulations/simStep.model');
require('./modules/simulations/simChoice.model');
require('./modules/simulations/simulationAttempt.model');
require('./modules/simulations/simAttemptStep.model');

// ── Rewards ───────────────────────────────────
require('./modules/rewards/reward.model');
require('./modules/rewards/redemption.model');

// ── Notifications ─────────────────────────────
require('./modules/notifications/notification.model');

// ── Admin ─────────────────────────────────────
// (no model needed, uses existing models)

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync();
    console.log('Tables synced');

    app.listen(PORT, () => {
      console.log(`🚀 FinoRise server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start:', err.message);
    process.exit(1);
  }
};

start();