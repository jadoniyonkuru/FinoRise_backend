const express = require('express');
const router = express.Router();
const gamificationController = require('./gamification.controller');
const { protect } = require('../auth/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Gamification
 *   description: XP, badges, streaks and leaderboard
 */

/**
 * @swagger
 * /api/gamification/xp:
 *   get:
 *     summary: Get current user XP and level
 *     tags: [Gamification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: XP and level info
 *       401:
 *         description: Unauthorized
 */
router.get('/xp', protect, gamificationController.getXP);

/**
 * @swagger
 * /api/gamification/xp/award:
 *   post:
 *     summary: Award XP to current user
 *     tags: [Gamification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, reason]
 *             properties:
 *               amount:
 *                 type: integer
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: XP awarded successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/xp/award', protect, gamificationController.awardXP);

/**
 * @swagger
 * /api/gamification/badges:
 *   get:
 *     summary: Get all badges earned by current user
 *     tags: [Gamification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of badges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Badge'
 *       401:
 *         description: Unauthorized
 */
router.get('/badges', protect, gamificationController.getBadges);

/**
 * @swagger
 * /api/gamification/streak:
 *   get:
 *     summary: Get current user streak
 *     tags: [Gamification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Streak info
 *       401:
 *         description: Unauthorized
 */
router.get('/streak', protect, gamificationController.getStreak);

/**
 * @swagger
 * /api/gamification/leaderboard:
 *   get:
 *     summary: Get top 10 users leaderboard
 *     tags: [Gamification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leaderboard list
 *       401:
 *         description: Unauthorized
 */
router.get('/leaderboard', protect, gamificationController.getLeaderboard);

module.exports = router;
