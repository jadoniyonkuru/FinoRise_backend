const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../users/user.model');
const { sendInviteEmail } = require('../../utils/mailer');

const register = async ({ full_name, email, phone, password }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error('Email already registered');

  const password_hash = await bcrypt.hash(password, 10);
  const user = await User.create({ full_name, email, phone, password_hash });

  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    xp_total: user.xp_total,
    level: user.level,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Invalid email or password');

  if (user.account_status === 'pending_invite') {
    throw Object.assign(new Error('Account not activated. Please check your email for the invite link.'), { statusCode: 403 });
  }
  if (user.account_status === 'disabled') {
    throw Object.assign(new Error('Account disabled. Please contact support.'), { statusCode: 403 });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error('Invalid email or password');

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      account_status: user.account_status,
      xp_total: user.xp_total,
      level: user.level,
      streak_days: user.streak_days,
    },
  };
};

const getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password_hash'] },
  });
  if (!user) throw new Error('User not found');
  return user;
};

const updateProfile = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');
  await user.update(data);
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isMatch) throw new Error('Current password is incorrect');

  const password_hash = await bcrypt.hash(newPassword, 10);
  await user.update({ password_hash });
  return { message: 'Password changed successfully' };
};

const inviteUser = async ({ full_name, email, role }, frontendUrl) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error('Email already registered');

  const user = await User.create({
    full_name,
    email,
    role: role || 'learner',
    account_status: 'pending_invite',
    password_hash: null,
  });

  const inviteToken = jwt.sign(
    { userId: user.id, email: user.email, type: 'invite' },
    process.env.JWT_SECRET,
    { expiresIn: '48h' }
  );

  const base = frontendUrl || process.env.FRONTEND_URL || 'http://localhost:3000';
  const inviteLink = `${base}/auth/accept-invite?token=${inviteToken}`;

  await sendInviteEmail({ to: email, full_name, inviteLink });

  return {
    message: `Invite sent to ${email}`,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      account_status: user.account_status,
      xp_total: user.xp_total,
      level: user.level,
      streak_days: user.streak_days,
    },
  };
};

const validateInviteToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'invite') throw new Error('Invalid token type');
    return decoded;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw Object.assign(new Error('Invite link has expired'), { statusCode: 410 });
    }
    throw Object.assign(new Error('Invalid invite token'), { statusCode: 400 });
  }
};

const acceptInvite = async ({ token, password }) => {
  const decoded = validateInviteToken(token);

  const user = await User.findByPk(decoded.userId);
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 400 });
  if (user.account_status !== 'pending_invite') {
    throw Object.assign(new Error('Invite already used'), { statusCode: 400 });
  }

  const password_hash = await bcrypt.hash(password, 10);
  await user.update({ password_hash, account_status: 'active' });

  const authToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token: authToken,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      account_status: user.account_status,
      xp_total: user.xp_total,
      level: user.level,
      streak_days: user.streak_days,
    },
  };
};

const resendInvite = async (userId, frontendUrl) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');
  if (user.account_status !== 'pending_invite') throw new Error('User is not in pending_invite status');

  const inviteToken = jwt.sign(
    { userId: user.id, email: user.email, type: 'invite' },
    process.env.JWT_SECRET,
    { expiresIn: '48h' }
  );

  const base = frontendUrl || process.env.FRONTEND_URL || 'http://localhost:3000';
  const inviteLink = `${base}/auth/accept-invite?token=${inviteToken}`;

  await sendInviteEmail({ to: user.email, full_name: user.full_name, inviteLink });
  return { message: 'Invite resent' };
};

module.exports = { register, login, getProfile, updateProfile, changePassword, inviteUser, validateInviteToken, acceptInvite, resendInvite };
