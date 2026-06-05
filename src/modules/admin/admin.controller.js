const adminService = require('./admin.service');

const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json({ users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await adminService.deleteUser(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const result = await adminService.updateUser(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const inviteUser = async (req, res) => {
  try {
    const { full_name, email, role } = req.body;
    if (!full_name || !email) {
      return res.status(400).json({ message: 'full_name and email are required' });
    }
    const result = await adminService.inviteUser({ full_name, email, role }, req);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const resendInvite = async (req, res) => {
  try {
    const result = await adminService.resendInvite(req.params.id, req);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const data = await adminService.getAnalytics();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getAllUsers, deleteUser, updateUser, inviteUser, resendInvite, getAnalytics };
