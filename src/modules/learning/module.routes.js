const express = require('express');
const router = express.Router();
const moduleController = require('./module.controller');
const lessonController = require('./lesson.controller');
const quizController = require('./quiz.controller');
const progressController = require('./moduleProgress.controller');
const { protect, adminOnly } = require('../auth/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: Learning modules, lessons, quizzes, and progress
 */

// ── Module CRUD ───────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/modules:
 *   get:
 *     summary: Get all published learning modules
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
 */
router.get('/', protect, moduleController.getAllModules);

/**
 * @swagger
 * /api/modules/my-progress:
 *   get:
 *     summary: Get learner's completion status for all modules
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progress list per module
 */
router.get('/my-progress', protect, progressController.getMyProgress);

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
 *             required: [title, difficulty]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               category: { type: string }
 *               difficulty: { type: string, enum: [beginner, intermediate, advanced] }
 *               xp_reward: { type: integer }
 *               is_published: { type: boolean }
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
 *               title: { type: string }
 *               description: { type: string }
 *               category: { type: string }
 *               difficulty: { type: string }
 *               xp_reward: { type: integer }
 *               is_published: { type: boolean }
 *     responses:
 *       200:
 *         description: Module updated
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
 *       404:
 *         description: Module not found
 */
router.delete('/:id', protect, adminOnly, moduleController.deleteModule);

// ── Module Complete ───────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/modules/{id}/complete:
 *   post:
 *     summary: Mark a module as complete (awards XP on first completion)
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
 *         description: Module marked as complete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     message: { type: string, example: "Module completed! XP awarded." }
 *                     xp_awarded: { type: integer, example: 100 }
 *                     completed_at: { type: string, format: date-time }
 */
router.post('/:id/complete', protect, progressController.completeModule);

// ── Lessons ───────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/modules/{id}/lessons:
 *   get:
 *     summary: Get all lessons for a module
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
 *         description: Lessons list ordered by order_index
 *       404:
 *         description: Module not found
 *
 *   post:
 *     summary: Create a lesson in a module (Admin only)
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
 *             required: [title, content]
 *             properties:
 *               title: { type: string, example: "What is budgeting?" }
 *               content: { type: string, example: "Budgeting is the process of..." }
 *               duration_minutes: { type: integer, example: 5 }
 *     responses:
 *       201:
 *         description: Lesson created
 */
router.get('/:id/lessons', protect, lessonController.getLessons);
router.post('/:id/lessons', protect, adminOnly, lessonController.createLesson);

/**
 * @swagger
 * /api/modules/{id}/lessons/{lessonId}:
 *   get:
 *     summary: Get a single lesson
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lesson content
 *       404:
 *         description: Lesson not found
 *
 *   put:
 *     summary: Update a lesson (Admin only)
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: lessonId
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
 *               title: { type: string }
 *               content: { type: string }
 *               duration_minutes: { type: integer }
 *     responses:
 *       200:
 *         description: Lesson updated
 *
 *   delete:
 *     summary: Delete a lesson (Admin only)
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lesson deleted
 */
router.get('/:id/lessons/:lessonId', protect, lessonController.getLessonById);
router.put('/:id/lessons/:lessonId', protect, adminOnly, lessonController.updateLesson);
router.delete('/:id/lessons/:lessonId', protect, adminOnly, lessonController.deleteLesson);

// ── Quiz ──────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/modules/{id}/quiz:
 *   get:
 *     summary: Get quiz questions for a module (correct answers hidden)
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
 *         description: Quiz questions without correct answers
 *       404:
 *         description: Module not found
 */
router.get('/:id/quiz', protect, quizController.getQuiz);

/**
 * @swagger
 * /api/modules/{id}/quiz/submit:
 *   post:
 *     summary: Submit quiz answers and get score + XP
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
 *             required: [answers]
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question_id: { type: string, format: uuid }
 *                     answer: { type: string }
 *                 example:
 *                   - question_id: "uuid-here"
 *                     answer: "Save it"
 *     responses:
 *       200:
 *         description: Quiz result with score, XP earned, and per-question breakdown
 */
router.post('/:id/quiz/submit', protect, quizController.submitQuiz);

/**
 * @swagger
 * /api/modules/{id}/quiz/questions:
 *   post:
 *     summary: Add a quiz question to a module (Admin only)
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
 *             required: [question, options, correct_answer]
 *             properties:
 *               question: { type: string, example: "What is the first step to creating a budget?" }
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Track your income", "Spend freely", "Open a savings account", "Ignore expenses"]
 *               correct_answer: { type: string, example: "Track your income" }
 *               xp_reward: { type: integer, example: 10 }
 *     responses:
 *       201:
 *         description: Question added
 */
router.post('/:id/quiz/questions', protect, adminOnly, quizController.addQuestion);

/**
 * @swagger
 * /api/modules/{id}/quiz/questions/{questionId}:
 *   delete:
 *     summary: Delete a quiz question (Admin only)
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question deleted
 */
router.delete('/:id/quiz/questions/:questionId', protect, adminOnly, quizController.deleteQuestion);

module.exports = router;
