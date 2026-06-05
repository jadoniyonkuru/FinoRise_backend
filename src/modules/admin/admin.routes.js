const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { protect, adminOnly } = require('../auth/auth.middleware');

router.get('/users', protect, adminOnly, adminController.getAllUsers);
router.post('/users/invite', protect, adminOnly, adminController.inviteUser);
router.put('/users/:id', protect, adminOnly, adminController.updateUser);
router.post('/users/:id/resend-invite', protect, adminOnly, adminController.resendInvite);
router.delete('/users/:id', protect, adminOnly, adminController.deleteUser);
router.get('/analytics', protect, adminOnly, adminController.getAnalytics);

module.exports = router;
