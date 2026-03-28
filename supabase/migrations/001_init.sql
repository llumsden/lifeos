create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.habits_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  habit_key text not null,
  completed boolean default false,
  created_at timestamptz default now(),
  unique (user_id, date, habit_key)
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  topic text not null,
  duration_minutes int not null,
  confidence int check (confidence between 1 and 5),
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.jane_street_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  week int not null,
  title text not null,
  description text,
  status text default 'not_started' check (status in ('not_started', 'in_progress', 'done')),
  notes text,
  updated_at timestamptz default now(),
  unique (user_id, week, title)
);

create table if not exists public.uni_subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  status text default 'behind' check (status in ('behind', 'catching_up', 'on_track')),
  priority text default 'medium' check (priority in ('high', 'medium', 'low')),
  notes text,
  last_reviewed date,
  updated_at timestamptz default now()
);

create table if not exists public.climbing_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  session_type text not null,
  grade_achieved text,
  volume int,
  energy_level int check (energy_level between 1 and 5),
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.gym_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  session_type text not null check (session_type in ('A', 'B')),
  exercises jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  amount numeric(10, 2) not null,
  category text not null,
  note text,
  created_at timestamptz default now()
);

create table if not exists public.income_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  amount numeric(10, 2) not null,
  source text not null,
  note text,
  created_at timestamptz default now()
);

create table if not exists public.tutoring_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  client_name text,
  duration_minutes int,
  rate_per_hour numeric(10, 2),
  paid boolean default false,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  week_start date not null,
  went_well text,
  slipped text,
  plan_next_week text,
  rating int check (rating between 1 and 5),
  created_at timestamptz default now(),
  unique (user_id, week_start)
);

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  weekly_budget_limit numeric(10, 2) not null default 200,
  current_weight_kg numeric(5, 2) not null default 70,
  target_weight_kg numeric(5, 2) not null default 76,
  height_cm numeric(5, 2) not null default 183,
  interview_target_date date not null default '2026-04-16',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.motivational_quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  quote text not null,
  author text,
  position int not null default 1,
  active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists public.weekly_schedule_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  schedule_type text not null check (schedule_type in ('dashboard', 'training')),
  weekday int not null check (weekday between 0 and 6),
  title text not null,
  details text,
  time_label text,
  category text,
  position int not null default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, schedule_type, weekday, position)
);

create table if not exists public.gym_workout_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  position int not null default 1,
  exercises jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, name)
);

create table if not exists public.default_jane_street_topics (
  id uuid primary key default gen_random_uuid(),
  week int not null,
  title text not null,
  description text,
  position int not null,
  unique (week, title)
);

create table if not exists public.default_motivational_quotes (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author text,
  position int not null unique
);

create table if not exists public.default_weekly_schedule_templates (
  id uuid primary key default gen_random_uuid(),
  schedule_type text not null check (schedule_type in ('dashboard', 'training')),
  weekday int not null check (weekday between 0 and 6),
  title text not null,
  details text,
  time_label text,
  category text,
  position int not null
);

create table if not exists public.default_gym_workout_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  position int not null,
  exercises jsonb not null default '[]'::jsonb,
  notes text
);

create index if not exists habits_log_user_date_idx on public.habits_log (user_id, date desc);
create index if not exists study_sessions_user_date_idx on public.study_sessions (user_id, date desc);
create index if not exists jane_street_topics_user_idx on public.jane_street_topics (user_id, week);
create index if not exists uni_subjects_user_idx on public.uni_subjects (user_id, status);
create index if not exists climbing_sessions_user_date_idx on public.climbing_sessions (user_id, date desc);
create index if not exists gym_sessions_user_date_idx on public.gym_sessions (user_id, date desc);
create index if not exists expenses_user_date_idx on public.expenses (user_id, date desc);
create index if not exists income_entries_user_date_idx on public.income_entries (user_id, date desc);
create index if not exists tutoring_sessions_user_date_idx on public.tutoring_sessions (user_id, date desc);
create index if not exists weekly_reviews_user_week_idx on public.weekly_reviews (user_id, week_start desc);
create index if not exists weekly_schedule_templates_user_idx on public.weekly_schedule_templates (user_id, schedule_type, weekday);
create index if not exists motivational_quotes_user_idx on public.motivational_quotes (user_id, position);
create index if not exists workout_templates_user_idx on public.gym_workout_templates (user_id, position);

