const sequelize = require('../../config/database');
const User = require('../users/user.model');
const Module = require('../learning/module.model');
const BehaviorEvent = require('../behavioral/behavior.model');
const Insight = require('../behavioral/insight.model');

const getDashboard = async (userId) => {
  const [totalPrograms, publishedPrograms, recentPrograms, latestInsight] = await Promise.all([
    Module.count({ where: { created_by: userId } }),
    Module.count({ where: { created_by: userId, is_published: true } }),
    Module.findAll({
      where: { created_by: userId },
      order: [['created_at', 'DESC']],
      limit: 3,
      attributes: ['id', 'title', 'category', 'difficulty', 'xp_reward', 'is_published', 'created_at'],
    }),
    Insight.findOne({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
    }),
  ]);

  return {
    stats: {
      total_programs: totalPrograms,
      published_programs: publishedPrograms,
      draft_programs: totalPrograms - publishedPrograms,
    },
    recent_programs: recentPrograms,
    ai_insight: latestInsight,
  };
};

const getPrograms = async (userId) => {
  const programs = await Module.findAll({
    where: { created_by: userId },
    order: [['created_at', 'DESC']],
  });

  const published = programs.filter((p) => p.is_published).length;

  return {
    stats: {
      total: programs.length,
      published,
      drafts: programs.length - published,
    },
    programs,
  };
};

const getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'full_name', 'email', 'phone', 'role', 'is_verified', 'created_at'],
  });
  if (!user) throw new Error('Partner not found');
  return user;
};

const updateProfile = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('Partner not found');
  const { full_name, phone } = data;
  await user.update({ full_name, phone });
  return user.reload({ attributes: ['id', 'full_name', 'email', 'phone', 'role', 'is_verified', 'created_at'] });
};

const getImpact = async (userId) => {
  const programs = await Module.findAll({
    where: { created_by: userId },
    attributes: ['id', 'title', 'category', 'difficulty', 'xp_reward', 'is_published'],
  });

  const publishedPrograms = programs.filter((p) => p.is_published);
  const totalXP = publishedPrograms.reduce((sum, p) => sum + (p.xp_reward || 0), 0);

  const categoryBreakdown = programs.reduce((acc, p) => {
    if (p.category) acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const difficultyBreakdown = programs.reduce((acc, p) => {
    acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
    return acc;
  }, {});

  // Count distinct learners who completed partner's modules via behavior events
  let learnerCount = 0;
  if (publishedPrograms.length > 0) {
    const moduleIds = publishedPrograms.map((p) => p.id);
    const moduleIdList = moduleIds.map((id) => `'${id}'`).join(', ');
    learnerCount = await BehaviorEvent.count({
      distinct: true,
      col: 'user_id',
      where: sequelize.literal(
        `event_type = 'module_completed' AND meta->>'module_id' IN (${moduleIdList})`
      ),
    });
  }

  return {
    stats: {
      total_programs: programs.length,
      published_programs: publishedPrograms.length,
      draft_programs: programs.length - publishedPrograms.length,
      total_xp_available: totalXP,
      learners_reached: learnerCount,
      categories_covered: Object.keys(categoryBreakdown).length,
    },
    category_breakdown: categoryBreakdown,
    difficulty_breakdown: difficultyBreakdown,
    programs,
  };
};

module.exports = { getDashboard, getPrograms, getProfile, updateProfile, getImpact };
