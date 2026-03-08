# Muslim Mode Design

## Overview
Add a "Muslim" mode to Life OS that transforms the entire app — sidebar menu, theme color, and header — into a Muslim-focused life management tool.

## Architecture
- Mode (`life` / `muslim` / `work`) stored in `users.default_mode` column (already exists)
- Switching mode: POST to `/api/mode` → updates DB → Inertia reload
- Each mode has its own config: menu items, default theme color, branding text

## Mode Config

| Property | Life | Muslim |
|---|---|---|
| Theme default | Pink (`#EC4899`) | Green (`#22C55E`) |
| Header subtitle | "Life OS v2.4" | "Muslim OS v2.4" |
| Sidebar branding | "My Journal" | "My Journal" |
| Home page | `/daily-spread` | `/muslim/daily-spread` |

## Muslim Mode — Sidebar Menu

### Main
- Daily Spread (Muslim version — with sholat schedule)
- Islamic Calendar (Hijriyah + Islamic events)
- Sholat Tracker (5 daily prayers + sunnah)
- Al-Quran Journal (reading/memorization progress)

### Collections
- Dzikir Counter
- Doa Collection
- Kajian Notes (Islamic study notes)
- Muhasabah (Islamic self-reflection)
- Sedekah Tracker (charity/infaq tracking)
- Ramadan Planner

### Tools
- Habit Tracker Islami (sunnah fasting, tahajud, etc.)
- Weekly Muhasabah (weekly review, Islamic version)

## Switch Behavior
1. User clicks "Muslim" in mode switcher
2. POST `/api/mode` with `{ mode: 'muslim' }`
3. Server updates `default_mode` in DB
4. Theme color changes to green
5. Sidebar menu swaps to Muslim menu items
6. Redirect to `/muslim/daily-spread`

## Routes
All Muslim pages use `/muslim/` prefix:
- `/muslim/daily-spread`
- `/muslim/islamic-calendar`
- `/muslim/sholat-tracker`
- `/muslim/quran-journal`
- `/muslim/dzikir`
- `/muslim/doa`
- `/muslim/kajian-notes`
- `/muslim/muhasabah`
- `/muslim/sedekah-tracker`
- `/muslim/ramadan-planner`
- `/muslim/habit-tracker`
- `/muslim/weekly-muhasabah`

## Pages
All Muslim pages are **static/dummy** for now (same approach as existing Life mode pages). Functionality added later.

## Constraints
- Work mode is out of scope for now
- Theme color per mode overrides user preference (or user can customize later)
- Preferences page stays shared across modes
