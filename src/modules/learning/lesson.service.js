const Lesson = require('./lesson.model');
const Module = require('./module.model');

const getLessons = async (moduleId) => {
  const mod = await Module.findByPk(moduleId);
  if (!mod) throw new Error('Module not found');
  return Lesson.findAll({
    where: { module_id: moduleId },
    order: [['order_index', 'ASC']],
  });
};

const getLessonById = async (moduleId, lessonId) => {
  const lesson = await Lesson.findOne({ where: { id: lessonId, module_id: moduleId } });
  if (!lesson) throw new Error('Lesson not found');
  return lesson;
};

const createLesson = async (moduleId, data) => {
  const mod = await Module.findByPk(moduleId);
  if (!mod) throw new Error('Module not found');
  const count = await Lesson.count({ where: { module_id: moduleId } });
  return Lesson.create({ ...data, module_id: moduleId, order_index: count + 1 });
};

const updateLesson = async (moduleId, lessonId, data) => {
  const lesson = await Lesson.findOne({ where: { id: lessonId, module_id: moduleId } });
  if (!lesson) throw new Error('Lesson not found');
  await lesson.update(data);
  return lesson;
};

const deleteLesson = async (moduleId, lessonId) => {
  const lesson = await Lesson.findOne({ where: { id: lessonId, module_id: moduleId } });
  if (!lesson) throw new Error('Lesson not found');
  await lesson.destroy();
  return { message: 'Lesson deleted' };
};

module.exports = { getLessons, getLessonById, createLesson, updateLesson, deleteLesson };
