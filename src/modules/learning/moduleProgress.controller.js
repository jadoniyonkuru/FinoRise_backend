const progressService = require('./moduleProgress.service');

const getMyProgress = async (req, res) => {
  try {
    const data = await progressService.getMyProgress(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const completeModule = async (req, res) => {
  try {
    const data = await progressService.completeModule(req.user.id, req.params.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { getMyProgress, completeModule };
