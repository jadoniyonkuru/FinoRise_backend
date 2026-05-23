const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('../users/user.model');

const Badge = sequelize.define('Badge', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  badge_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  badge_type: {
    type: DataTypes.ENUM('streak', 'completion', 'simulation', 'special'),
    allowNull: false,
  },
  badge_icon: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  earned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'badges',
  timestamps: false,
});

User.hasMany(Badge, { foreignKey: 'user_id' });
Badge.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Badge;