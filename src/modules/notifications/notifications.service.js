const Notification = require('./notification.model');

/**
 * getNotifications
 * ----------------
 * Returns all notifications for a user.
 * Ordered by most recent first.
 */
const getNotifications = async (userId) => {
  const notifications = await Notification.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
  });
  return notifications;
};

/**
 * markAsRead
 * ----------
 * Marks a single notification as read.
 * Checks the notification belongs to the user
 * before updating to prevent unauthorized access.
 */
const markAsRead = async (userId, notificationId) => {
  const notification = await Notification.findOne({
    where: { id: notificationId, user_id: userId },
  });
  if (!notification) throw new Error('Notification not found');
  await notification.update({ is_read: true });
  return { message: 'Notification marked as read' };
};

/**
 * deleteNotification
 * ------------------
 * Permanently deletes a notification.
 * Checks the notification belongs to the user
 * before deleting to prevent unauthorized access.
 */
const deleteNotification = async (userId, notificationId) => {
  const notification = await Notification.findOne({
    where: { id: notificationId, user_id: userId },
  });
  if (!notification) throw new Error('Notification not found');
  await notification.destroy();
  return { message: 'Notification deleted successfully' };
};

/**
 * createNotification
 * ------------------
 * Used internally by other modules to create notifications.
 * Called automatically when user earns XP, levels up,
 * earns a badge, or redeems a reward.
 *
 * type must be one of:
 * xp_earned | badge_earned | level_up | streak | reward | system
 */
const createNotification = async ({ user_id, title, message, type }) => {
  const notification = await Notification.create({
    user_id,
    title,
    message,
    type,
  });
  return notification;
};

module.exports = {
  getNotifications,
  markAsRead,
  deleteNotification,
  createNotification,
};