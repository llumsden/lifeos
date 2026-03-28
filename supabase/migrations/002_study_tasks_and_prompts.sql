create table if not exists public.study_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject_id uuid not null references public.uni_subjects (id) on delete cascade,
  title text not null,
  details text,
  completed boolean not null default false,
  scheduled_for date,
  time_label text,
  position int not null default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.study_ai_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null,
  prompt text not null,
  position int not null default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists study_tasks_user_subject_idx
  on public.study_tasks (user_id, subject_id, completed, scheduled_for);

create index if not exists study_ai_prompts_user_position_idx
  on public.study_ai_prompts (user_id, position);

drop trigger if exists set_study_tasks_updated_at on public.study_tasks;
create trigger set_study_tasks_updated_at
before update on public.study_tasks
for each row execute function public.set_updated_at();

drop trigger if exists set_study_ai_prompts_updated_at on public.study_ai_prompts;
create trigger set_study_ai_prompts_updated_at
before update on public.study_ai_prompts
for each row execute function public.set_updated_at();

alter table public.study_tasks enable row level security;
alter table public.study_ai_prompts enable row level security;

create policy "Users manage their study_tasks"
on public.study_tasks
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their study_ai_prompts"
on public.study_ai_prompts
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
