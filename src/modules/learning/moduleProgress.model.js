const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Module = require('./module.model');

const ModuleProgress = sequelize.define('ModuleProgress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  module_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Module, key: 'id' },
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    comment: 'Quiz score percentage 0-100, null if no quiz taken',
  },
}, {
  tableName: 'module_progress',
  timestamps: false,
  indexes: [{ unique: true, fields: ['user_id', 'module_id'] }],
});

Module.hasMany(ModuleProgress, { foreignKey: 'module_id' });
ModuleProgress.belongsTo(Module, { foreignKey: 'module_id' });

module.exports = ModuleProgress;
