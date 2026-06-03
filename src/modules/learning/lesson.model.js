const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Module = require('./module.model');

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  module_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Module, key: 'id' },
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  order_index: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  video_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: null,
  },
}, {
  tableName: 'lessons',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

Module.hasMany(Lesson, { foreignKey: 'module_id' });
Lesson.belongsTo(Module, { foreignKey: 'module_id' });

module.exports = Lesson;
