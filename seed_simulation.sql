BEGIN;

-- Simulation
INSERT INTO simulations (id, title, description, category, difficulty, xp_reward, is_published, created_at)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Emergency Fund Challenge',
  'Your car breaks down and needs $800 repair. How do you handle it?',
  'emergency',
  'beginner',
  200,
  true,
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Step 1
INSERT INTO sim_steps (id, simulation_id, step_number, scenario_text, is_first_step)
VALUES (
  'b1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  1,
  'Your car breaks down. Repair costs $800. You have $1,200 in savings and $2,500 credit card limit. What do you do?',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Step 2
INSERT INTO sim_steps (id, simulation_id, step_number, scenario_text, is_first_step)
VALUES (
  'c1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  2,
  'Good choice! You paid from savings. Now your savings are $400. Next month a medical bill of $200 arrives. What do you do?',
  false
)
ON CONFLICT (id) DO NOTHING;

-- Choice 1A: step 1 -> step 2 (good)
INSERT INTO sim_choices (id, step_id, choice_text, outcome_text, next_step_id, financial_impact, xp_bonus)
VALUES (
  'd1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'b1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Pay from savings — avoid interest charges',
  'Smart move! Paying cash avoids credit card interest.',
  'c1b2c3d4-e5f6-7890-abcd-ef1234567890',
  10,
  50
)
ON CONFLICT (id) DO NOTHING;

-- Choice 1B: step 1 -> end (bad)
INSERT INTO sim_choices (id, step_id, choice_text, outcome_text, next_step_id, financial_impact, xp_bonus)
VALUES (
  'e1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'b1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Put it on credit card — keep my savings',
  'This will cost you more in interest over time.',
  null,
  -10,
  0
)
ON CONFLICT (id) DO NOTHING;

-- Choice 2A: step 2 -> end (good)
INSERT INTO sim_choices (id, step_id, choice_text, outcome_text, next_step_id, financial_impact, xp_bonus)
VALUES (
  'f1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'c1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Pay from remaining savings',
  'Great! You handled both emergencies without debt.',
  null,
  10,
  50
)
ON CONFLICT (id) DO NOTHING;

-- Choice 2B: step 2 -> end (bad)
INSERT INTO sim_choices (id, step_id, choice_text, outcome_text, next_step_id, financial_impact, xp_bonus)
VALUES (
  '71b2c3d4-e5f6-7890-abcd-ef1234567890',
  'c1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Put medical bill on credit card',
  'Try to avoid credit card debt for regular expenses.',
  null,
  -5,
  10
)
ON CONFLICT (id) DO NOTHING;

COMMIT;
