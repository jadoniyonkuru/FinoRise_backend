const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const SimulationAttempt = require('./simulationAttempt.model');
const SimStep = require('./simStep.model');
const SimChoice = require('./simChoice.model');

/**
 * SimAttemptStep Model
 * --------------------
 * Records which choice a user made at each step
 * during a simulation attempt.
 *
 * This is used for:
 * - Behavioral analytics (what decisions does the user make?)
 * - Replay (show user what choices they made)
 * - AI insights (detect decision patterns over time)
 *
 * One row is created every time a user submits a choice at a step.
 */
const SimAttemptStep = sequelize.define('SimAttemptStep', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Unique identifier for each step record',
  },
  attempt_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: SimulationAttempt, key: 'id' },
    comment: 'The simulation attempt this step belongs to',
  },
  step_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: SimStep, key: 'id' },
    comment: 'The step the user was on',
  },
  choice_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: SimChoice, key: 'id' },
    comment: 'The choice the user selected at this step',
  },
}, {
  tableName: 'sim_attempt_steps',
  timestamps: true,
  createdAt: 'chosen_at', // when the choice was made
  updatedAt: false,
});

// One attempt has many step records
SimulationAttempt.hasMany(SimAttemptStep, { foreignKey: 'attempt_id' });
SimAttemptStep.belongsTo(SimulationAttempt, { foreignKey: 'attempt_id' });

module.exports = SimAttemptStep;