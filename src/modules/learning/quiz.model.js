const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Module = require('./module.model');

const QuizQuestion = sequelize.define('QuizQuestion', {
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
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  options: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: 'Array of answer option strings, e.g. ["Save it","Spend it","Invest it","Ignore it"]',
  },
  correct_answer: {
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: 'Must exactly match one of the options values',
  },
  xp_reward: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  },
}, {
  tableName: 'quiz_questions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

Module.hasMany(QuizQuestion, { foreignKey: 'module_id' });
QuizQuestion.belongsTo(Module, { foreignKey: 'module_id' });

module.exports = QuizQuestion;
