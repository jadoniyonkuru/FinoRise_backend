const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FinoRise API',
      version: '1.0.0',
      description: 'FinoRise financial learning platform API documentation',
    },
    servers: [{ url: 'http://localhost:5000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            full_name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['learner', 'admin', 'partner'] },
            xp_total: { type: 'integer' },
            level: { type: 'integer' },
            streak_days: { type: 'integer' },
          },
        },
        Module: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string' },
            difficulty: { type: 'string' },
            xp_reward: { type: 'integer' },
          },
        },
        Badge: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            badge_name: { type: 'string' },
            badge_type: {
              type: 'string',
              enum: ['streak', 'completion', 'simulation', 'special'],
            },
            badge_icon: { type: 'string' },
            earned_at: { type: 'string', format: 'date-time' },
          },
        },
        Reward: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            reward_type: {
              type: 'string',
              enum: ['airtime', 'discount', 'voucher', 'partner_offer'],
            },
            xp_cost: { type: 'integer' },
            quantity: { type: 'integer', nullable: true },
            is_active: { type: 'boolean' },
            valid_until: { type: 'string', format: 'date-time', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Redemption: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            reward_id: { type: 'string', format: 'uuid' },
            redemption_code: {
              type: 'string',
              example: 'FNR-1718000000000-AB3X9Z',
            },
            xp_spent: { type: 'integer' },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'used', 'expired'],
            },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        BehaviorEvent: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            event_type: {
              type: 'string',
              enum: [
                'simulation_decision',
                'module_completed',
                'reward_redeemed',
                'streak_achieved',
              ],
            },
            category: {
              type: 'string',
              enum: [
                'budgeting',
                'loan',
                'emergency',
                'debt',
                'investing',
                'general',
              ],
            },
            is_correct: { type: 'boolean', nullable: true },
            difficulty: { type: 'string', nullable: true },
            meta: { type: 'object' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Insight: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            insight_text: { type: 'string' },
            insight_type: {
              type: 'string',
              enum: [
                'spending',
                'risk',
                'consistency',
                'decision_pattern',
                'improvement',
              ],
            },
            is_read: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    './src/modules/auth/auth.routes.js',
    './src/modules/gamification/gamification.routes.js',
    './src/modules/learning/module.routes.js',
    './src/modules/rewards/reward.routes.js',
    './src/modules/behavioral/behavior.routes.js',
  ],
};

module.exports = swaggerJsdoc(options);