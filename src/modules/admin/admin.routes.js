const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { protect, adminOnly } = require('../auth/auth.middleware');

// All admin routes are protected + admin only
router.get('/users', protect, adminOnly, adminController.getAllUsers);
router.delete('/users/:id', protect, adminOnly, adminController.deleteUser);
router.get('/analytics', protect, adminOnly, adminController.getAnalytics);

module.exports = router;