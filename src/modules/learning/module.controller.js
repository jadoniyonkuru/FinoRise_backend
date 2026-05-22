const moduleService = require('./module.service');

const getAllModules = async (req, res) => {
  try {
    const modules = await moduleService.getAllModules();
    res.status(200).json({ success: true, data: modules });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getModuleById = async (req, res) => {
  try {
    const module = await moduleService.getModuleById(req.params.id);
    res.status(200).json({ success: true, data: module });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const createModule = async (req, res) => {
  try {
    const module = await moduleService.createModule({
      ...req.body,
      created_by: req.user.id,
    });
    res.status(201).json({ success: true, data: module });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateModule = async (req, res) => {
  try {
    const module = await moduleService.updateModule(req.params.id, req.body);
    res.status(200).json({ success: true, data: module });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteModule = async (req, res) => {
  try {
    const result = await moduleService.deleteModule(req.params.id);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
};