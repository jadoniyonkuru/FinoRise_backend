const Simulation = require('./simulation.model');
const SimStep = require('./simStep.model');
const SimChoice = require('./simChoice.model');
const SimulationAttempt = require('./simulationAttempt.model');
const SimAttemptStep = require('./simAttemptStep.model');
const User = require('../users/user.model');
const behaviorService = require('../behavioral/behavior.service');

/**
 * getAllSimulations
 * ----------------
 * Returns all published simulations from the database.
 * Only published simulations are visible to learners.
 * Ordered by most recently created first.
 */
const getAllSimulations = async () => {
  const simulations = await Simulation.findAll({
    where: { is_published: true },
    order: [['created_at', 'DESC']],
  });
  return simulations;
};

/**
 * getSimulationById
 * -----------------
 * Returns a single simulation with all its steps and choices.
 * Steps are ordered by step_number so they appear in the
 * correct order in the frontend.
 */
const getSimulationById = async (simulationId) => {
  const simulation = await Simulation.findByPk(simulationId, {
    include: [{
      model: SimStep,
      include: [{ model: SimChoice }],
      order: [['step_number', 'ASC']],
    }],
  });
  if (!simulation) throw new Error('Simulation not found');
  return simulation;
};

/**
 * startSimulation
 * ---------------
 * Creates a new simulation attempt for the user.
 * Also fetches and returns the first step so the
 * frontend can immediately show the first scenario.
 */
const startSimulation = async (userId, simulationId) => {
  const simulation = await Simulation.findByPk(simulationId);
  if (!simulation) throw new Error('Simulation not found');

  // Check if user already has an active attempt
  const existingAttempt = await SimulationAttempt.findOne({
    where: { user_id: userId, simulation_id: simulationId, status: 'in_progress' },
  });

  // If active attempt exists return it instead of creating a new one
  if (existingAttempt) {
    const firstStep = await SimStep.findOne({
      where: { simulation_id: simulationId, is_first_step: true },
      include: [{ model: SimChoice }],
    });
    return {
      attempt_id: existingAttempt.id,
      message: 'Resuming existing attempt',
      simulation: {
        id: simulation.id,
        title: simulation.title,
        description: simulation.description,
        category: simulation.category,
        difficulty: simulation.difficulty,
        xp_reward: simulation.xp_reward,
      },
      current_step: firstStep,
    };
  }

  // Create a new attempt
  const attempt = await SimulationAttempt.create({
    user_id: userId,
    simulation_id: simulationId,
    status: 'in_progress',
    xp_earned: 0,
  });

  // Get the first step to show the user
  const firstStep = await SimStep.findOne({
    where: { simulation_id: simulationId, is_first_step: true },
    include: [{ model: SimChoice }],
  });

  return {
    attempt_id: attempt.id,
    message: 'Simulation started',
    simulation: {
      id: simulation.id,
      title: simulation.title,
      description: simulation.description,
      category: simulation.category,
      difficulty: simulation.difficulty,
      xp_reward: simulation.xp_reward,
    },
    current_step: firstStep,
  };
};

/**
 * submitChoice
 * ------------
 * Records the user's choice at a specific step.
 * Then returns the next step if there is one,
 * or completes the simulation if next_step_id is null.
 *
 * Flow:
 * 1. Find the attempt and the choice selected
 * 2. Record the choice in sim_attempt_steps
 * 3. If next_step_id exists → return next step
 * 4. If next_step_id is null → complete the attempt
 * 5. Award XP and log behavior event on completion
 */
const submitChoice = async (userId, attemptId, choiceId) => {
  // Find the active attempt
  const attempt = await SimulationAttempt.findOne({
    where: { id: attemptId, user_id: userId, status: 'in_progress' },
  });
  if (!attempt) throw new Error('No active attempt found. Please start the simulation first');

  // Find the choice the user selected
  const choice = await SimChoice.findByPk(choiceId, {
    include: [{ model: SimStep }],
  });
  if (!choice) throw new Error('Choice not found');

  // Record this choice in sim_attempt_steps
  await SimAttemptStep.create({
    attempt_id: attemptId,
    step_id: choice.step_id,
    choice_id: choiceId,
  });

  // Update attempt score based on financial impact of choice
  const newScore = (attempt.score || 0) + choice.financial_impact;
  const newXP = attempt.xp_earned + choice.xp_bonus;

  await attempt.update({
    score: newScore,
    xp_earned: newXP,
  });

  // Check if this choice leads to another step
  if (choice.next_step_id) {
    // Simulation continues — return next step
    const nextStep = await SimStep.findByPk(choice.next_step_id, {
      include: [{ model: SimChoice }],
    });

    return {
      status: 'in_progress',
      outcome: choice.outcome_text,
      financial_impact: choice.financial_impact,
      xp_bonus: choice.xp_bonus,
      next_step: nextStep,
    };
  }

  // No next step — simulation is complete
  const simulation = await Simulation.findByPk(attempt.simulation_id);
  const totalXP = newXP + simulation.xp_reward;

  // Mark attempt as completed
  await attempt.update({
    status: 'completed',
    score: newScore,
    xp_earned: totalXP,
    completed_at: new Date(),
  });

  // Award XP to user
  const user = await User.findByPk(userId);
  await user.update({ xp_total: user.xp_total + totalXP });

  // Log behavior event for analytics
  await behaviorService.logBehaviorEvent(userId, 'simulation_decision',  {
    category: simulation.category,
    difficulty: simulation.difficulty,
    score: newScore,
    meta: { simulation_id: simulation.id, attempt_id: attemptId },
  });

  return {
    status: 'completed',
    outcome: choice.outcome_text,
    financial_impact: choice.financial_impact,
    final_score: newScore,
    xp_earned: totalXP,
    message: newScore >= 0
      ? '🎉 Great job! You made smart financial decisions!'
      : '📚 Good effort! Review your choices to improve next time.',
  };
};

/**
 * getHistory
 * ----------
 * Returns all completed simulation attempts for a user.
 * Includes simulation details so frontend can display
 * title, category and difficulty for each attempt.
 */
const getHistory = async (userId) => {
  const attempts = await SimulationAttempt.findAll({
    where: { user_id: userId, status: 'completed' },
    include: [{
      model: Simulation,
      attributes: ['title', 'category', 'difficulty'],
    }],
    order: [['started_at', 'DESC']],
  });
  return attempts;
};

const createSimulation = async (data, userId) => {
  return Simulation.create({ ...data, created_by: userId });
};

const updateSimulation = async (simulationId, data) => {
  const simulation = await Simulation.findByPk(simulationId);
  if (!simulation) throw new Error('Simulation not found');
  await simulation.update(data);
  return simulation;
};

const deleteSimulation = async (simulationId) => {
  const simulation = await Simulation.findByPk(simulationId);
  if (!simulation) throw new Error('Simulation not found');
  await simulation.destroy();
  return { message: 'Simulation deleted' };
};

module.exports = {
  getAllSimulations,
  getSimulationById,
  startSimulation,
  submitChoice,
  getHistory,
  createSimulation,
  updateSimulation,
  deleteSimulation,
};