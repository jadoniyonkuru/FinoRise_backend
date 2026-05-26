const behaviorService = require('./behavior.service');

const getUserEvents = async (req, res) => {
  try {
    const events = await behaviorService.getUserEvents(req.user.id);
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const analyzeAndGenerateInsights = async (req, res) => {
  try {
    const insights = await behaviorService.analyzeAndGenerateInsights(req.user.id);
    res.status(200).json({ success: true, data: insights });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUserInsights = async (req, res) => {
  try {
    const insights = await behaviorService.getUserInsights(req.user.id);
    res.status(200).json({ success: true, data: insights });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const markInsightRead = async (req, res) => {
  try {
    const insight = await behaviorService.markInsightRead(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: insight });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  getUserEvents,
  analyzeAndGenerateInsights,
  getUserInsights,
  markInsightRead,
};