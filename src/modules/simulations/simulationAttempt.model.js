const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('../users/user.model');
const Simulation = require('./simulation.model');

/**
 * SimulationAttempt Model
 * -----------------------
 * Records each time a user runs through a simulation
 * from start to finish.
 *
 * Status flow:
 * in_progress → completed  (user finished all steps)
 * in_progress → abandoned  (user left without finishing)
 *
 * score = final score based on financial_impact of choices made
 * xp_earned = total XP awarded at the end of the attempt
 */
const SimulationAttempt = sequelize.define('SimulationAttempt', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Unique identifier for each attempt',
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: User, key: 'id' },
    comment: 'The user who is attempting this simulation',
  },
  simulation_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Simulation, key: 'id' },
    comment: 'The simulation being attempted',
  },
  status: {
    type: DataTypes.ENUM('in_progress', 'completed', 'abandoned'),
    defaultValue: 'in_progress',
    comment: 'Current status of this attempt',
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Final score calculated from all choices made',
  },
  xp_earned: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Total XP awarded when attempt was completed',
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp of when the attempt was completed',
  },
}, {
  tableName: 'simulation_attempts',
  timestamps: true,
  createdAt: 'started_at', // when attempt began
  updatedAt: false,
});

// One user can have many simulation attempts
User.hasMany(SimulationAttempt, { foreignKey: 'user_id' });
SimulationAttempt.belongsTo(User, { foreignKey: 'user_id' });

// One simulation can have many attempts by different users
Simulation.hasMany(SimulationAttempt, { foreignKey: 'simulation_id' });
SimulationAttempt.belongsTo(Simulation, { foreignKey: 'simulation_id' });

module.exports = SimulationAttempt;