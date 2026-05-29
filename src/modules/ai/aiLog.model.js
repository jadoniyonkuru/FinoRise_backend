const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const AiLog = sequelize.define('AiLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  prompt: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  feature: {
    type: DataTypes.ENUM(
      'qa',
      'simulation_explanation',
      'recommendations',
      'learning_guidance'
    ),
    allowNull: false,
  },
}, {
  tableName: 'ai_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = AiLog;