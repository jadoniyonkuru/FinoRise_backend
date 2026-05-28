const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('../users/user.model');
const Reward = require('./reward.model');

/**
 * Redemption Model
 * ----------------
 * Records every reward redemption made by a user.
 * When a user redeems a reward:
 * 1. XP is deducted from their account
 * 2. A redemption record is created here
 * 3. A unique redemption_code is generated and sent to the user
 * 4. Status starts as 'pending' until reward is delivered
 *
 * Status flow:
 * pending   → confirmed  (redemption confirmed)
 * confirmed → delivered  (reward sent successfully)
 * confirmed → failed     (something went wrong)
 * confirmed → expired    (reward expired before delivery)
 * confirmed → used       (user has used the reward)
 */
const Redemption = sequelize.define('Redemption', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Unique identifier for each redemption record',
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: User, key: 'id' },
    comment: 'The user who made the redemption',
  },
  reward_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Reward, key: 'id' },
    comment: 'The reward that was redeemed',
  },
  xp_spent: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'XP deducted from user at time of redemption',
  },
  redemption_code: {
    type: DataTypes.STRING(60),
    allowNull: true,
    comment: 'Unique code sent to user to claim their reward',
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'used', 'expired', 'delivered', 'failed'),
    defaultValue: 'pending',
    comment: 'Current delivery status of the redemption',
  },
}, {
  tableName: 'redemptions',
  timestamps: true,
  createdAt: 'created_at',  // maps to created_at column in DB
  updatedAt: 'updated_at',  // maps to updated_at column in DB
});

// Associations
// One user can have many redemptions over time
User.hasMany(Redemption, { foreignKey: 'user_id' });
Redemption.belongsTo(User, { foreignKey: 'user_id' });

// One reward can be redeemed many times by different users
Reward.hasMany(Redemption, { foreignKey: 'reward_id' });
Redemption.belongsTo(Reward, { foreignKey: 'reward_id' });

module.exports = Redemption;