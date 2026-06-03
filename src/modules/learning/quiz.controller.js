const quizService = require('./quiz.service');

const getQuiz = async (req, res) => {
  try {
    const data = await quizService.getQuiz(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'answers array is required' });
    }
    const result = await quizService.submitQuiz(req.user.id, req.params.id, answers);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const addQuestion = async (req, res) => {
  try {
    const question = await quizService.addQuestion(req.params.id, req.body);
    res.status(201).json({ success: true, data: question });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const result = await quizService.deleteQuestion(req.params.id, req.params.questionId);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

module.exports = { getQuiz, submitQuiz, addQuestion, deleteQuestion };
