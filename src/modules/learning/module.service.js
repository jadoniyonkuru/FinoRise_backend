const Module = require('./module.model');

const getAllModules = async () => {
  return await Module.findAll({
    where: { is_published: true },
    order: [['order_index', 'ASC']],
  });
};

const getModuleById = async (id) => {
  const module = await Module.findByPk(id);
  if (!module) throw new Error('Module not found');
  return module;
};

const createModule = async (data) => {
  return await Module.create(data);
};

const updateModule = async (id, data) => {
  const module = await Module.findByPk(id);
  if (!module) throw new Error('Module not found');
  await module.update(data);
  return module;
};

const deleteModule = async (id) => {
  const module = await Module.findByPk(id);
  if (!module) throw new Error('Module not found');
  await module.destroy();
  return { message: 'Module deleted' };
};

module.exports = {
  getAllModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
};