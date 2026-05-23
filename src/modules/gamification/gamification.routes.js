const express = require('express');
const router = express.Router();
const gamificationController = require('./gamification.controller');
const { protect } = require('../auth/auth.middleware');

router.get('/xp', protect, gamificationController.getXP);
router.post('/xp/award', protect, gamificationController.awardXP);
router.get('/badges', protect, gamificationController.getBadges);
router.get('/streak', protect, gamificationController.getStreak);
router.get('/leaderboard', protect, gamificationController.getLeaderboard);

module.exports = router;