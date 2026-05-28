const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('../users/user.model');

/**
 * XPTransaction Model
 * -------------------
 * Logs every XP event that happens on the platform.
 * XP is NEVER changed directly on the users table without
 * first logging it here. This gives us a full audit trail
 * of every XP event for analytics and debugging.
 *
 * source_type tells us WHERE the XP came from:
 * - quiz        → user passed a quiz
 * - simulation  → user completed a simulation
 * - streak      → user maintained a daily streak
 * - achievement → user earned a badge
 */
const XPTransaction = sequelize.define('XPTransaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Unique identifier for each XP transaction',
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: User, key: 'id' },
    comment: 'The user who earned or lost the XP',
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'XP amount — positive means earned, negative means deducted',
  },
  source_type: {
    type: DataTypes.ENUM('quiz', 'simulation', 'streak', 'achievement'),
    allowNull: false,
    comment: 'What action triggered this XP event',
  },
  source_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID of the quiz/simulation/achievement that triggered the XP',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Human readable reason e.g. "Completed Budgeting Basics module"',
  },
}, {
  tableName: 'xp_transactions',
  timestamps: true,
  createdAt: 'created_at', // when the XP was awarded
  updatedAt: false,        // XP logs are never updated, only created
});

// Associations
// One user can have many XP transactions over time
User.hasMany(XPTransaction, { foreignKey: 'user_id' });
XPTransaction.belongsTo(User, { foreignKey: 'user_id' });

module.exports = XPTransaction;