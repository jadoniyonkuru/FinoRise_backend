const analyticsService = require('./analytics.service');

const getLearnerAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getLearnerAnalytics(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getLearnerAnalytics };
