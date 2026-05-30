const express = require('express');
const router = express.Router();
const simulationController = require('./simulation.controller');
const { protect } = require('../auth/auth.middleware');

/**
 * Simulation Routes
 * -----------------
 * GET    /api/simulations          → get all simulations
 * GET    /api/simulations/history  → get user attempt history
 * GET    /api/simulations/:id      → get simulation with steps
 * POST   /api/simulations/:id/start  → start a new attempt
 * POST   /api/simulations/submit   → submit a choice at a step
 */
router.get('/', protect, simulationController.getAllSimulations);
router.get('/history', protect, simulationController.getHistory);
router.get('/:id', protect, simulationController.getSimulationById);
router.post('/:id/start', protect, simulationController.startSimulation);
router.post('/submit', protect, simulationController.submitChoice);

module.exports = router;