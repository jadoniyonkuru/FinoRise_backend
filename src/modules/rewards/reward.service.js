const Reward = require('./reward.model');
const Redemption = require('./redemption.model');
const User = require('../users/user.model');

// Get all active rewards
const getAllRewards = async () => {
  return await Reward.findAll({
    where: { is_active: true },
    order: [['xp_cost', 'ASC']],
  });
};

// Get single reward
const getRewardById = async (id) => {
  const reward = await Reward.findByPk(id);
  if (!reward) throw new Error('Reward not found');
  return reward;
};

// Create reward (admin only)
const createReward = async (data) => {
  return await Reward.create(data);
};

// Redeem a reward
const redeemReward = async (userId, rewardId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  const reward = await Reward.findByPk(rewardId);
  if (!reward) throw new Error('Reward not found');

  if (!reward.is_active)
    throw new Error('Reward is no longer available');

  if (reward.valid_until && new Date() > new Date(reward.valid_until))
    throw new Error('Reward has expired');

  if (reward.quantity !== null && reward.quantity <= 0)
    throw new Error('Reward is out of stock');

  if (user.xp_total < reward.xp_cost)
    throw new Error(`Not enough XP. You need ${reward.xp_cost} XP but have ${user.xp_total} XP`);

  // Store XP values before update (fixes double-deduction bug)
  const xpBefore = user.xp_total;
  const xpAfter = xpBefore - reward.xp_cost;

  await user.update({ xp_total: xpAfter });

  if (reward.quantity !== null) {
    await reward.update({ quantity: reward.quantity - 1 });
  }

  const redemptionCode = `FNR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // Persist the redemption record
  const redemption = await Redemption.create({
    user_id: userId,
    reward_id: rewardId,
    redemption_code: redemptionCode,
    xp_spent: reward.xp_cost,
  });

  return {
    message: 'Reward redeemed successfully',
    redemption_code: redemptionCode,
    redemption_id: redemption.id,
    reward_title: reward.title,
    xp_spent: reward.xp_cost,
    xp_remaining: xpAfter,
  };
};

// Delete reward (admin only)
const deleteReward = async (id) => {
  const reward = await Reward.findByPk(id);
  if (!reward) throw new Error('Reward not found');
  await reward.destroy();
  return { message: 'Reward deleted' };
};

// Get redemption history for logged-in user
const getUserRedemptions = async (userId) => {
  return await Redemption.findAll({
    where: { user_id: userId },
    include: [{ model: Reward, attributes: ['title', 'reward_type'] }],
    order: [['created_at', 'DESC']],
  });
};

module.exports = {
  getAllRewards,
  getRewardById,
  createReward,
  redeemReward,
  deleteReward,
  getUserRedemptions,
};