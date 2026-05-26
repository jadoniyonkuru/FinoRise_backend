const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Insight = sequelize.define('Insight', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  insight_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  insight_type: {
    type: DataTypes.ENUM(
      'spending',
      'risk',
      'consistency',
      'decision_pattern',
      'improvement'
    ),
    allowNull: false,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'insights',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Insight;