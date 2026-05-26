const express = require('express');
const router = express.Router();
const behaviorController = require('./behavior.controller');
const { protect } = require('../auth/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Behavioral Analytics
 *   description: User behavior tracking and financial insights
 */

/**
 * @swagger
 * /api/behavioral/events:
 *   get:
 *     summary: Get all behavior events for current user
 *     tags: [Behavioral Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of behavior events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BehaviorEvent'
 *       401:
 *         description: Unauthorized
 */
router.get('/events', protect, behaviorController.getUserEvents);

/**
 * @swagger
 * /api/behavioral/analyze:
 *   post:
 *     summary: Analyze behavior and generate insights for current user
 *     tags: [Behavioral Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Generated insights
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Insight'
 *       401:
 *         description: Unauthorized
 */
router.post('/analyze', protect, behaviorController.analyzeAndGenerateInsights);

/**
 * @swagger
 * /api/behavioral/insights:
 *   get:
 *     summary: Get all insights for current user
 *     tags: [Behavioral Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of insights
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Insight'
 *       401:
 *         description: Unauthorized
 */
router.get('/insights', protect, behaviorController.getUserInsights);

/**
 * @swagger
 * /api/behavioral/insights/{id}/read:
 *   patch:
 *     summary: Mark an insight as read
 *     tags: [Behavioral Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Insight ID
 *     responses:
 *       200:
 *         description: Insight marked as read
 *       400:
 *         description: Insight not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/insights/:id/read', protect, behaviorController.markInsightRead);

module.exports = router;