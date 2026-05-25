const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Redemption = sequelize.define('Redemption', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  reward_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  redemption_code: {
    type: DataTypes.STRING(60),
    allowNull: false,
    unique: true,
  },
  xp_spent: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'used', 'expired'),
    defaultValue: 'confirmed',
  },
}, {
  tableName: 'redemptions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Redemption;