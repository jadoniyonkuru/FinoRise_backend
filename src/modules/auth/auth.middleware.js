const jwt = require('jsonwebtoken');

const ADMIN_ROLES = ['admin', 'module_manager', 'simulation_manager', 'rewards_manager', 'analytics_viewer'];

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admins only' });
  }
  next();
};

const partnerOnly = (req, res, next) => {
  if (req.user.role !== 'partner') {
    return res.status(403).json({ message: 'Access denied, partners only' });
  }
  next();
};

const moduleManagerOrAdmin = (req, res, next) => {
  if (!['admin', 'module_manager'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

const simulationManagerOrAdmin = (req, res, next) => {
  if (!['admin', 'simulation_manager'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

const rewardsManagerOrAdmin = (req, res, next) => {
  if (!['admin', 'rewards_manager'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

const analyticsViewerOrAdmin = (req, res, next) => {
  if (!['admin', 'analytics_viewer'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

const staffOnly = (req, res, next) => {
  if (!ADMIN_ROLES.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = {
  protect,
  adminOnly,
  partnerOnly,
  moduleManagerOrAdmin,
  simulationManagerOrAdmin,
  rewardsManagerOrAdmin,
  analyticsViewerOrAdmin,
  staffOnly,
};
