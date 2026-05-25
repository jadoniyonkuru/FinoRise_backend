const User = require('../users/user.model');
const Badge = require('./badge.model');

// XP levels config
const LEVELS = [
  { level: 1, minXP: 0 },
  { level: 2, minXP: 500 },
  { level: 3, minXP: 1000 },
  { level: 4, minXP: 2000 },
  { level: 5, minXP: 3500 },
  { level: 6, minXP: 5000 },
  { level: 7, minXP: 7000 },
  { level: 8, minXP: 9500 },
  { level: 9, minXP: 12500 },
  { level: 10, minXP: 16000 },
];

// Calculate level from XP
const calculateLevel = (xp) => {
  let currentLevel = 1;
  for (const l of LEVELS) {
    if (xp >= l.minXP) currentLevel = l.level;
  }
  return currentLevel;
};

// Get user XP and level
const getXP = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'xp_total', 'level', 'streak_days'],
  });
  if (!user) throw new Error('User not found');

  const nextLevel = LEVELS.find(l => l.level === user.level + 1);

  return {
    xp_total: user.xp_total,
    level: user.level,
    streak_days: user.streak_days,
    next_level_xp: nextLevel ? nextLevel.minXP : null,
    xp_to_next_level: nextLevel ? nextLevel.minXP - user.xp_total : 0,
  };
};

// Award XP to user
const awardXP = async (userId, amount, reason) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  const newXP = user.xp_total + amount;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > user.level;

  await user.update({
    xp_total: newXP,
    level: newLevel,
  });

  // Auto award badge if leveled up
  if (leveledUp) {
    await Badge.create({
      user_id: userId,
      badge_name: `Level ${newLevel} Achieved`,
      badge_type: 'special',
      badge_icon: '⭐',
    });
  }

  return {
    xp_awarded: amount,
    reason,
    xp_total: newXP,
    level: newLevel,
    leveled_up: leveledUp,
  };
};

// Get user badges
const getBadges = async (userId) => {
  const badges = await Badge.findAll({
    where: { user_id: userId },
    order: [['earned_at', 'DESC']],
  });
  return badges;
};

// Get streak
const getStreak = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'streak_days', 'last_active'],
  });
  if (!user) throw new Error('User not found');

  const today = new Date();
  const lastActive = user.last_active ? new Date(user.last_active) : null;
  let streak = user.streak_days;

  if (lastActive) {
    const diffDays = Math.floor(
      (today - lastActive) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 1) {
      // Consecutive day — increase streak
      streak += 1;
      await user.update({ streak_days: streak, last_active: today });

      // Award streak badge at 7 days
      if (streak === 7) {
        await Badge.create({
          user_id: userId,
          badge_name: '7-Day Streak',
          badge_type: 'streak',
          badge_icon: '🔥',
        });
      }
    } else if (diffDays > 1) {
      // Missed a day — reset streak
      streak = 1;
      await user.update({ streak_days: 1, last_active: today });
    }
  } else {
    await user.update({ last_active: today });
  }

  return { streak_days: streak, last_active: today };
};

// Get leaderboard
const getLeaderboard = async () => {
  const users = await User.findAll({
    attributes: ['id', 'full_name', 'xp_total', 'level', 'streak_days'],
    order: [['xp_total', 'DESC']],
    limit: 10,
  });
  return users;
};

module.exports = { getXP, awardXP, getBadges, getStreak, getLeaderboard };