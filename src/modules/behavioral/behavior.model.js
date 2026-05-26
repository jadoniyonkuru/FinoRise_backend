const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const BehaviorEvent = sequelize.define('BehaviorEvent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  event_type: {
    type: DataTypes.ENUM(
      'simulation_decision',
      'module_completed',
      'reward_redeemed',
      'streak_achieved'
    ),
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM(
      'budgeting',
      'loan',
      'emergency',
      'debt',
      'investing',
      'general'
    ),
    allowNull: false,
    defaultValue: 'general',
  },
  is_correct: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  difficulty: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: true,
  },
  meta: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  tableName: 'behavior_events',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = BehaviorEvent;