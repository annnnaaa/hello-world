-- ============================================
-- Clarity App — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Profiles ──────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  streak_count integer not null default 0,
  tasks_completed_today integer not null default 0,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
create policy "Users manage own profile" on profiles
  for all using (auth.uid() = id);

-- ── Brain Dump Entries ────────────────────────────────────────────────────────
create table if not exists brain_dump_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  is_sorted boolean not null default false,
  created_at timestamptz not null default now()
);

create index on brain_dump_entries (user_id, created_at desc);
alter table brain_dump_entries enable row level security;
create policy "Users manage own brain dump entries" on brain_dump_entries
  for all using (auth.uid() = user_id);

-- ── Unsorted Thoughts ─────────────────────────────────────────────────────────
create table if not exists unsorted_thoughts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  brain_dump_id uuid references brain_dump_entries(id) on delete set null,
  created_at timestamptz not null default now()
);

create index on unsorted_thoughts (user_id, created_at desc);
alter table unsorted_thoughts enable row level security;
create policy "Users manage own unsorted thoughts" on unsorted_thoughts
  for all using (auth.uid() = user_id);

-- ── Tasks ─────────────────────────────────────────────────────────────────────
create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'later'
    check (status in ('overdue', 'now', 'soon', 'later', 'hold')),
  energy text not null default 'medium'
    check (energy in ('low', 'medium', 'high')),
  batch_type text not null default 'planning'
    check (batch_type in ('paperwork', 'cleaning', 'planning', 'project', 'errands', 'custom')),
  custom_batch text,
  due_date date,
  priority integer not null default 3 check (priority between 1 and 5),
  notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on tasks (user_id, status);
create index on tasks (user_id, due_date);
create index on tasks (user_id, completed_at);
alter table tasks enable row level security;
create policy "Users manage own tasks" on tasks
  for all using (auth.uid() = user_id);

-- ── Calendar Events ───────────────────────────────────────────────────────────
create table if not exists calendar_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  start_date text not null,
  end_date text,
  all_day boolean not null default true,
  color text default '#6366f1',
  created_at timestamptz not null default now()
);

create index on calendar_events (user_id, start_date);
alter table calendar_events enable row level security;
create policy "Users manage own calendar events" on calendar_events
  for all using (auth.uid() = user_id);

-- ── Birthdays ─────────────────────────────────────────────────────────────────
create table if not exists birthdays (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  date text not null,
  notes text,
  created_at timestamptz not null default now()
);

create index on birthdays (user_id);
alter table birthdays enable row level security;
create policy "Users manage own birthdays" on birthdays
  for all using (auth.uid() = user_id);

-- ── Notes ────────────────────────────────────────────────────────────────────
create table if not exists notes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  content text not null,
  document_id uuid,
  folder_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on notes (user_id);
alter table notes enable row level security;
create policy "Users manage own notes" on notes
  for all using (auth.uid() = user_id);

-- ── Ideas ────────────────────────────────────────────────────────────────────
create table if not exists ideas (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index on ideas (user_id);
alter table ideas enable row level security;
create policy "Users manage own ideas" on ideas
  for all using (auth.uid() = user_id);

-- ── Folders ──────────────────────────────────────────────────────────────────
create table if not exists folders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  parent_id uuid references folders(id) on delete cascade,
  color text,
  created_at timestamptz not null default now()
);

create index on folders (user_id, parent_id);
alter table folders enable row level security;
create policy "Users manage own folders" on folders
  for all using (auth.uid() = user_id);

-- ── Documents ────────────────────────────────────────────────────────────────
create table if not exists documents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  folder_id uuid references folders(id) on delete set null,
  title text not null,
  content text,
  file_url text,
  file_name text,
  file_type text,
  file_size bigint,
  notes text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on documents (user_id, folder_id);
create index on documents using gin(tags);
alter table documents enable row level security;
create policy "Users manage own documents" on documents
  for all using (auth.uid() = user_id);

-- ── Storage bucket for file uploads ──────────────────────────────────────────
-- Run this in the Supabase Dashboard → Storage → New bucket
-- Name: documents
-- Public: false (or true if you want direct URL access)
-- File size limit: 50MB

-- Or via SQL:
insert into storage.buckets (id, name, public, file_size_limit)
values ('documents', 'documents', true, 52428800)
on conflict (id) do nothing;

create policy "Users upload own files"
  on storage.objects for insert
  with check (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users read own files"
  on storage.objects for select
  using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users delete own files"
  on storage.objects for delete
  using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

-- ── Auto-create profile on signup ────────────────────────────────────────────
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
