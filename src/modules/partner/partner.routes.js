const express = require('express');
const router = express.Router();
const partnerController = require('./partner.controller');
const { protect, partnerOnly } = require('../auth/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Partner
 *   description: Partner portal — program management, profile, and impact tracking
 */

/**
 * @swagger
 * /api/partner/dashboard:
 *   get:
 *     summary: Get partner dashboard
 *     description: Returns program stats (total, published, drafts), the 3 most recent programs, and the partner's latest AI behavioral insight.
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data returned successfully
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
 *                     stats:
 *                       type: object
 *                       properties:
 *                         total_programs:
 *                           type: integer
 *                           example: 5
 *                         published_programs:
 *                           type: integer
 *                           example: 3
 *                         draft_programs:
 *                           type: integer
 *                           example: 2
 *                     recent_programs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Module'
 *                     ai_insight:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Insight'
 *                         - nullable: true
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied — partners only
 */
router.get('/dashboard', protect, partnerOnly, partnerController.getDashboard);

/**
 * @swagger
 * /api/partner/programs:
 *   get:
 *     summary: Get all partner programs with aggregate stats
 *     description: Returns the full list of learning modules created by this partner, along with total, published, and draft counts.
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Programs list returned successfully
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
 *                     stats:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 5
 *                         published:
 *                           type: integer
 *                           example: 3
 *                         drafts:
 *                           type: integer
 *                           example: 2
 *                     programs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Module'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied — partners only
 */
router.get('/programs', protect, partnerOnly, partnerController.getPrograms);

/**
 * @swagger
 * /api/partner/profile:
 *   get:
 *     summary: Get partner profile
 *     description: Returns the authenticated partner's profile information.
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied — partners only
 *       404:
 *         description: Partner not found
 *
 *   put:
 *     summary: Update partner profile
 *     description: Updates the partner's full name and/or phone number. Email, role, and password cannot be changed here.
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Rwanda Finance Institute
 *               phone:
 *                 type: string
 *                 example: "+250788000000"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied — partners only
 */
router.get('/profile', protect, partnerOnly, partnerController.getProfile);
router.put('/profile', protect, partnerOnly, partnerController.updateProfile);

/**
 * @swagger
 * /api/partner/impact:
 *   get:
 *     summary: Get partner impact stats
 *     description: Returns impact metrics for the partner — total learners reached, XP distributed, programs by category and difficulty.
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Impact stats returned successfully
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
 *                     stats:
 *                       type: object
 *                       properties:
 *                         total_programs:
 *                           type: integer
 *                           example: 5
 *                         published_programs:
 *                           type: integer
 *                           example: 3
 *                         draft_programs:
 *                           type: integer
 *                           example: 2
 *                         total_xp_available:
 *                           type: integer
 *                           example: 450
 *                         learners_reached:
 *                           type: integer
 *                           example: 120
 *                         categories_covered:
 *                           type: integer
 *                           example: 3
 *                     category_breakdown:
 *                       type: object
 *                       example:
 *                         budgeting: 2
 *                         emergency: 1
 *                     difficulty_breakdown:
 *                       type: object
 *                       example:
 *                         beginner: 2
 *                         intermediate: 1
 *                     programs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Module'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied — partners only
 */
router.get('/impact', protect, partnerOnly, partnerController.getImpact);

module.exports = router;
