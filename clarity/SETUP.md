# Clarity — Setup Guide

## Quick Start (5 minutes)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd clarity
npm install
```

### 2. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) → New project
2. Choose a region close to you
3. Set a strong database password → Create project

### 3. Run the Database Schema
1. In Supabase → SQL Editor → New query
2. Paste the entire contents of `supabase-schema.sql`
3. Click Run

### 4. Configure Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Find these in Supabase → Project Settings → API.

### 5. Enable Email Auth
In Supabase → Authentication → Providers → Email → Enable

### 6. Run Locally
```bash
npm run dev
```
Open `http://localhost:5173` — install as PWA via Chrome's "Add to Home Screen".

---

## Deploy to Vercel (Free)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy → Done

Add your Vercel URL to Supabase → Authentication → URL Configuration → Site URL.

---

## Deploy to Netlify (Free)

1. Push to GitHub
2. Netlify → New site → Import from GitHub
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add the env vars in Site settings → Environment variables
6. Deploy

---

## Install as Android PWA

1. Open your deployed URL in Chrome on Android
2. Tap the three-dot menu → "Add to Home Screen"
3. Tap "Add" — Clarity appears as an app icon
4. Open it — it works like a native app, even offline (for cached content)

---

## Testing Checklist

### Auth
- [ ] Sign up with email + password
- [ ] Receive confirmation email (if email confirm is on)
- [ ] Sign in → see dashboard
- [ ] Sign out → redirected to login
- [ ] Open on second device → data syncs

### Brain Dump
- [ ] Tap Brain Dump button → modal opens
- [ ] Type a thought → tap "Dump it" → toast appears
- [ ] Tap microphone → speak → text appears
- [ ] Go to Inbox → thought appears

### Inbox Sorting
- [ ] Open Inbox → see unsorted thought
- [ ] Tap Sort → choose Task → toast "Moved to tasks"
- [ ] Go to Tasks → new task appears
- [ ] Sort another thought to Event, Note, Idea

### Task Hub
- [ ] Add task via + button
- [ ] Set status, energy, batch type
- [ ] Task appears sorted (overdue → now → soon → later → hold)
- [ ] Tap filter icon → filter by status works
- [ ] Tap circle to complete → task disappears + success toast
- [ ] Tap task title → edit form opens

### Planner
- [ ] Month view loads with dots on event days
- [ ] Tap + → add event → appears on calendar
- [ ] Tap 🎂 → add birthday → appears on calendar
- [ ] Tap a day → day view shows items
- [ ] Tasks with due dates appear in planner

### Filing Cabinet
- [ ] Tap folder icon → add a folder
- [ ] Tap New note → create note → appears in list
- [ ] Upload a file (PDF/image) → appears with icon
- [ ] Search for document by title/tag
- [ ] Tag a document → filter by tag

### Mobile
- [ ] App installs as PWA on Android Chrome
- [ ] Bottom nav works with large touch targets
- [ ] Quick-add FAB expands/collapses
- [ ] Dark mode toggle works
- [ ] No horizontal scrolling on any screen
