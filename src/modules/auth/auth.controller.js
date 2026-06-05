const authService = require('./auth.service');

const register = async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;
    if (!full_name || !email || !password) {
      return res.status(400).json({ message: 'full_name, email and password are required' });
    }
    const user = await authService.register({ full_name, email, phone, password });
    res.status(201).json({ message: 'Registration successful', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const result = await authService.login({ email, password });
    res.status(200).json({ message: 'Login successful', ...result });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.status(200).json({ user });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updated = await authService.updateProfile(req.user.id, req.body);
    res.status(200).json({ message: 'Profile updated', user: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res.status(400).json({ message: 'current_password and new_password are required' });
    }
    const result = await authService.changePassword(req.user.id, current_password, new_password);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const validateInvite = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Token is required' });
    const decoded = authService.validateInviteToken(token);
    const User = require('../users/user.model');
    const user = await User.findByPk(decoded.userId, {
      attributes: ['email', 'full_name', 'role'],
    });
    if (!user) return res.status(400).json({ message: 'User not found' });
    res.status(200).json({ email: user.email, full_name: user.full_name, role: user.role });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

const acceptInvite = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: 'token and password are required' });
    }
    const result = await authService.acceptInvite({ token, password });
    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

module.exports = { register, login, getProfile, updateProfile, changePassword, validateInvite, acceptInvite };
