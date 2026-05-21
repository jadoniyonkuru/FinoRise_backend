const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../users/user.model');

// Register new user
const register = async ({ full_name, email, phone, password }) => {
  // Check if email already exists
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new Error('Email already registered');
  }

  // Hash password
  const password_hash = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    full_name,
    email,
    phone,
    password_hash,
  });

  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    xp_total: user.xp_total,
    level: user.level,
  };
};

// Login user
const login = async ({ email, password }) => {
  // Find user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
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
      xp_total: user.xp_total,
      level: user.level,
    },
  };
};

// Get user profile
const getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password_hash'] },
  });
  if (!user) throw new Error('User not found');
  return user;
};

// Update user profile
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

module.exports = { register, login, getProfile, updateProfile };