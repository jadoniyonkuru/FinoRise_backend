const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');
const Insight = require('../behavioral/insight.model');
const User = require('../users/user.model');
const AiLog = require('./aiLog.model');

// Lazy-initialized so missing key doesn't crash the server on startup
let model = null;
const getModel = () => {
  if (!model) {
    model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: 'gemini-1.5-flash',
      temperature: 0.7,
    });
  }
  return model;
};

// Base system prompt for all conversations
const BASE_SYSTEM_PROMPT = `You are FinoRise AI, a friendly and knowledgeable financial literacy coach.
You help users in Africa improve their financial decision-making skills.
You are integrated into a gamified learning platform where users complete simulations and earn XP.
Keep responses clear, practical, and encouraging.
Never give specific investment advice. Focus on financial education and good habits.
Keep responses under 200 words unless the user asks for more detail.`;

// Ask the AI assistant a financial question
const askAssistant = async (userId, message) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'full_name', 'xp_total', 'level'],
  });
  if (!user) throw new Error('User not found');

  // Get user's latest insights for personalization
  const insights = await Insight.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit: 3,
  });

  const insightSummary = insights.length > 0
    ? `The user's recent behavioral insights are: ${insights.map(i => i.insight_text).join('. ')}`
    : 'No behavioral insights available yet for this user.';

  const systemPrompt = `${BASE_SYSTEM_PROMPT}
The user's name is ${user.full_name}.
They are at level ${user.level} with ${user.xp_total} XP on the platform.
${insightSummary}
Use this context to personalize your response where relevant.`;

  const response = await getModel().invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(message),
  ]);

  const reply = response.content;

  // Log the AI interaction
  await AiLog.create({
    user_id: userId,
    prompt: message,
    response: reply,
    feature: 'qa',
  });

  return { reply };
};

// Get AI explanation for a simulation result
const explainSimulation = async (userId, simulationData) => {
  const { title, category, difficulty, userChoice, correctChoice, isCorrect, feedback } = simulationData;

  const prompt = `The user just completed a financial simulation.
Title: ${title}
Category: ${category}
Difficulty: ${difficulty}
Their choice: ${userChoice}
Correct choice: ${correctChoice}
Result: ${isCorrect ? 'Correct' : 'Incorrect'}
Simulation feedback: ${feedback}

Please explain why the correct answer is right in simple terms, and give the user one practical tip they can apply in real life related to ${category}.`;

  const response = await getModel().invoke([
    new SystemMessage(BASE_SYSTEM_PROMPT),
    new HumanMessage(prompt),
  ]);

  const reply = response.content;

  await AiLog.create({
    user_id: userId,
    prompt: `Simulation explanation: ${title}`,
    response: reply,
    feature: 'simulation_explanation',
  });

  return { reply };
};

// Get personalized recommendations based on behavioral insights
const getRecommendations = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'full_name', 'xp_total', 'level'],
  });
  if (!user) throw new Error('User not found');

  const insights = await Insight.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit: 5,
  });

  if (insights.length === 0) {
    return {
      reply: `Hi ${user.full_name}! Complete some financial simulations first so I can give you personalized recommendations based on your behavior patterns.`,
    };
  }

  const insightTexts = insights.map(i => i.insight_text).join('. ');

  const prompt = `Based on these behavioral insights for ${user.full_name} (Level ${user.level}, ${user.xp_total} XP):
${insightTexts}

Give 3 specific, actionable recommendations to help them improve their financial decision-making. 
Format each recommendation with a number and keep each one to 2 sentences max.`;

  const response = await getModel().invoke([
    new SystemMessage(BASE_SYSTEM_PROMPT),
    new HumanMessage(prompt),
  ]);

  const reply = response.content;

  await AiLog.create({
    user_id: userId,
    prompt: 'Personalized recommendations request',
    response: reply,
    feature: 'recommendations',
  });

  return { reply };
};

// Get AI learning guidance based on user level
const getLearningGuidance = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'full_name', 'xp_total', 'level', 'streak_days'],
  });
  if (!user) throw new Error('User not found');

  const prompt = `Give personalized learning guidance for ${user.full_name}.
Their current stats: Level ${user.level}, ${user.xp_total} XP, ${user.streak_days} day streak.
Suggest what financial topics they should focus on next based on their level, and motivate them to keep their streak going.`;

  const response = await getModel().invoke([
    new SystemMessage(BASE_SYSTEM_PROMPT),
    new HumanMessage(prompt),
  ]);

  const reply = response.content;

  await AiLog.create({
    user_id: userId,
    prompt: 'Learning guidance request',
    response: reply,
    feature: 'learning_guidance',
  });

  return { reply };
};

// Get AI logs for a user
const getAiLogs = async (userId) => {
  return await AiLog.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit: 20,
  });
};

module.exports = {
  askAssistant,
  explainSimulation,
  getRecommendations,
  getLearningGuidance,
  getAiLogs,
};