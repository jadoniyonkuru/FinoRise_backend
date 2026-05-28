const express = require('express');
const router = express.Router();
const notificationsController = require('./notifications.controller');
const { protect } = require('../auth/auth.middleware');

/**
 * Notifications Routes
 * --------------------
 * All routes are protected — user must be logged in.
 *
 * GET    /api/notifications        → get all notifications
 * PUT    /api/notifications/:id/read → mark as read
 * DELETE /api/notifications/:id    → delete notification
 */
router.get('/', protect, notificationsController.getNotifications);
router.put('/:id/read', protect, notificationsController.markAsRead);
router.delete('/:id', protect, notificationsController.deleteNotification);

module.exports = router;