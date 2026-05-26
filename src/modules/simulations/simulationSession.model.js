const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('../users/user.model');
const Simulation = require('./simulation.model');

const SimulationSession = sequelize.define('SimulationSession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
  simulation_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Simulation, key: 'id' },
  },
  decision: {
    type: DataTypes.STRING(1),
    allowNull: true,
  },
  is_correct: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  ai_feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  xp_awarded: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'simulation_sessions',
  timestamps: true,
  createdAt: 'started_at',
  updatedAt: false,
});

User.hasMany(SimulationSession, { foreignKey: 'user_id' });
SimulationSession.belongsTo(User, { foreignKey: 'user_id' });

Simulation.hasMany(SimulationSession, { foreignKey: 'simulation_id' });
SimulationSession.belongsTo(Simulation, { foreignKey: 'simulation_id' });

module.exports = SimulationSession;