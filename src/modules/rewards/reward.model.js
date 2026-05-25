const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Reward = sequelize.define('Reward', {
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
    allowNull: true,
  },
  reward_type: {
    type: DataTypes.ENUM('airtime', 'discount', 'voucher', 'partner_offer'),
    allowNull: false,
  },
  xp_cost: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  valid_until: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'rewards',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Reward;