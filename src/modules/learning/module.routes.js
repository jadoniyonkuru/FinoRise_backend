const express = require('express');
const router = express.Router();
const moduleController = require('./module.controller');
const { protect, adminOnly } = require('../auth/auth.middleware');

// Public routes — any logged in user can access
router.get('/', protect, moduleController.getAllModules);
router.get('/:id', protect, moduleController.getModuleById);

// Admin only routes
router.post('/', protect, adminOnly, moduleController.createModule);
router.put('/:id', protect, adminOnly, moduleController.updateModule);
router.delete('/:id', protect, adminOnly, moduleController.deleteModule);

module.exports = router;