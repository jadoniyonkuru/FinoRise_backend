const Module = require('./module.model');

const STAFF_ROLES = ['admin', 'module_manager', 'simulation_manager', 'rewards_manager', 'analytics_viewer'];

const getAllModules = async (role) => {
  const where = STAFF_ROLES.includes(role) ? {} : { is_published: true };
  return Module.findAll({ where, order: [['order_index', 'ASC']] });
};

const getModuleById = async (id) => {
  const module = await Module.findByPk(id);
  if (!module) throw new Error('Module not found');
  return module;
};

const createModule = async (data) => {
  const count = await Module.count();
  return Module.create({ ...data, order_index: count + 1 });
};

const updateModule = async (id, data, role) => {
  const module = await Module.findByPk(id);
  if (!module) throw new Error('Module not found');
  if (data.is_published === true && role !== 'admin') {
    throw Object.assign(new Error('Only admin can publish modules'), { statusCode: 403 });
  }
  await module.update(data);
  return module;
};

const deleteModule = async (id) => {
  const module = await Module.findByPk(id);
  if (!module) throw new Error('Module not found');
  await module.destroy();
  return { message: 'Module deleted' };
};

module.exports = { getAllModules, getModuleById, createModule, updateModule, deleteModule };
