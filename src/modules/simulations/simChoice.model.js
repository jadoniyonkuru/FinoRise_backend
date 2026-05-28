const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const SimStep = require('./simStep.model');

/**
 * SimChoice Model
 * ---------------
 * Represents a choice available to the user at each step.
 * Each step has multiple choices and each choice points
 * to the next step (branching) or ends the simulation.
 *
 * next_step_id = null means this choice ends the simulation.
 * financial_impact = positive means good financial decision.
 * financial_impact = negative means bad financial decision.
 * xp_bonus = extra XP awarded for making this choice.
 */
const SimChoice = sequelize.define('SimChoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Unique identifier for each choice',
  },
  step_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: SimStep, key: 'id' },
    comment: 'The step this choice belongs to',
  },
  choice_text: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'The decision option shown to the user',
  },
  outcome_text: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Feedback shown to user after selecting this choice',
  },
  next_step_id: {
    type: DataTypes.UUID,
    allowNull: true, // null means simulation ends here
    comment: 'Points to next step — null means end of simulation',
  },
  financial_impact: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Score impact — positive is good, negative is bad',
  },
  xp_bonus: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Bonus XP awarded when user selects this choice',
  },
}, {
  tableName: 'sim_choices',
  timestamps: false, // choices don't need timestamps
});

// One step has many choices
SimStep.hasMany(SimChoice, { foreignKey: 'step_id' });
SimChoice.belongsTo(SimStep, { foreignKey: 'step_id' });

module.exports = SimChoice;