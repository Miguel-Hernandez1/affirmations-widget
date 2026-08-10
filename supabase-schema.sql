-- Run this in your Supabase project: SQL Editor → New query → paste → Run

-- Stores the user's quiz profile as a JSON blob
create table if not exists profiles (
  id         uuid references auth.users(id) on delete cascade primary key,
  data       jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Stores affirmation reflections (mood + written reflection after choosing daily affirmation)
create table if not exists journal_entries (
  id               text primary key,
  user_id          uuid references auth.users(id) on delete cascade not null,
  date             text not null,
  affirmation_id   integer,
  affirmation_text text,
  reflection       text,
  mood             text,
  created_at       timestamptz default now()
);

-- Stores free-form daily journal entries
create table if not exists daily_journal (
  id         text primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  date       text not null,
  body       text not null,
  created_at timestamptz default now()
);

-- Row-level security: users can only see and modify their own rows
alter table profiles       enable row level security;
alter table journal_entries enable row level security;
alter table daily_journal   enable row level security;

create policy "Own profile only"
  on profiles for all using (auth.uid() = id);

create policy "Own journal entries only"
  on journal_entries for all using (auth.uid() = user_id);

create policy "Own daily journal only"
  on daily_journal for all using (auth.uid() = user_id);

-- Indexes for date-based queries
create index if not exists journal_entries_user_date on journal_entries(user_id, date);
create index if not exists daily_journal_user_date   on daily_journal(user_id, date);
