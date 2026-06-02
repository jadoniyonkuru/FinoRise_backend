const lessonService = require('./lesson.service');

const getLessons = async (req, res) => {
  try {
    const lessons = await lessonService.getLessons(req.params.id);
    res.status(200).json({ success: true, data: lessons });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lesson = await lessonService.getLessonById(req.params.id, req.params.lessonId);
    res.status(200).json({ success: true, data: lesson });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const createLesson = async (req, res) => {
  try {
    const lesson = await lessonService.createLesson(req.params.id, req.body);
    res.status(201).json({ success: true, data: lesson });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const lesson = await lessonService.updateLesson(req.params.id, req.params.lessonId, req.body);
    res.status(200).json({ success: true, data: lesson });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const result = await lessonService.deleteLesson(req.params.id, req.params.lessonId);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

module.exports = { getLessons, getLessonById, createLesson, updateLesson, deleteLesson };
