const simulationsService = require('./simulation.service');

const getAllSimulations = async (req, res) => {
  try {
    const simulations = await simulationsService.getAllSimulations();
    res.status(200).json({ simulations });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getSimulationById = async (req, res) => {
  try {
    const simulation = await simulationsService.getSimulationById(req.params.id);
    res.status(200).json({ simulation });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const startSimulation = async (req, res) => {
  try {
    const result = await simulationsService.startSimulation(req.user.id, req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const submitDecision = async (req, res) => {
  try {
    const { decision } = req.body;
    if (!decision) return res.status(400).json({ message: 'Decision is required (A, B, C or D)' });
    const result = await simulationsService.submitDecision(req.user.id, req.params.id, decision);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await simulationsService.getHistory(req.user.id);
    res.status(200).json({ history });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAllSimulations,
  getSimulationById,
  startSimulation,
  submitDecision,
  getHistory,
};