drop trigger if exists set_jane_street_topics_updated_at on public.jane_street_topics;
create trigger set_jane_street_topics_updated_at
before update on public.jane_street_topics
for each row execute function public.set_updated_at();

drop trigger if exists set_uni_subjects_updated_at on public.uni_subjects;
create trigger set_uni_subjects_updated_at
before update on public.uni_subjects
for each row execute function public.set_updated_at();

drop trigger if exists set_user_profiles_updated_at on public.user_profiles;
create trigger set_user_profiles_updated_at
before update on public.user_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_schedule_templates_updated_at on public.weekly_schedule_templates;
create trigger set_schedule_templates_updated_at
before update on public.weekly_schedule_templates
for each row execute function public.set_updated_at();

drop trigger if exists set_workout_templates_updated_at on public.gym_workout_templates;
create trigger set_workout_templates_updated_at
before update on public.gym_workout_templates
for each row execute function public.set_updated_at();

alter table public.habits_log enable row level security;
alter table public.study_sessions enable row level security;
alter table public.jane_street_topics enable row level security;
alter table public.uni_subjects enable row level security;
alter table public.climbing_sessions enable row level security;
alter table public.gym_sessions enable row level security;
alter table public.expenses enable row level security;
alter table public.income_entries enable row level security;
alter table public.tutoring_sessions enable row level security;
alter table public.weekly_reviews enable row level security;
alter table public.user_profiles enable row level security;
alter table public.motivational_quotes enable row level security;
alter table public.weekly_schedule_templates enable row level security;
alter table public.gym_workout_templates enable row level security;

alter table public.default_jane_street_topics enable row level security;
alter table public.default_motivational_quotes enable row level security;
alter table public.default_weekly_schedule_templates enable row level security;
alter table public.default_gym_workout_templates enable row level security;

create policy "Users manage their habits_log"
on public.habits_log
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their study_sessions"
on public.study_sessions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their jane_street_topics"
on public.jane_street_topics
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their uni_subjects"
on public.uni_subjects
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their climbing_sessions"
on public.climbing_sessions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their gym_sessions"
on public.gym_sessions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their expenses"
on public.expenses
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their income_entries"
on public.income_entries
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their tutoring_sessions"
on public.tutoring_sessions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their weekly_reviews"
on public.weekly_reviews
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their user_profiles"
on public.user_profiles
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their motivational_quotes"
on public.motivational_quotes
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their weekly_schedule_templates"
on public.weekly_schedule_templates
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their gym_workout_templates"
on public.gym_workout_templates
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.bootstrap_user_defaults(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and auth.uid() <> p_user_id then
    raise exception 'Not allowed to bootstrap another user';
  end if;

  insert into public.user_profiles (
    user_id,
    weekly_budget_limit,
    current_weight_kg,
    target_weight_kg,
    height_cm,
    interview_target_date
  )
  values (
    p_user_id,
    200,
    70,
    76,
    183,
    '2026-04-16'
  )
  on conflict (user_id) do nothing;

  insert into public.jane_street_topics (
    user_id,
    week,
    title,
    description,
    status,
    notes
  )
  select
    p_user_id,
    week,
    title,
    description,
    'not_started',
    null
  from public.default_jane_street_topics
  on conflict (user_id, week, title) do nothing;

  insert into public.motivational_quotes (
    user_id,
    quote,
    author,
    position,
    active
  )
  select
    p_user_id,
    quote,
    author,
    position,
    true
  from public.default_motivational_quotes
  where not exists (
    select 1 from public.motivational_quotes mq where mq.user_id = p_user_id
  );

  insert into public.weekly_schedule_templates (
    user_id,
    schedule_type,
    weekday,
    title,
    details,
    time_label,
    category,
    position
  )
  select
    p_user_id,
    schedule_type,
    weekday,
    title,
    details,
    time_label,
    category,
    position
  from public.default_weekly_schedule_templates
  where not exists (
    select 1 from public.weekly_schedule_templates wst where wst.user_id = p_user_id
  );

  insert into public.gym_workout_templates (
    user_id,
    name,
    position,
    exercises,
    notes
  )
  select
    p_user_id,
    name,
    position,
    exercises,
    notes
  from public.default_gym_workout_templates
  where not exists (
    select 1 from public.gym_workout_templates gwt where gwt.user_id = p_user_id
  );
end;
$$;

grant execute on function public.bootstrap_user_defaults(uuid) to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.bootstrap_user_defaults(new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
