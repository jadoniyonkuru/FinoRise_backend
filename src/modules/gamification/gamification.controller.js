const gamificationService = require('./gamification.service');

const getXP = async (req, res) => {
  try {
    const data = await gamificationService.getXP(req.user.id);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const awardXP = async (req, res) => {
  try {
    const { amount, reason } = req.body;
    if (!amount) return res.status(400).json({ message: 'Amount is required' });
    const data = await gamificationService.awardXP(req.user.id, amount, reason);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getBadges = async (req, res) => {
  try {
    const badges = await gamificationService.getBadges(req.user.id);
    res.status(200).json({ badges });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getStreak = async (req, res) => {
  try {
    const data = await gamificationService.getStreak(req.user.id);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const data = await gamificationService.getLeaderboard();
    res.status(200).json({ leaderboard: data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const recordStreak = async (req, res) => {
  try {
    const data = await gamificationService.recordStreak(req.user.id);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getXP, awardXP, getBadges, getStreak, recordStreak, getLeaderboard };