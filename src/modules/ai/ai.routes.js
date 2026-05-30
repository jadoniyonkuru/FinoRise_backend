const express = require('express');
const router = express.Router();
const aiController = require('./ai.controller');
const { protect } = require('../auth/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: AI Assistant
 *   description: LangChain-powered Gemini financial coaching and guidance
 */

/**
 * @swagger
 * /api/ai/ask:
 *   post:
 *     summary: Ask the AI assistant a financial question
 *     description: Sends a message to the FinoRise AI coach. The response is personalized using the user's level, XP, and recent behavioral insights.
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
 *         description: AI reply returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AiReply'
 *             example:
 *               success: true
 *               data:
 *                 reply: Start by tracking your expenses for one month to see where your money goes. Then set aside at least 10% of your income into a separate savings account before spending on anything else.
 *       400:
 *         description: Message field is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Message is required
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       500:
 *         description: AI service error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please set an API key for Google GenerativeAI
 */
router.post('/ask', protect, aiController.askAssistant);

/**
 * @swagger
 * /api/ai/explain-simulation:
 *   post:
 *     summary: Get an AI explanation for a completed simulation result
 *     description: After a user completes a simulation step, call this endpoint to get a personalized AI explanation of why the correct choice is better and one practical real-life tip.
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
 *                 example: Emergency Fund Challenge
 *               category:
 *                 type: string
 *                 enum: [budgeting, loan, emergency, debt, investing]
 *                 example: emergency
 *               difficulty:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 example: beginner
 *               userChoice:
 *                 type: string
 *                 example: Put it on credit card — keep my savings
 *               correctChoice:
 *                 type: string
 *                 example: Pay from savings — avoid interest charges
 *               isCorrect:
 *                 type: boolean
 *                 example: false
 *               feedback:
 *                 type: string
 *                 example: This will cost you more in interest over time.
 *     responses:
 *       200:
 *         description: AI explanation returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AiReply'
 *             example:
 *               success: true
 *               data:
 *                 reply: Paying from savings avoids credit card interest which can reach 20–30% annually. Tip — build an emergency fund of 3 months expenses so you never need to rely on credit for unexpected costs.
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       500:
 *         description: AI service error
 */
router.post('/explain-simulation', protect, aiController.explainSimulation);

/**
 * @swagger
 * /api/ai/recommendations:
 *   get:
 *     summary: Get personalized AI recommendations based on behavioral insights
 *     description: Returns 3 actionable financial recommendations generated from the user's behavioral insights. If no insights exist yet, the AI prompts the user to complete simulations first.
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Personalized recommendations returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AiReply'
 *             example:
 *               success: true
 *               data:
 *                 reply: "1. Build an emergency fund covering 3 months of expenses before taking on any new debt. 2. Review your monthly subscriptions and cancel unused ones to free up savings. 3. Set a weekly spending limit for non-essentials and track it every Friday."
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       500:
 *         description: AI service error
 */
router.get('/recommendations', protect, aiController.getRecommendations);

/**
 * @swagger
 * /api/ai/guidance:
 *   get:
 *     summary: Get AI learning guidance based on user level and streak
 *     description: Returns personalized guidance on which financial topics the user should focus on next, based on their current level, XP, and streak days.
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Learning guidance returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AiReply'
 *             example:
 *               success: true
 *               data:
 *                 reply: You are doing great at Level 3! At this stage focus on debt management simulations. Your 5-day streak shows real commitment — keep it going by completing one simulation per day this week.
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       500:
 *         description: AI service error
 */
router.get('/guidance', protect, aiController.getLearningGuidance);

/**
 * @swagger
 * /api/ai/logs:
 *   get:
 *     summary: Get the current user's AI interaction history
 *     description: Returns the last 20 AI interactions for the authenticated user, ordered from most recent to oldest.
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI logs returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AiLog'
 *             example:
 *               success: true
 *               data:
 *                 - id: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *                   user_id: 1a2b3c4d-0000-0000-0000-000000000001
 *                   prompt: What is the best way to start saving money?
 *                   response: Start by tracking your expenses for one month...
 *                   feature: qa
 *                   created_at: "2026-05-30T10:00:00.000Z"
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       500:
 *         description: AI service error
 */
router.get('/logs', protect, aiController.getAiLogs);

module.exports = router;
