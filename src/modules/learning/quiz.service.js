const QuizQuestion = require('./quiz.model');
const Module = require('./module.model');
const behaviorService = require('../behavioral/behavior.service');
const { awardXP } = require('../gamification/gamification.service');

const getQuiz = async (moduleId) => {
  const mod = await Module.findByPk(moduleId);
  if (!mod) throw new Error('Module not found');
  const questions = await QuizQuestion.findAll({
    where: { module_id: moduleId },
    // Strip correct_answer so learner can't see it
    attributes: ['id', 'question', 'options', 'xp_reward'],
  });
  return { module_id: moduleId, questions };
};

const submitQuiz = async (userId, moduleId, answers) => {
  // answers: [{ question_id, answer }]
  const mod = await Module.findByPk(moduleId);
  if (!mod) throw new Error('Module not found');

  const questions = await QuizQuestion.findAll({ where: { module_id: moduleId } });
  if (questions.length === 0) throw new Error('No quiz questions found for this module');

  let correct = 0;
  let xpEarned = 0;
  const results = questions.map((q) => {
    const submitted = answers.find((a) => a.question_id === q.id);
    const isCorrect = submitted && submitted.answer === q.correct_answer;
    if (isCorrect) {
      correct++;
      xpEarned += q.xp_reward;
    }
    return {
      question_id: q.id,
      correct: isCorrect,
      correct_answer: q.correct_answer,
    };
  });

  const score = Math.round((correct / questions.length) * 100);

  // Award XP to user (also recalculates level)
  if (xpEarned > 0) {
    await awardXP(userId, xpEarned, `Quiz: ${mod.title}`);
  }

  // Log behavior event
  await behaviorService.logBehaviorEvent(userId, 'module_completed', {
    category: mod.category || 'general',
    difficulty: mod.difficulty,
    is_correct: score >= 70,
    meta: { module_id: moduleId, score, quiz: true },
  });

  return {
    score,
    correct_answers: correct,
    total_questions: questions.length,
    xp_earned: xpEarned,
    passed: score >= 70,
    results,
  };
};

const addQuestion = async (moduleId, data) => {
  const mod = await Module.findByPk(moduleId);
  if (!mod) throw new Error('Module not found');
  return QuizQuestion.create({ ...data, module_id: moduleId });
};

const deleteQuestion = async (moduleId, questionId) => {
  const question = await QuizQuestion.findOne({ where: { id: questionId, module_id: moduleId } });
  if (!question) throw new Error('Question not found');
  await question.destroy();
  return { message: 'Question deleted' };
};

module.exports = { getQuiz, submitQuiz, addQuestion, deleteQuestion };
