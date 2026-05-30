const simulationService = require('./simulation.service');

/**
 * getAllSimulations
 * Returns all published simulations
 */
const getAllSimulations = async (req, res) => {
  try {
    const simulations = await simulationService.getAllSimulations();
    res.status(200).json({ simulations });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * getSimulationById
 * Returns a single simulation with all steps and choices
 */
const getSimulationById = async (req, res) => {
  try {
    const simulation = await simulationService.getSimulationById(req.params.id);
    res.status(200).json({ simulation });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/**
 * startSimulation
 * Creates a new attempt and returns the first step
 */
const startSimulation = async (req, res) => {
  try {
    const result = await simulationService.startSimulation(req.user.id, req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * submitChoice
 * Records user choice and returns next step or completion
 */
const submitChoice = async (req, res) => {
  try {
    const { attempt_id, choice_id } = req.body;
    if (!attempt_id || !choice_id) {
      return res.status(400).json({ message: 'attempt_id and choice_id are required' });
    }
    const result = await simulationService.submitChoice(req.user.id, attempt_id, choice_id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * getHistory
 * Returns all completed simulation attempts for user
 */
const getHistory = async (req, res) => {
  try {
    const history = await simulationService.getHistory(req.user.id);
    res.status(200).json({ history });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAllSimulations,
  getSimulationById,
  startSimulation,
  submitChoice,
  getHistory,
};