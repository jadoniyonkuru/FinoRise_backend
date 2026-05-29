const aiService = require('./ai.service');

const askAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });
    const result = await aiService.askAssistant(req.user.id, message);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const explainSimulation = async (req, res) => {
  try {
    const result = await aiService.explainSimulation(req.user.id, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const result = await aiService.getRecommendations(req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getLearningGuidance = async (req, res) => {
  try {
    const result = await aiService.getLearningGuidance(req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAiLogs = async (req, res) => {
  try {
    const logs = await aiService.getAiLogs(req.user.id);
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  askAssistant,
  explainSimulation,
  getRecommendations,
  getLearningGuidance,
  getAiLogs,
};