const Simulation = require('./simulation.model');
const SimulationSession = require('./simulationSession.model');
const User = require('../users/user.model');
const behaviorService = require('../behavioral/behavior.service');

// Get all published simulations
const getAllSimulations = async () => {
  const simulations = await Simulation.findAll({
    where: { is_published: true },
    order: [['created_at', 'DESC']],
  });
  return simulations;
};

// Get single simulation
const getSimulationById = async (simulationId) => {
  const simulation = await Simulation.findByPk(simulationId);
  if (!simulation) throw new Error('Simulation not found');
  return simulation;
};

// Start a simulation session
const startSimulation = async (userId, simulationId) => {
  const simulation = await Simulation.findByPk(simulationId);
  if (!simulation) throw new Error('Simulation not found');

  const session = await SimulationSession.create({
    user_id: userId,
    simulation_id: simulationId,
  });

  return {
    session_id: session.id,
    simulation: {
      id: simulation.id,
      title: simulation.title,
      description: simulation.description,
      category: simulation.category,
      difficulty: simulation.difficulty,
      choices: simulation.choices,
      xp_reward: simulation.xp_reward,
    },
  };
};

// Submit a decision
const submitDecision = async (userId, simulationId, decision) => {
  const simulation = await Simulation.findByPk(simulationId);
  if (!simulation) throw new Error('Simulation not found');

  const session = await SimulationSession.findOne({
    where: { user_id: userId, simulation_id: simulationId, is_completed: false },
  });
  if (!session) throw new Error('No active session found. Please start the simulation first');

  const is_correct = decision === simulation.correct_choice;
  const xp_awarded = is_correct ? simulation.xp_reward : Math.floor(simulation.xp_reward / 2);

  // Update session
  await session.update({
    decision,
    is_correct,
    ai_feedback: simulation.feedback,
    xp_awarded,
    is_completed: true,
  });

  // Award XP to user
  const user = await User.findByPk(userId);
  await user.update({ xp_total: user.xp_total + xp_awarded });

  // Log behavior event for analytics
  await behaviorService.logBehaviorEvent(userId, 'simulation_decision', {
    category: simulation.category,
    difficulty: simulation.difficulty,
    is_correct,
    meta: { simulation_id: simulationId, decision },
  });

  return {
    is_correct,
    your_choice: decision,
    correct_choice: simulation.correct_choice,
    feedback: simulation.feedback,
    xp_awarded,
    message: is_correct
      ? '✅ Correct! Well done!'
      : `❌ Not quite. The correct answer was ${simulation.correct_choice}`,
  };
};

// Get simulation history
const getHistory = async (userId) => {
  const sessions = await SimulationSession.findAll({
    where: { user_id: userId, is_completed: true },
    include: [{
      model: Simulation,
      attributes: ['title', 'category', 'difficulty'],
    }],
    order: [['started_at', 'DESC']],
  });
  return sessions;
};

module.exports = {
  getAllSimulations,
  getSimulationById,
  startSimulation,
  submitDecision,
  getHistory,
};