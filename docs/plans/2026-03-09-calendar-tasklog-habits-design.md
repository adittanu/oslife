# Dynamic Calendar, Task Log, Habit Tracker — Design Doc

## Overview

Convert Calendar, Task Log, and Habit Tracker pages from static mock to dynamic database-backed pages. Reuses existing tables (schedule_items, habit_logs) from Daily Spread.

## Database Schema

### New Tables

**tasks**
- id, user_id, text, tag (string nullable: "Work", "Personal", "Sunnah")
- due_date (date nullable), completed (boolean default false)
- completed_at (timestamp nullable), sort_order, timestamps
- index(user_id, due_date), index(user_id, completed)

**habit_definitions**
- id, user_id, name (string), icon (string), color (string "blue")
- is_default (boolean default false), sort_order
- archived (boolean default false), timestamps
- unique(user_id, name)

### Reused Tables
- `schedule_items` — Calendar displays these per month
- `habit_logs` — Habit Tracker grid uses these, shared with Daily Spread
- `daily_notes` — Task Log right page quick notes

## Page Behavior

### Calendar
- Route: `GET /calendar?month=2026-03` (default: current month)
- Data: schedule_items for user + selected month
- Navigation: `← Feb | March 2026 | Apr →`
- Upcoming events: schedule_items where date >= today, max 5
- Quick add: inline form → save to schedule_items
- Ghost: empty grid, "Belum ada jadwal bulan ini..."

### Task Log
- Route: `GET /task-log?date=2026-03-09` (default: today)
- Data: tasks WHERE (due_date = date OR (due_date < date AND completed = false)) — carry forward
- Right page: mini habit tracker (today) + quick notes (daily_notes)
- Add task: inline borderless input, enter to submit
- Toggle: checkbox → update completed + completed_at
- Date nav: `← tanggal →` same as Daily Spread
- Ghost: "Belum ada task hari ini..."

### Habit Tracker
- Route: `GET /habit-tracker?month=2026-03` (default: current month)
- Data: habit_definitions (active) + habit_logs for month
- Grid: 1 row per habit, 1 column per day
- Toggle: click cell → upsert habit_log
- Add habit: form below grid — name + icon + color
- Insights: completion rate from habit_logs count / total days
- Reflection: textarea saved separately
- Default habits: auto-create 4 habit_definitions on first visit (Water, Sleep, Pray, Read)
- Ghost: "Tambah habit pertamamu!"

## API Endpoints

### Calendar
- GET /calendar?month=2026-03 → CalendarController@index
- POST /api/calendar/event → create schedule_item
- DELETE /api/calendar/event/{id} → delete schedule_item

### Task Log
- GET /task-log?date=2026-03-09 → TaskLogController@index
- POST /api/tasks → create task
- PATCH /api/tasks/{id} → update (toggle, edit)
- DELETE /api/tasks/{id} → delete task

### Habit Tracker
- GET /habit-tracker?month=2026-03 → HabitTrackerController@index
- POST /api/habits/definitions → create habit_definition
- PATCH /api/habits/definitions/{id} → update (rename, archive)
- POST /api/habits/toggle → upsert habit_log
- POST /api/habits/reflection → save monthly reflection

## Shared Patterns
- Auto-save: debounced 1s for text, immediate for toggles
- Ghost placeholders: gray italic text, disappear on interaction
- Borderless inputs: bg-transparent, no border, focus:ring-0
- All inputs use journal fonts (font-handwriting, font-note)
