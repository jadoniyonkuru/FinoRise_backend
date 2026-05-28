const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('../users/user.model');

/**
 * Notification Model
 * ------------------
 * Stores all notifications sent to users on the platform.
 * 
 * Type tells us what triggered the notification:
 * - xp_earned:   user earned XP from any action
 * - badge_earned: user earned a new badge
 * - level_up:    user reached a new level
 * - streak:      user maintained a daily streak
 * - reward:      reward redeemed or delivered
 * - system:      general platform notification
 */
const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Unique identifier for each notification',
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: User, key: 'id' },
    comment: 'The user who receives this notification',
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'Short headline of the notification',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Full notification message body',
  },
  type: {
    type: DataTypes.ENUM('xp_earned', 'badge_earned', 'level_up', 'streak', 'reward', 'system'),
    allowNull: false,
    comment: 'What triggered this notification',
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether the user has read this notification',
  },
}, {
  tableName: 'notifications',
  timestamps: true,
  createdAt: 'created_at', // when notification was created
  updatedAt: false,         // notifications are never updated
});

// One user can have many notifications
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Notification;