const Reward = require('./reward.model');
const Redemption = require('./redemption.model');
const User = require('../users/user.model');
const { Op } = require('sequelize');

/**
 * getAllRewards
 * ------------
 * Returns all active rewards from the catalog.
 * Ordered by XP cost so cheapest rewards appear first.
 * Only active rewards are shown to users.
 */
const getAllRewards = async () => {
  const rewards = await Reward.findAll({
    where: { is_active: true },
    order: [['xp_cost', 'ASC']],
  });
  return rewards;
};

/**
 * getEligibleRewards
 * ------------------
 * Returns only rewards the user can afford with their current XP.
 * Also returns the user's current XP balance so the
 * frontend can show how much XP they have left.
 */
const getEligibleRewards = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['xp_total'],
  });
  if (!user) throw new Error('User not found');

  const rewards = await Reward.findAll({
    where: {
      is_active: true,
      xp_cost: { [Op.lte]: user.xp_total },
    },
    order: [['xp_cost', 'ASC']],
  });

  return { xp_total: user.xp_total, eligible_rewards: rewards };
};

/**
 * redeemReward
 * ------------
 * Handles the full reward redemption flow:
 * 1. Validates the user exists and has enough XP
 * 2. Checks reward is active, in stock, and not expired
 * 3. Deducts XP from user account
 * 4. Reduces reward quantity if not unlimited (-1 = unlimited)
 * 5. Generates a unique redemption code for the user
 * 6. Creates a redemption record with status 'pending'
 *
 * Note: quantity = -1 means unlimited stock
 * Note: valid_until = null means no expiry
 */
const redeemReward = async (userId, rewardId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  const reward = await Reward.findByPk(rewardId);
  if (!reward) throw new Error('Reward not found');

  // Check if reward is still active
  if (!reward.is_active) {
    throw new Error('Reward is no longer available');
  }

  // Check if reward has expired
  if (reward.valid_until && new Date() > new Date(reward.valid_until)) {
    throw new Error('Reward has expired');
  }

  // Check if reward is out of stock
  // quantity = -1 means unlimited so skip the check
  if (reward.quantity !== -1 && reward.quantity <= 0) {
    throw new Error('Reward is out of stock');
  }

  // Check if user has enough XP to redeem
  if (user.xp_total < reward.xp_cost) {
    throw new Error(
      `Not enough XP. You need ${reward.xp_cost} XP but have ${user.xp_total} XP`
    );
  }

  // Generate a unique redemption code for this user
  // Format: FINO-USERID(4chars)-TIMESTAMP
  const redemption_code = `FINO-${userId.slice(0, 4).toUpperCase()}-${Date.now()}`;

  // Deduct XP from user account
  await user.update({ xp_total: user.xp_total - reward.xp_cost });

  // Reduce quantity by 1 if reward has limited stock
  if (reward.quantity !== -1) {
    await reward.update({ quantity: reward.quantity - 1 });
  }

  // Create the redemption record in the database
  const redemption = await Redemption.create({
    user_id: userId,
    reward_id: rewardId,
    xp_spent: reward.xp_cost,
    redemption_code,
    status: 'confirmed',
  });

  return {
    message: 'Reward redeemed successfully',
    redemption_id: redemption.id,
    reward: reward.title,
    redemption_code,
    xp_spent: reward.xp_cost,
    xp_remaining: user.xp_total - reward.xp_cost,
    status: 'confirmed',
  };
};

/**
 * getRedemptionHistory
 * --------------------
 * Returns all past redemptions for a user.
 * Includes reward details (title, type, partner)
 * so the frontend can display full redemption history.
 * Ordered by most recent first.
 */
const getRedemptionHistory = async (userId) => {
  const redemptions = await Redemption.findAll({
    where: { user_id: userId },
    include: [{
      model: Reward,
      attributes: ['title', 'reward_type'],
    }],
   order: [['created_at', 'DESC']],
  });
  return redemptions;
};

module.exports = {
  getAllRewards,
  getEligibleRewards,
  redeemReward,
  getRedemptionHistory,
};