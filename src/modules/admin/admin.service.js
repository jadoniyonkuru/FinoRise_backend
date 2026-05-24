const User = require('../users/user.model');
const Badge = require('../gamification/badge.model');

// Get all users
const getAllUsers = async () => {
  const users = await User.findAll({
    attributes: { exclude: ['password_hash'] },
    order: [['created_at', 'DESC']],
  });
  return users;
};

// Delete a user
const deleteUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');
  await user.destroy();
  return { message: 'User deleted successfully' };
};

// Get platform analytics
const getAnalytics = async () => {
  const totalUsers = await User.count();
  const totalAdmins = await User.count({ where: { role: 'admin' } });
  const totalLearners = await User.count({ where: { role: 'learner' } });
  const totalBadges = await Badge.count();

  const topUsers = await User.findAll({
    attributes: ['id', 'full_name', 'email', 'xp_total', 'level'],
    order: [['xp_total', 'DESC']],
    limit: 5,
  });

  return {
    total_users: totalUsers,
    total_admins: totalAdmins,
    total_learners: totalLearners,
    total_badges_awarded: totalBadges,
    top_users: topUsers,
  };
};

module.exports = { getAllUsers, deleteUser, getAnalytics };