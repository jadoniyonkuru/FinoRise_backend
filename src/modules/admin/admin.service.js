const User = require('../users/user.model');
const Badge = require('../gamification/badge.model');
const authService = require('../auth/auth.service');

const getAllUsers = async () => {
  return User.findAll({
    attributes: { exclude: ['password_hash'] },
    order: [['created_at', 'DESC']],
  });
};

const deleteUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');
  await user.destroy();
  return { message: 'User deleted successfully' };
};

const updateUser = async (userId, { full_name, email, role, account_status }) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');
  const updates = {};
  if (full_name !== undefined) updates.full_name = full_name;
  if (email !== undefined) updates.email = email;
  if (role !== undefined) updates.role = role;
  if (account_status !== undefined) updates.account_status = account_status;
  await user.update(updates);
  const { password_hash, ...safe } = user.get({ plain: true });
  return { user: safe };
};

const inviteUser = async ({ full_name, email, role }, req) => {
  const frontendUrl = req.headers.origin || process.env.FRONTEND_URL;
  return authService.inviteUser({ full_name, email, role }, frontendUrl);
};

const resendInvite = async (userId, req) => {
  const frontendUrl = req.headers.origin || process.env.FRONTEND_URL;
  return authService.resendInvite(userId, frontendUrl);
};

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

  return { total_users: totalUsers, total_admins: totalAdmins, total_learners: totalLearners, total_badges_awarded: totalBadges, top_users: topUsers };
};

module.exports = { getAllUsers, deleteUser, updateUser, inviteUser, resendInvite, getAnalytics };
