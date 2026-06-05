const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  full_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: true,
  },
  password_hash: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('learner', 'admin', 'partner', 'module_manager', 'simulation_manager', 'rewards_manager', 'analytics_viewer'),
    defaultValue: 'learner',
  },
  account_status: {
    type: DataTypes.ENUM('active', 'disabled', 'pending_invite'),
    defaultValue: 'active',
  },
  average_quiz_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  xp_total: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  streak_days: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  last_active: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = User;
