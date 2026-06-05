const User = require('../users/user.model');
const ModuleProgress = require('../learning/moduleProgress.model');
const Module = require('../learning/module.model');
const BehaviorEvent = require('../behavioral/behavior.model');
const Insight = require('../behavioral/insight.model');
const Badge = require('../gamification/badge.model');

const getLearnerAnalytics = async (userId) => {
  const [
    user,
    completedModules,
    totalModules,
    recentEvents,
    insights,
    badges,
  ] = await Promise.all([
    User.findByPk(userId, {
      attributes: ['id', 'full_name', 'xp_total', 'level', 'streak_days', 'last_active', 'average_quiz_score'],
    }),
    ModuleProgress.findAll({
      where: { user_id: userId },
      include: [{ model: Module, attributes: ['title', 'category', 'difficulty', 'xp_reward'] }],
      order: [['completed_at', 'DESC']],
    }),
    Module.count({ where: { is_published: true } }),
    BehaviorEvent.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: 10,
      attributes: ['event_type', 'category', 'is_correct', 'difficulty', 'created_at'],
    }),
    Insight.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: 5,
    }),
    Badge.findAll({
      where: { user_id: userId },
      order: [['earned_at', 'DESC']],
      limit: 5,
    }),
  ]);

  if (!user) throw new Error('User not found');

  const completedCount = completedModules.length;
  const avgScore = completedModules.length > 0
    ? Math.round(
        completedModules.filter((m) => m.score !== null).reduce((sum, m) => sum + m.score, 0) /
        (completedModules.filter((m) => m.score !== null).length || 1)
      )
    : null;

  // Category breakdown of completed modules
  const categoryBreakdown = completedModules.reduce((acc, m) => {
    const cat = m.Module?.category || 'general';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  return {
    overview: {
      xp_total: user.xp_total,
      level: user.level,
      streak_days: user.streak_days,
      last_active: user.last_active,
    },
    modules: {
      completed: completedCount,
      total_available: totalModules,
      completion_rate: totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0,
      average_quiz_score: user.average_quiz_score,
      category_breakdown: categoryBreakdown,
      recent_completions: completedModules.slice(0, 5),
    },
    recent_activity: recentEvents,
    insights: insights,
    badges: badges,
  };
};

module.exports = { getLearnerAnalytics };
