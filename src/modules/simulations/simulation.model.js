const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Simulation = sequelize.define('Simulation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('budgeting', 'loan', 'emergency', 'debt', 'investing'),
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: false,
  },
  xp_reward: {
    type: DataTypes.INTEGER,
    defaultValue: 150,
  },
  choices: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },
  correct_choice: {
    type: DataTypes.STRING(1),
    allowNull: true,
    defaultValue: null,
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Optional: user who created the simulation',
    references: { model: 'users', key: 'id' },
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'simulations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Simulation;