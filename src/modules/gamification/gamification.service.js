const { v4: uuidv4 } = require('uuid');
const User = require('../users/user.model');
const Badge = require('./badge.model');
const XPTransaction = require('./xpTransaction.model');

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

const calculateLevel = (xp) => {
  let currentLevel = 1;
  for (const l of LEVELS) {
    if (xp >= l.minXP) currentLevel = l.level;
  }
  return currentLevel;
};

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

  await XPTransaction.create({
    user_id: userId,
    amount,
    source_type: 'simulation',
    description: reason || 'XP awarded',
  });

  if (leveledUp) {
    await Badge.create({
      id: uuidv4(),
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

const getBadges = async (userId) => {
  const badges = await Badge.findAll({
    where: { user_id: userId },
    order: [['earned_at', 'DESC']],
  });
  return badges;
};

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
      streak += 1;
      await user.update({ streak_days: streak, last_active: today });

      if (streak === 7) {
        await Badge.create({
          id: uuidv4(),
          user_id: userId,
          badge_name: '7-Day Streak',
          badge_type: 'streak',
          badge_icon: '🔥',
        });
      }
    } else if (diffDays > 1) {
      streak = 1;
      await user.update({ streak_days: 1, last_active: today });
    }
  } else {
    await user.update({ last_active: today });
  }

  return { streak_days: streak, last_active: today };
};

const recordStreak = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = user.last_active ? new Date(user.last_active) : null;
  let streak = user.streak_days;

  if (lastActive) {
    const last = new Date(lastActive);
    last.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Already active today — keep streak unchanged
      return { streak_days: streak, last_activity_date: today.toISOString().split('T')[0] };
    } else if (diffDays === 1) {
      streak += 1;
    } else {
      streak = 1;
    }
  } else {
    streak = 1;
  }

  await user.update({ streak_days: streak, last_active: new Date() });

  if (streak === 7 || streak === 30) {
    await Badge.create({
      id: uuidv4(),
      user_id: userId,
      badge_name: `${streak}-Day Streak`,
      badge_type: 'streak',
      badge_icon: '🔥',
    });
  }

  return { streak_days: streak, last_activity_date: today.toISOString().split('T')[0] };
};

const getLeaderboard = async () => {
  const users = await User.findAll({
    attributes: ['id', 'full_name', 'xp_total', 'level', 'streak_days'],
    order: [['xp_total', 'DESC']],
    limit: 10,
  });
  return users;
};

module.exports = { getXP, awardXP, getBadges, getStreak, recordStreak, getLeaderboard };
