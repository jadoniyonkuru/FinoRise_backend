const rewardService = require('./reward.service');

const getAllRewards = async (req, res) => {
  try {
    const rewards = await rewardService.getAllRewards();
    res.status(200).json({ success: true, data: rewards });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getRewardById = async (req, res) => {
  try {
    const reward = await rewardService.getRewardById(req.params.id);
    res.status(200).json({ success: true, data: reward });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const createReward = async (req, res) => {
  try {
    const reward = await rewardService.createReward(req.body);
    res.status(201).json({ success: true, data: reward });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const redeemReward = async (req, res) => {
  try {
    const result = await rewardService.redeemReward(req.user.id, req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteReward = async (req, res) => {
  try {
    const result = await rewardService.deleteReward(req.params.id);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getUserRedemptions = async (req, res) => {
  try {
    const redemptions = await rewardService.getUserRedemptions(req.user.id);
    res.status(200).json({ success: true, data: redemptions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllRewards,
  getRewardById,
  createReward,
  redeemReward,
  deleteReward,
  getUserRedemptions,
};