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
            badge_type: { type: 'string', enum: ['streak', 'completion', 'simulation', 'special'] },
            badge_icon: { type: 'string' },
            earned_at: { type: 'string', format: 'date-time' },
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
  ],
};

module.exports = swaggerJsdoc(options);
