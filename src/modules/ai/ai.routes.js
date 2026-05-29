const express = require('express');
const router = express.Router();
const aiController = require('./ai.controller');
const { protect } = require('../auth/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: AI Assistant
 *   description: LangChain-powered financial coaching and guidance
 */

/**
 * @swagger
 * /api/ai/ask:
 *   post:
 *     summary: Ask the AI assistant a financial question
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: What is the best way to start saving money?
 *     responses:
 *       200:
 *         description: AI response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     reply:
 *                       type: string
 *       400:
 *         description: Message is required
 *       401:
 *         description: Unauthorized
 */
router.post('/ask', protect, aiController.askAssistant);

/**
 * @swagger
 * /api/ai/explain-simulation:
 *   post:
 *     summary: Get AI explanation for a simulation result
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - difficulty
 *               - userChoice
 *               - correctChoice
 *               - isCorrect
 *               - feedback
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               userChoice:
 *                 type: string
 *               correctChoice:
 *                 type: string
 *               isCorrect:
 *                 type: boolean
 *               feedback:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI explanation
 *       401:
 *         description: Unauthorized
 */
router.post('/explain-simulation', protect, aiController.explainSimulation);

/**
 * @swagger
 * /api/ai/recommendations:
 *   get:
 *     summary: Get personalized AI recommendations based on behavior
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Personalized recommendations
 *       401:
 *         description: Unauthorized
 */
router.get('/recommendations', protect, aiController.getRecommendations);

/**
 * @swagger
 * /api/ai/guidance:
 *   get:
 *     summary: Get AI learning guidance based on user level
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Learning guidance
 *       401:
 *         description: Unauthorized
 */
router.get('/guidance', protect, aiController.getLearningGuidance);

/**
 * @swagger
 * /api/ai/logs:
 *   get:
 *     summary: Get AI interaction history for current user
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI logs
 *       401:
 *         description: Unauthorized
 */
router.get('/logs', protect, aiController.getAiLogs);

module.exports = router;