const express = require('express');
const router = express.Router();
const moduleController = require('./module.controller');
const { protect, adminOnly } = require('../auth/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: Learning modules
 */

/**
 * @swagger
 * /api/modules:
 *   get:
 *     summary: Get all learning modules
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of modules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Module'
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, moduleController.getAllModules);

/**
 * @swagger
 * /api/modules/{id}:
 *   get:
 *     summary: Get a module by ID
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Module details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *       404:
 *         description: Module not found
 */
router.get('/:id', protect, moduleController.getModuleById);

/**
 * @swagger
 * /api/modules:
 *   post:
 *     summary: Create a new module (Admin only)
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               xp_reward:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Module created
 *       403:
 *         description: Admin access required
 */
router.post('/', protect, adminOnly, moduleController.createModule);

/**
 * @swagger
 * /api/modules/{id}:
 *   put:
 *     summary: Update a module (Admin only)
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               xp_reward:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Module updated
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Module not found
 */
router.put('/:id', protect, adminOnly, moduleController.updateModule);

/**
 * @swagger
 * /api/modules/{id}:
 *   delete:
 *     summary: Delete a module (Admin only)
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Module deleted
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Module not found
 */
router.delete('/:id', protect, adminOnly, moduleController.deleteModule);

module.exports = router;
