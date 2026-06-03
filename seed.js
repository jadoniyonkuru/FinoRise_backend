/**
 * FinoRise seed script
 * Run from the backend root: node seed.js
 * Creates modules, lessons, quiz questions, simulations, and rewards.
 */

require('dotenv').config();
const sequelize = require('./src/config/database');

// Import models (this also registers associations)
const Module      = require('./src/modules/learning/module.model');
const Lesson      = require('./src/modules/learning/lesson.model');
const QuizQuestion = require('./src/modules/learning/quiz.model');
const Simulation  = require('./src/modules/simulations/simulation.model');
const SimStep     = require('./src/modules/simulations/simStep.model');
const SimChoice   = require('./src/modules/simulations/simChoice.model');
const Reward      = require('./src/modules/rewards/reward.model');
const User        = require('./src/modules/users/user.model');

async function seed() {
  await sequelize.authenticate();
  console.log('✅ Database connected');

  // ── Find an admin user to use as created_by ─────────────────────────────────
  let admin = await User.findOne({ where: { role: 'admin' } });
  if (!admin) {
    console.log('⚠️  No admin user found. Create one via /api/auth/register first.');
    process.exit(1);
  }
  console.log(`✅ Using admin: ${admin.full_name} (${admin.id})`);

  // ── MODULES ─────────────────────────────────────────────────────────────────

  const modulesData = [
    {
      title: 'Foundations of Saving',
      description: 'Learn the core principles of saving money, building an emergency fund, and developing healthy financial habits that last a lifetime.',
      category: 'budgeting',
      difficulty: 'beginner',
      xp_reward: 200,
      is_published: true,
    },
    {
      title: 'Smart Debt Management',
      description: 'Understand how debt works, compare repayment strategies, and learn to eliminate debt faster while protecting your credit score.',
      category: 'debt',
      difficulty: 'intermediate',
      xp_reward: 300,
      is_published: true,
    },
    {
      title: 'Introduction to Investing',
      description: 'Discover how to make your money work for you through stocks, bonds, mutual funds, and diversification principles.',
      category: 'investing',
      difficulty: 'intermediate',
      xp_reward: 350,
      is_published: true,
    },
  ];

  const createdModules = [];
  for (const m of modulesData) {
    const [mod, created] = await Module.findOrCreate({
      where: { title: m.title },
      defaults: m,
    });
    createdModules.push(mod);
    console.log(`${created ? '✅ Created' : '⏭️  Exists'} module: ${mod.title}`);
  }

  // ── LESSONS ─────────────────────────────────────────────────────────────────

  const lessonsByModule = [
    // Module 0: Foundations of Saving
    [
      {
        title: 'Why Saving Matters',
        content: `Saving money is the foundation of financial health. Without savings, every unexpected expense becomes a crisis — a car repair, a medical bill, or a job loss can derail your entire financial life.

The goal of this lesson is to understand the "why" behind saving so that it becomes a habit rather than a chore.

Key concepts:
• Financial security: Savings create a buffer between you and financial disaster.
• Opportunity cost: Money saved today earns interest or can be invested for greater returns tomorrow.
• Psychological benefit: Knowing you have savings reduces stress and gives you confidence.

The 50/30/20 rule is a simple starting framework:
- 50% of income → needs (rent, food, transport)
- 30% of income → wants (entertainment, dining out)
- 20% of income → savings and debt repayment

Even saving RWF 5,000 per month adds up to RWF 60,000 per year. Small consistent actions compound over time.`,
        order_index: 1,
        duration_minutes: 8,
      },
      {
        title: 'Building Your Emergency Fund',
        content: `An emergency fund is 3–6 months of your essential expenses kept in a liquid, accessible account.

Why 3–6 months? Because that is roughly how long it takes to find new income after a job loss, recover from a major illness, or stabilize after a crisis.

How to build it:
1. Calculate your monthly essential expenses (rent + food + transport + utilities)
2. Multiply by 3 (minimum) or 6 (recommended)
3. Open a dedicated savings account — separate from your everyday account
4. Set up an automatic transfer on payday so you save before you spend

Where to keep it:
- High-yield savings account
- Fixed deposit (short-term)
- Mobile money savings wallet

What it is NOT for:
- Vacations
- Impulse purchases
- Investments

Treat your emergency fund as insurance, not opportunity. The day you need it, you will be incredibly glad it exists.`,
        order_index: 2,
        duration_minutes: 10,
      },
      {
        title: 'Automating Your Savings',
        content: `The single most effective savings strategy is automation. When saving requires willpower, you will eventually fail. When it is automatic, it requires nothing from you.

"Pay yourself first" principle:
Transfer money to savings the moment your salary arrives — before you pay bills, before you buy groceries. Whatever is left after savings is what you live on.

How to automate:
1. Set up a standing order with your bank to transfer a fixed amount to savings every payday.
2. Use apps like mobile banking that allow scheduled transfers.
3. If your employer allows salary splitting, direct 20% straight to a savings account.

Increasing your savings rate:
Start with whatever is comfortable — even 5%. Each time you get a raise, increase your savings rate by half of the raise. If you get a 10% raise, increase savings by 5% and keep 5% as lifestyle improvement.

The key insight: You will adapt to whatever amount you have left to spend. Your lifestyle adjusts to your take-home. So make your take-home smaller by paying yourself first.`,
        order_index: 3,
        duration_minutes: 7,
      },
    ],
    // Module 1: Smart Debt Management
    [
      {
        title: 'Understanding How Debt Works',
        content: `Debt is not inherently bad. A mortgage helps you own a home. A student loan can increase your earning power. But bad debt — high-interest consumer debt — is a wealth destroyer.

Types of debt:
• Good debt: Low interest, used to acquire assets or education (mortgage, student loan)
• Bad debt: High interest, used to fund consumption (credit cards, payday loans)

The cost of debt:
A credit card balance of RWF 500,000 at 22% annual interest, with only minimum payments, will take over 7 years to pay off and cost you RWF 350,000+ in interest alone.

Understanding interest:
- APR (Annual Percentage Rate) is the true cost of borrowing per year
- Monthly interest = (APR / 12) × balance
- The higher the APR, the more urgent it is to pay off the debt

Your debt-to-income ratio:
Total monthly debt payments ÷ gross monthly income. Keep this below 36%. Above 43% is considered high risk by lenders.

The first step to managing debt is understanding exactly what you owe, to whom, at what interest rate, and what the minimum payment is.`,
        order_index: 1,
        duration_minutes: 12,
      },
      {
        title: 'Avalanche vs Snowball Methods',
        content: `There are two proven strategies for paying off multiple debts:

THE AVALANCHE METHOD
Pay minimum on all debts. Direct all extra money to the highest interest rate debt first.

Example:
- Credit Card (22% APR) — minimum RWF 15,000
- Personal Loan (15% APR) — minimum RWF 10,000
- Car Loan (9% APR) — minimum RWF 25,000

With RWF 20,000 extra per month: put it all toward the credit card first.

Result: You pay the least total interest. Mathematically optimal.

THE SNOWBALL METHOD
Pay minimum on all debts. Direct all extra money to the smallest balance first.

Result: You pay off debts faster in terms of number of accounts. Each paid-off debt releases its minimum payment as extra for the next. This creates momentum and psychological wins.

WHICH IS BETTER?
Research shows most people succeed more with the Snowball method because of the psychological reinforcement. But if you are disciplined, the Avalanche saves more money.

Recommendation: Use Avalanche if your interest rates vary significantly (15%+ spread). Use Snowball if motivation is your challenge.`,
        order_index: 2,
        duration_minutes: 10,
      },
    ],
    // Module 2: Introduction to Investing
    [
      {
        title: 'The Power of Compound Interest',
        content: `Albert Einstein allegedly called compound interest "the eighth wonder of the world." Whether or not he said it, the math proves the point.

Compound interest means earning interest on your interest. Over time, this creates exponential growth.

Example:
RWF 100,000 invested at 10% annual return:
- After 10 years: RWF 259,374
- After 20 years: RWF 672,750
- After 30 years: RWF 1,744,940

You invested RWF 100,000. Time and compounding did the rest.

The rule of 72:
Divide 72 by your expected annual return to find how many years it takes to double your money.
- At 6% → doubles every 12 years
- At 10% → doubles every 7.2 years
- At 12% → doubles every 6 years

The most important variable: time. Starting 10 years earlier is worth more than doubling your investment amount. The best time to start investing was yesterday. The second best time is today.`,
        order_index: 1,
        duration_minutes: 9,
      },
      {
        title: 'Asset Classes and Diversification',
        content: `An asset class is a group of investments that behave similarly in the market.

Main asset classes:
1. Equities (stocks): Ownership in a company. Highest potential returns, highest risk.
2. Fixed income (bonds): Loans to governments or companies. Steady income, lower risk.
3. Real estate: Physical property or REITs. Inflation hedge, illiquid.
4. Cash equivalents: Savings accounts, T-bills. Lowest risk, lowest return.
5. Alternative assets: Commodities, crypto, private equity.

Diversification:
"Don't put all your eggs in one basket" is the oldest investment advice for a reason.

When you diversify:
- If stocks fall, bonds may hold steady
- If one sector crashes, others may rise
- Your overall portfolio volatility decreases without necessarily reducing expected returns

Asset allocation by age (rule of thumb):
- % in bonds ≈ your age
- So at age 25: 75% stocks, 25% bonds
- At age 50: 50% stocks, 50% bonds

As you age, you want less volatility because you have less time to recover from market drops. Younger investors can afford to take more risk because time is on their side.`,
        order_index: 2,
        duration_minutes: 11,
      },
    ],
  ];

  for (let i = 0; i < createdModules.length; i++) {
    const mod = createdModules[i];
    const lessons = lessonsByModule[i];
    for (const l of lessons) {
      const [lesson, created] = await Lesson.findOrCreate({
        where: { module_id: mod.id, title: l.title },
        defaults: { ...l, module_id: mod.id },
      });
      console.log(`  ${created ? '✅' : '⏭️ '} Lesson: ${lesson.title}`);
    }
  }

  // ── QUIZ QUESTIONS ──────────────────────────────────────────────────────────

  const quizByModule = [
    // Module 0: Foundations of Saving
    [
      {
        question: 'What is the recommended size of an emergency fund?',
        options: ['1 month of expenses', '3–6 months of expenses', '12 months of expenses', 'One full year of salary'],
        correct_answer: '3–6 months of expenses',
        xp_reward: 50,
      },
      {
        question: 'What does "Pay Yourself First" mean?',
        options: [
          'Pay your bills before anything else',
          'Transfer money to savings immediately when you receive income',
          'Reward yourself with a purchase after each paycheck',
          'Prioritize paying off your highest debt',
        ],
        correct_answer: 'Transfer money to savings immediately when you receive income',
        xp_reward: 50,
      },
      {
        question: 'In the 50/30/20 rule, what percentage goes to savings and debt repayment?',
        options: ['10%', '20%', '30%', '50%'],
        correct_answer: '20%',
        xp_reward: 50,
      },
    ],
    // Module 1: Smart Debt Management
    [
      {
        question: 'Which debt repayment method saves the most money in total interest paid?',
        options: ['Snowball method', 'Avalanche method', 'Minimum payment method', 'Consolidation method'],
        correct_answer: 'Avalanche method',
        xp_reward: 75,
      },
      {
        question: 'What is considered a high-risk debt-to-income ratio?',
        options: ['Above 20%', 'Above 30%', 'Above 43%', 'Above 60%'],
        correct_answer: 'Above 43%',
        xp_reward: 75,
      },
      {
        question: 'Which type of debt is generally considered "good debt"?',
        options: ['Credit card balance', 'Payday loan', 'Mortgage for a home', 'Retail store credit'],
        correct_answer: 'Mortgage for a home',
        xp_reward: 75,
      },
    ],
    // Module 2: Investing
    [
      {
        question: 'Using the Rule of 72, how long does it take to double your money at 9% annual return?',
        options: ['6 years', '8 years', '10 years', '12 years'],
        correct_answer: '8 years',
        xp_reward: 100,
      },
      {
        question: 'Which asset class typically offers the highest potential returns but also the highest risk?',
        options: ['Bonds', 'Cash equivalents', 'Real estate', 'Equities (stocks)'],
        correct_answer: 'Equities (stocks)',
        xp_reward: 100,
      },
      {
        question: 'What is the primary purpose of diversification in investing?',
        options: [
          'To maximize returns by concentrating in the best asset',
          'To reduce portfolio volatility by spreading risk across asset classes',
          'To avoid paying taxes on gains',
          'To ensure you always beat the market',
        ],
        correct_answer: 'To reduce portfolio volatility by spreading risk across asset classes',
        xp_reward: 100,
      },
    ],
  ];

  for (let i = 0; i < createdModules.length; i++) {
    const mod = createdModules[i];
    const questions = quizByModule[i];
    for (const q of questions) {
      const [, created] = await QuizQuestion.findOrCreate({
        where: { module_id: mod.id, question: q.question },
        defaults: { ...q, module_id: mod.id },
      });
      console.log(`  ${created ? '✅' : '⏭️ '} Quiz question: ${q.question.slice(0, 50)}…`);
    }
  }

  // ── SIMULATIONS ─────────────────────────────────────────────────────────────

  // Simulation 1: Budget Emergency
  const [sim1, sim1Created] = await Simulation.findOrCreate({
    where: { title: 'The Emergency Fund Test' },
    defaults: {
      title: 'The Emergency Fund Test',
      description: 'Your car breaks down and you face an unexpected RWF 150,000 repair bill. You have RWF 300,000 in savings. How you handle this emergency will define your financial resilience.',
      category: 'budgeting',
      difficulty: 'beginner',
      xp_reward: 150,
      is_published: true,
      created_by: admin.id,
    },
  });
  console.log(`${sim1Created ? '✅ Created' : '⏭️  Exists'} simulation: ${sim1.title}`);

  if (sim1Created) {
    const step1 = await SimStep.create({
      simulation_id: sim1.id,
      step_number: 1,
      scenario_text: 'Your car breaks down and the mechanic says it needs RWF 150,000 in repairs. Without this car you cannot get to work. You have RWF 300,000 in savings. What do you do?',
      is_first_step: true,
    });

    const step2 = await SimStep.create({
      simulation_id: sim1.id,
      step_number: 2,
      scenario_text: 'You paid for the car repair. Your savings are now lower. Next month you receive your salary of RWF 200,000. What is your top financial priority?',
      is_first_step: false,
    });

    // Choices for step 1 — all lead to step 2
    await SimChoice.bulkCreate([
      {
        step_id: step1.id,
        choice_text: 'Use RWF 150,000 from emergency savings and keep the rest',
        outcome_text: 'Smart move. This is exactly what your emergency fund is for. You have RWF 150,000 remaining as a buffer while you rebuild.',
        financial_impact: 20,
        xp_bonus: 25,
        next_step_id: step2.id,
      },
      {
        step_id: step1.id,
        choice_text: 'Take a personal loan to cover the repair and keep savings intact',
        outcome_text: 'Conservative thinking, but loans have interest costs. You preserve savings but now have a monthly loan payment eating into your income.',
        financial_impact: -5,
        xp_bonus: 10,
        next_step_id: step2.id,
      },
      {
        step_id: step1.id,
        choice_text: 'Put the repair on a credit card at 22% interest',
        outcome_text: 'Costly mistake. At 22% interest, this will cost you an extra RWF 33,000 per year unless paid off immediately. Avoid high-interest debt when savings are available.',
        financial_impact: -20,
        xp_bonus: 0,
        next_step_id: step2.id,
      },
    ]);

    // Choices for step 2 — all end the simulation (next_step_id = null)
    await SimChoice.bulkCreate([
      {
        step_id: step2.id,
        choice_text: 'Rebuild the emergency fund first before anything else',
        outcome_text: 'Excellent financial discipline. Rebuilding your safety net is the top priority after using emergency savings. You are thinking long-term.',
        financial_impact: 25,
        xp_bonus: 30,
        next_step_id: null,
      },
      {
        step_id: step2.id,
        choice_text: 'Invest half the salary and use the other half for expenses',
        outcome_text: 'Investing is important but not before rebuilding your emergency cushion. Without a safety net, the next emergency will force you to sell investments at a bad time.',
        financial_impact: -10,
        xp_bonus: 5,
        next_step_id: null,
      },
      {
        step_id: step2.id,
        choice_text: 'Treat yourself — you have been stressed and deserve it',
        outcome_text: 'Lifestyle spending after a financial setback is the opposite of what you need. Reward systems are fine, but only after rebuilding your financial foundation.',
        financial_impact: -25,
        xp_bonus: 0,
        next_step_id: null,
      },
    ]);
    console.log('  ✅ Created steps and choices for Simulation 1');
  }

  // Simulation 2: Debt Payoff Strategy
  const [sim2, sim2Created] = await Simulation.findOrCreate({
    where: { title: 'Debt Payoff Strategy' },
    defaults: {
      title: 'Debt Payoff Strategy',
      description: 'You have three debts with different interest rates and balances. You have RWF 50,000 extra per month to put toward debt. Choose the right strategy to become debt-free.',
      category: 'debt',
      difficulty: 'intermediate',
      xp_reward: 200,
      is_published: true,
      created_by: admin.id,
    },
  });
  console.log(`${sim2Created ? '✅ Created' : '⏭️  Exists'} simulation: ${sim2.title}`);

  if (sim2Created) {
    const step1 = await SimStep.create({
      simulation_id: sim2.id,
      step_number: 1,
      scenario_text: 'You have three debts: Credit Card (RWF 200,000 @ 22% APR), Personal Loan (RWF 500,000 @ 14% APR), Car Loan (RWF 800,000 @ 9% APR). You have RWF 50,000 extra per month. Which strategy do you use?',
      is_first_step: true,
    });

    const step2 = await SimStep.create({
      simulation_id: sim2.id,
      step_number: 2,
      scenario_text: '8 months later. You have been making progress on your debts. You receive a work bonus of RWF 300,000. Your credit card is almost paid off. What do you do with the bonus?',
      is_first_step: false,
    });

    await SimChoice.bulkCreate([
      {
        step_id: step1.id,
        choice_text: 'Avalanche: Attack the credit card at 22% first, minimum on others',
        outcome_text: 'Mathematically optimal. By eliminating the 22% interest debt first, you save the most in total interest paid — approximately RWF 85,000 over the course of repayment.',
        financial_impact: 30,
        xp_bonus: 30,
        next_step_id: step2.id,
      },
      {
        step_id: step1.id,
        choice_text: 'Snowball: Pay off the credit card first (smallest balance) for a quick win',
        outcome_text: 'Good choice for motivation. Since the credit card also happens to be the smallest balance AND the highest rate, snowball and avalanche give the same result here. Smart thinking.',
        financial_impact: 20,
        xp_bonus: 20,
        next_step_id: step2.id,
      },
      {
        step_id: step1.id,
        choice_text: 'Split equally: Put RWF 16,666 extra toward each debt',
        outcome_text: 'Spreading payments reduces the power of your extra money. You are paying down low-interest debt instead of eliminating high-interest debt first, costing you more over time.',
        financial_impact: -10,
        xp_bonus: 5,
        next_step_id: step2.id,
      },
    ]);

    await SimChoice.bulkCreate([
      {
        step_id: step2.id,
        choice_text: 'Apply the entire RWF 300,000 lump sum to finish the credit card and attack the personal loan',
        outcome_text: 'Excellent! Eliminating the credit card frees up its minimum payment as extra ammunition on the personal loan. Lump sums on high-interest debt are highly effective.',
        financial_impact: 35,
        xp_bonus: 40,
        next_step_id: null,
      },
      {
        step_id: step2.id,
        choice_text: 'Save half (RWF 150,000) and use RWF 150,000 toward debt',
        outcome_text: 'Balanced approach. Reasonable if your emergency fund needs rebuilding, but if the fund is full, the 22% interest debt should take priority over savings earning 5–7%.',
        financial_impact: 10,
        xp_bonus: 15,
        next_step_id: null,
      },
      {
        step_id: step2.id,
        choice_text: 'Invest the entire bonus — market returns beat debt interest',
        outcome_text: 'Risky logic. Market returns are uncertain. Your credit card charges a guaranteed 22%. No investment reliably beats paying off 22% guaranteed interest. This is almost never the right call.',
        financial_impact: -15,
        xp_bonus: 5,
        next_step_id: null,
      },
    ]);
    console.log('  ✅ Created steps and choices for Simulation 2');
  }

  // ── REWARDS ─────────────────────────────────────────────────────────────────

  const rewardsData = [
    {
      title: 'MTN Airtime Bundle',
      description: 'RWF 1,000 airtime + 1GB data valid for 7 days. Instantly credited to your registered number.',
      reward_type: 'airtime',
      xp_cost: 400,
      quantity: 100,
      is_active: true,
    },
    {
      title: 'Lunch Discount Voucher',
      description: '20% off at partner restaurants in Kigali. Valid for one meal. Show your code at checkout.',
      reward_type: 'discount',
      xp_cost: 300,
      quantity: 50,
      is_active: true,
    },
    {
      title: 'FinoRise Pro – 1 Month',
      description: 'Unlock all advanced analytics, unlimited AI Coach sessions, and exclusive simulations for one month.',
      reward_type: 'partner_offer',
      xp_cost: 1500,
      quantity: null,
      is_active: true,
    },
    {
      title: 'Financial Literacy Certificate',
      description: 'Official digital certificate of completion. Shareable on LinkedIn. Issued after completing 3+ modules.',
      reward_type: 'voucher',
      xp_cost: 800,
      quantity: null,
      is_active: true,
    },
  ];

  for (const r of rewardsData) {
    const [, created] = await Reward.findOrCreate({
      where: { title: r.title },
      defaults: r,
    });
    console.log(`${created ? '✅ Created' : '⏭️  Exists'} reward: ${r.title}`);
  }

  console.log('\n🎉 Seed complete! Summary:');
  console.log(`   Modules:     ${createdModules.length}`);
  console.log(`   Simulations: 2`);
  console.log(`   Rewards:     ${rewardsData.length}`);
  console.log('\n   Learners can now browse modules, take quizzes, run simulations, and redeem rewards.');

  await sequelize.close();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  console.error(err);
  process.exit(1);
});
