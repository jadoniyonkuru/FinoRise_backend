const express = require('express');
const router = express.Router();
const analyticsController = require('./analytics.controller');
const { protect } = require('../auth/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Learner personal analytics
 */

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get learner's own analytics
 *     description: Returns the authenticated learner's personal stats — modules completed, XP, level, streak, quiz scores, recent activity, insights, and badges.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     overview:
 *                       type: object
 *                       properties:
 *                         xp_total: { type: integer, example: 350 }
 *                         level: { type: integer, example: 3 }
 *                         streak_days: { type: integer, example: 5 }
 *                         last_active: { type: string, format: date-time }
 *                     modules:
 *                       type: object
 *                       properties:
 *                         completed: { type: integer, example: 4 }
 *                         total_available: { type: integer, example: 10 }
 *                         completion_rate: { type: integer, example: 40 }
 *                         average_quiz_score: { type: integer, example: 85 }
 *                         category_breakdown: { type: object }
 *                         recent_completions: { type: array, items: {} }
 *                     recent_activity:
 *                       type: array
 *                       items: {}
 *                     insights:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Insight'
 *                     badges:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Badge'
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, analyticsController.getLearnerAnalytics);

module.exports = router;
