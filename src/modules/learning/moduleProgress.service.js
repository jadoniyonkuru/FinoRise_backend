const ModuleProgress = require('./moduleProgress.model');
const Module = require('./module.model');
const behaviorService = require('../behavioral/behavior.service');
const { awardXP } = require('../gamification/gamification.service');

const getMyProgress = async (userId) => {
  const allModules = await Module.findAll({
    where: { is_published: true },
    attributes: ['id', 'title', 'category', 'difficulty', 'xp_reward'],
    order: [['order_index', 'ASC']],
  });

  const completions = await ModuleProgress.findAll({ where: { user_id: userId } });
  const completedMap = new Map(completions.map((c) => [c.module_id, c]));

  return allModules.map((mod) => {
    const progress = completedMap.get(mod.id);
    return {
      module_id: mod.id,
      title: mod.title,
      category: mod.category,
      difficulty: mod.difficulty,
      xp_reward: mod.xp_reward,
      completed: !!progress,
      completed_at: progress ? progress.completed_at : null,
      score: progress ? progress.score : null,
    };
  });
};

const completeModule = async (userId, moduleId) => {
  const mod = await Module.findByPk(moduleId);
  if (!mod) throw new Error('Module not found');

  // Upsert — mark as complete (idempotent)
  const [record, created] = await ModuleProgress.upsert(
    { user_id: userId, module_id: moduleId, completed_at: new Date(), score: null },
    { returning: true }
  );

  if (created) {
    // Award XP only on first completion (also recalculates level)
    await awardXP(userId, mod.xp_reward, `Module completed: ${mod.title}`);

    await behaviorService.logBehaviorEvent(userId, 'module_completed', {
      category: mod.category || 'general',
      difficulty: mod.difficulty,
      meta: { module_id: moduleId },
    });
  }

  return {
    message: created ? 'Module completed! XP awarded.' : 'Module already completed.',
    xp_awarded: created ? mod.xp_reward : 0,
    completed_at: record.completed_at,
  };
};

module.exports = { getMyProgress, completeModule };
