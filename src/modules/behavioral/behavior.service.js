const BehaviorEvent = require('./behavior.model');
const Insight = require('./insight.model');
const { Op } = require('sequelize');

// Called by other modules to log a behavioral event
const logBehaviorEvent = async (userId, eventType, data = {}) => {
  const event = await BehaviorEvent.create({
    user_id: userId,
    event_type: eventType,
    category: data.category || 'general',
    is_correct: data.is_correct ?? null,
    difficulty: data.difficulty || null,
    meta: data.meta || {},
  });
  return event;
};

// Get all behavior events for a user
const getUserEvents = async (userId) => {
  return await BehaviorEvent.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
  });
};

// Analyze user behavior and generate insights
const analyzeAndGenerateInsights = async (userId) => {
  const events = await BehaviorEvent.findAll({
    where: {
      user_id: userId,
      event_type: 'simulation_decision',
    },
  });

  if (events.length === 0) return [];

  const insights = [];

  // --- Pattern 1: Overall accuracy ---
  const total = events.length;
  const correct = events.filter(e => e.is_correct).length;
  const accuracy = (correct / total) * 100;

  if (accuracy >= 70) {
    insights.push({
      user_id: userId,
      insight_text: `Your overall decision accuracy is ${Math.round(accuracy)}% — your financial thinking is improving!`,
      insight_type: 'improvement',
    });
  } else if (accuracy < 50) {
    insights.push({
      user_id: userId,
      insight_text: `Your decision accuracy is ${Math.round(accuracy)}%. Keep practicing — consistency leads to improvement.`,
      insight_type: 'decision_pattern',
    });
  }

  // --- Pattern 2: Weak category ---
  const categories = ['budgeting', 'loan', 'emergency', 'debt', 'investing'];
  for (const cat of categories) {
    const catEvents = events.filter(e => e.category === cat);
    if (catEvents.length < 2) continue;

    const catCorrect = catEvents.filter(e => e.is_correct).length;
    const catAccuracy = (catCorrect / catEvents.length) * 100;

    if (catAccuracy < 50) {
      insights.push({
        user_id: userId,
        insight_text: `You tend to struggle with ${cat} decisions. Consider revisiting ${cat} learning modules.`,
        insight_type: 'spending',
      });
    }
  }

  // --- Pattern 3: Risk behavior ---
  const emergencyEvents = events.filter(e => e.category === 'emergency');
  if (emergencyEvents.length >= 2) {
    const emergencyCorrect = emergencyEvents.filter(e => e.is_correct).length;
    if (emergencyCorrect / emergencyEvents.length < 0.5) {
      insights.push({
        user_id: userId,
        insight_text: 'You tend to overspend under pressure. Try emergency fund simulations to build better habits.',
        insight_type: 'risk',
      });
    }
  }

  // --- Pattern 4: Learning consistency ---
  const moduleEvents = await BehaviorEvent.findAll({
    where: {
      user_id: userId,
      event_type: 'module_completed',
    },
  });

  if (moduleEvents.length === 0 && total >= 3) {
    insights.push({
      user_id: userId,
      insight_text: 'You are active in simulations but have not completed any learning modules. Modules can improve your scores.',
      insight_type: 'consistency',
    });
  }

  // --- Pattern 5: Long term planning ---
  const investingEvents = events.filter(e => e.category === 'investing');
  if (investingEvents.length === 0 && total >= 5) {
    insights.push({
      user_id: userId,
      insight_text: 'You avoid long-term planning decisions. Try investing simulations to build that skill.',
      insight_type: 'decision_pattern',
    });
  }

  // Save all generated insights
  const saved = await Insight.bulkCreate(insights);
  return saved;
};

// Get all insights for a user
const getUserInsights = async (userId) => {
  return await Insight.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
  });
};

// Mark insight as read
const markInsightRead = async (insightId, userId) => {
  const insight = await Insight.findOne({
    where: { id: insightId, user_id: userId },
  });
  if (!insight) throw new Error('Insight not found');
  await insight.update({ is_read: true });
  return insight;
};

module.exports = {
  logBehaviorEvent,
  getUserEvents,
  analyzeAndGenerateInsights,
  getUserInsights,
  markInsightRead,
};