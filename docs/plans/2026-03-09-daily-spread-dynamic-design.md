# Dynamic Daily Spread — Design Doc

## Overview

Convert Daily Spread (Life mode) from static mock to dynamic database-backed page with date navigation and ghost placeholder UX for empty state.

## Database Schema

### schedule_items
- id, user_id, date, time (string "07:00"), title, description (nullable)
- color (string, default "blue"), sort_order, timestamps

### priorities
- id, user_id, date, text, completed (boolean, default false)
- sort_order, timestamps

### daily_notes
- id, user_id, date, content (text, nullable)
- timestamps, unique(user_id, date)

### mood_entries
- id, user_id, date, mood (string), icon (string)
- timestamps, unique(user_id, date)

### habit_logs
- id, user_id, date, habit_name, icon, value (JSON)
- timestamps, unique(user_id, date, habit_name)

### Shared tables
- `mood_entries` shared with Mood Tracker page
- `habit_logs` shared with Habit Tracker page
- Other tables owned by Daily Spread

## API Routes

```
GET  /daily-spread?date=2026-03-09  → DailySpreadController@index
POST /daily-spread/schedule         → upsert schedule items
POST /daily-spread/priorities       → upsert priorities
POST /daily-spread/notes            → upsert notes
POST /daily-spread/mood             → upsert mood
POST /daily-spread/habits           → upsert habits
```

## Data Flow

1. User opens `/daily-spread` → controller queries all 5 tables WHERE user_id + date
2. Data passed to React via Inertia props
3. User edits → debounced (1s) POST per section → controller upserts
4. Date change → Inertia visit `/daily-spread?date=xxx` → reload data

## Date Navigation

- Default: today
- Left/right arrows: previous/next day
- Click date text: calendar picker popup
- URL always reflects active date
- UI format: `← Senin, 9 Maret 2026 →`

## Ghost Placeholder (Empty State)

When no data exists for a date, UI shows ghost text — faded gray, italic, disappears on focus.

| Section | Ghost text |
|---------|-----------|
| Schedule | Time slots 07:00-20:00 empty, "Ketuk untuk tambah kegiatan..." |
| Priorities | 3 empty rows: "Prioritas pertamamu hari ini..." |
| Notes | "Tulis catatan & refleksi hari ini..." |
| Habits | 4 default icons (water, sleep, pray, read) + "Tap untuk catat" |
| Mood | Neutral gray face + "Bagaimana perasaanmu?" |

### Behavior
- Ghost text rendered frontend-only when backend data is empty/null
- On click → ghost disappears, cursor appears, user can input
- Data POSTed only after actual input (not just click)
- Auto-save with 1s debounce per section
