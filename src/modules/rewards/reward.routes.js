const express = require('express');
const router = express.Router();
const rewardController = require('./reward.controller');
const { protect, adminOnly } = require('../auth/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Rewards
 *   description: Reward catalog, redemption, and history
 */

/**
 * @swagger
 * /api/rewards:
 *   get:
 *     summary: Get all active rewards
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active rewards
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
 *                     $ref: '#/components/schemas/Reward'
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, rewardController.getAllRewards);

/**
 * @swagger
 * /api/rewards/my-redemptions:
 *   get:
 *     summary: Get current user's redemption history
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's past redemptions
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
 *                     $ref: '#/components/schemas/Redemption'
 *       401:
 *         description: Unauthorized
 */
router.get('/my-redemptions', protect, rewardController.getUserRedemptions);

/**
 * @swagger
 * /api/rewards/{id}:
 *   get:
 *     summary: Get a reward by ID
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reward ID
 *     responses:
 *       200:
 *         description: Reward details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Reward'
 *       404:
 *         description: Reward not found
 */
router.get('/:id', protect, rewardController.getRewardById);

/**
 * @swagger
 * /api/rewards/{id}/redeem:
 *   post:
 *     summary: Redeem a reward using XP
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reward ID to redeem
 *     responses:
 *       200:
 *         description: Reward redeemed successfully
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
 *                     message:
 *                       type: string
 *                       example: Reward redeemed successfully
 *                     redemption_code:
 *                       type: string
 *                       example: FNR-1718000000000-AB3X9Z
 *                     redemption_id:
 *                       type: string
 *                       format: uuid
 *                     reward_title:
 *                       type: string
 *                     xp_spent:
 *                       type: integer
 *                     xp_remaining:
 *                       type: integer
 *       400:
 *         description: Not enough XP, out of stock, expired, or inactive
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Reward not found
 */
router.post('/:id/redeem', protect, rewardController.redeemReward);

/**
 * @swagger
 * /api/rewards:
 *   post:
 *     summary: Create a new reward (admin only)
 *     tags: [Rewards]
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
 *               - reward_type
 *               - xp_cost
 *             properties:
 *               title:
 *                 type: string
 *                 example: 50MB Airtime Bundle
 *               description:
 *                 type: string
 *                 example: Redeem for 50MB mobile data
 *               reward_type:
 *                 type: string
 *                 enum: [airtime, discount, voucher, partner_offer]
 *               xp_cost:
 *                 type: integer
 *                 example: 500
 *               quantity:
 *                 type: integer
 *                 example: 100
 *               valid_until:
 *                 type: string
 *                 format: date-time
 *                 example: '2025-12-31T23:59:59Z'
 *     responses:
 *       201:
 *         description: Reward created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Reward'
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden — admin only
 */
router.post('/', protect, adminOnly, rewardController.createReward);

/**
 * @swagger
 * /api/rewards/{id}:
 *   delete:
 *     summary: Delete a reward (admin only)
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reward ID to delete
 *     responses:
 *       200:
 *         description: Reward deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Reward deleted
 *       400:
 *         description: Reward not found
 *       403:
 *         description: Forbidden — admin only
 */
router.delete('/:id', protect, adminOnly, rewardController.deleteReward);

module.exports = router;