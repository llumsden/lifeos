insert into public.default_jane_street_topics (week, title, description, position)
values
  (1, 'Probability fundamentals', 'Refresh conditional probability, Bayes, distributions, and counting tricks.', 1),
  (1, 'Expected value & variance', 'Work on EV intuition, variance identities, and fast estimations.', 2),
  (1, 'Mental maths speed', 'Daily drills for percentages, fractions, and rough calculations under pressure.', 3),
  (1, 'Combinatorics & logic', 'Permutation, combinations, invariants, and structured casework.', 4),
  (2, 'Market making & spreads', 'Build intuition for bid/ask, inventory risk, and quoting behavior.', 1),
  (2, 'Options intuition', 'Practice payoff diagrams, volatility intuition, and basic option reasoning.', 2),
  (2, 'Mock problems (timed)', 'Mix timed drills to simulate pressure and pacing.', 3),
  (2, 'Think-aloud practice', 'Practice speaking clearly while solving unfamiliar problems.', 4),
  (3, 'Mock interviews', 'Simulate full mock interviews with strict timing.', 1),
  (3, 'Weak spot review', 'Target recurring misses from logs and mock sessions.', 2),
  (3, 'Day-before rest protocol', 'Set a light review, sleep, food, and movement plan for the final day.', 3),
  (3, 'Mindset prep', 'Keep confidence high, nerves low, and execution clean.', 4)
on conflict (week, title) do nothing;

insert into public.default_motivational_quotes (quote, author, position)
values
  ('Depth beats drama. Show up calm and let the work compound.', 'Life OS', 1),
  ('You do not need a perfect day. You need the next clean rep.', 'Life OS', 2),
  ('Consistency is the luxury product. Build that.', 'Life OS', 3),
  ('Train focus when you are tired so it is there when it matters.', 'Life OS', 4),
  ('Keep the standard high and the mood light.', 'Life OS', 5),
  ('Quiet confidence comes from receipts, not vibes.', 'Life OS', 6)
on conflict (position) do nothing;

insert into public.default_weekly_schedule_templates (
  schedule_type,
  weekday,
  title,
  details,
  time_label,
  category,
  position
)
values
  ('dashboard', 0, 'Weekly reset', 'Review notes, plan study blocks, light walk.', '09:00', 'reset', 1),
  ('dashboard', 1, 'Morning deep study', 'Probability drills and mental maths.', '08:00', 'study', 1),
  ('dashboard', 1, 'Uni lectures', 'Attend fully and take clean notes.', '13:00', 'uni', 2),
  ('dashboard', 1, 'Climbing technique', 'Footwork drills, slab, quiet feet focus.', '18:30', 'training', 3),
  ('dashboard', 2, 'Morning deep study', 'EV and variance reps.', '08:00', 'study', 1),
  ('dashboard', 2, 'Gym A', 'Full body A with progressive overload focus.', '17:30', 'training', 2),
  ('dashboard', 3, 'Morning deep study', 'Options intuition and timed mock problems.', '08:00', 'study', 1),
  ('dashboard', 3, 'Climbing strength', 'Campus board and fingerboard if healthy.', '18:30', 'training', 2),
  ('dashboard', 4, 'Morning deep study', 'Think-aloud practice and review.', '08:00', 'study', 1),
  ('dashboard', 4, 'Recovery block', 'Stretching, mobility, and early sleep.', '19:00', 'recovery', 2),
  ('dashboard', 5, 'Morning deep study', 'Mock interviews and weak spot review.', '08:00', 'study', 1),
  ('dashboard', 5, 'Gym B', 'Full body B and lift tracking.', '17:30', 'training', 2),
  ('dashboard', 6, 'Project day', 'Pick 1–2 hard problems and work them obsessively.', '10:00', 'training', 1),
  ('dashboard', 6, 'Finance reset', 'Log expenses and tutoring income.', '15:30', 'finance', 2),
  ('training', 1, 'Climbing', 'Technique', null, 'training', 1),
  ('training', 2, 'Gym A', 'Full body A', null, 'training', 1),
  ('training', 3, 'Climbing', 'Strength', null, 'training', 1),
  ('training', 4, 'Rest', 'Mobility or nothing', null, 'rest', 1),
  ('training', 5, 'Gym B', 'Full body B', null, 'training', 1),
  ('training', 6, 'Climbing', 'Project day', null, 'training', 1),
  ('training', 0, 'Rest / Walk', 'Light walk only', null, 'rest', 1)
on conflict do nothing;

insert into public.default_gym_workout_templates (name, position, exercises, notes)
values
  (
    'Full Body A',
    1,
    $$[
      {"name":"Squat","sets":4,"reps":"5","weight_kg":0},
      {"name":"Romanian Deadlift","sets":3,"reps":"8","weight_kg":0},
      {"name":"Pull-ups","sets":4,"reps":"max","weight_kg":0},
      {"name":"Overhead Press","sets":3,"reps":"8","weight_kg":0},
      {"name":"Dips","sets":3,"reps":"10","weight_kg":0}
    ]$$::jsonb,
    'Progressive overload first. No junk cardio.'
  ),
  (
    'Full Body B',
    2,
    $$[
      {"name":"Deadlift","sets":3,"reps":"5","weight_kg":0},
      {"name":"Bulgarian Split Squat","sets":3,"reps":"8 each","weight_kg":0},
      {"name":"Barbell Row","sets":4,"reps":"6","weight_kg":0},
      {"name":"Dumbbell Press","sets":3,"reps":"10","weight_kg":0},
      {"name":"Face Pulls","sets":3,"reps":"15","weight_kg":0}
    ]$$::jsonb,
    'Stay aggressive on compound lifts and recover well.'
  )
on conflict (name) do nothing;
