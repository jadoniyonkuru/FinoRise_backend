const notificationsService = require('./notifications.service');

/**
 * getNotifications
 * ----------------
 * Returns all notifications for the logged in user.
 * Most recent notifications appear first.
 */
const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationsService.getNotifications(req.user.id);
    res.status(200).json({ notifications });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * markAsRead
 * ----------
 * Marks a single notification as read.
 * Only the owner of the notification can mark it as read.
 */
const markAsRead = async (req, res) => {
  try {
    const result = await notificationsService.markAsRead(req.user.id, req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/**
 * deleteNotification
 * ------------------
 * Deletes a notification permanently.
 * Only the owner of the notification can delete it.
 */
const deleteNotification = async (req, res) => {
  try {
    const result = await notificationsService.deleteNotification(req.user.id, req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports = { getNotifications, markAsRead, deleteNotification };