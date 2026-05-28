const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Simulation = require('./simulation.model');

/**
 * SimStep Model
 * -------------
 * Represents a single step in a simulation decision tree.
 * Each simulation has multiple steps connected through choices.
 * 
 * Example flow:
 * Step 1 (is_first_step: true) → user picks choice A → Step 2
 * Step 2 → user picks choice B → Step 3
 * Step 3 → next_step_id is null → simulation ends
 */
const SimStep = sequelize.define('SimStep', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Unique identifier for each step',
  },
  simulation_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Simulation, key: 'id' },
    comment: 'The simulation this step belongs to',
  },
  step_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Order of this step in the simulation tree',
  },
  scenario_text: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'The situation described to the user at this step',
  },
  is_first_step: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'True only for the entry point of the simulation',
  },
}, {
  tableName: 'sim_steps',
  timestamps: false, // steps don't need timestamps
});

// One simulation has many steps
Simulation.hasMany(SimStep, { foreignKey: 'simulation_id' });
SimStep.belongsTo(Simulation, { foreignKey: 'simulation_id' });

module.exports = SimStep;