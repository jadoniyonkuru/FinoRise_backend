const express = require('express');
const router = express.Router();
const simulationsController = require('./simulation.controller');
const { protect } = require('../auth/auth.middleware');

router.get('/', protect, simulationsController.getAllSimulations);
router.get('/history', protect, simulationsController.getHistory);
router.get('/:id', protect, simulationsController.getSimulationById);
router.post('/:id/start', protect, simulationsController.startSimulation);
router.post('/:id/submit', protect, simulationsController.submitDecision);

module.exports = router;