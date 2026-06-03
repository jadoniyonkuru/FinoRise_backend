const partnerService = require('./partner.service');

const getDashboard = async (req, res) => {
  try {
    const data = await partnerService.getDashboard(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getPrograms = async (req, res) => {
  try {
    const data = await partnerService.getPrograms(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const data = await partnerService.getProfile(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const data = await partnerService.updateProfile(req.user.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getImpact = async (req, res) => {
  try {
    const data = await partnerService.getImpact(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDashboard, getPrograms, getProfile, updateProfile, getImpact };
