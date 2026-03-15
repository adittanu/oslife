# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 18, Inertia.js, Tailwind CSS 3, Vite 7
- **Database**: SQLite (local), configured via `DB_CONNECTION=sqlite`
- **Auth**: Laravel Breeze with Inertia scaffolding
- **AI Integration**: Custom chatbot using Qwen API via HTTP client

## Architecture Overview

**Monolithic Laravel + Inertia/React SPA** - Server-side rendered React pages through Inertia.js. All pages are React components in `resources/js/Pages/` rendered via `Inertia::render()` in routes.

**Multi-mode journaling app** with three modes:
- **Life mode** (default): Daily spread, task log, habit tracker, gratitude, notes, finances, calendar, mood tracker, goals, focus timer, weekly review
- **Muslim mode**: Islamic features (sholat tracker, Quran journal, dzikir, doa, muhasabah, ramadan planner)
- **Creator mode**: Content calendar, script writer, analytics, brand kit
- **Work/Freelancer mode**: Client management, pipeline, time tracking, invoices, contracts

**Key directories**:
- `app/Http/Controllers/` - Laravel controllers (ChatController, DailySpreadController, TaskLogController, HabitTrackerController, CalendarController, etc.)
- `app/Models/` - Eloquent models (User, ChatMessage, Task, HabitDefinition, HabitLog, MoodEntry, ScheduleItem, Priority, DailyNote)
- `resources/js/Pages/` - Inertia React page components
- `resources/js/Components/` - Reusable React components (Sidebar, Header, ChatWidget, ModeSwitcher, etc.)
- `resources/js/config/` - Configuration files (modeConfig.js, tourSteps.js)
- `stitch/` - Design mockups and HTML prototypes

## Development Commands

**Setup**:
```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --graceful
```

**Development**:
```bash
composer run dev       # Run Laravel server, queue, logs, and Vite concurrently
npm run dev            # Vite dev server only
php artisan serve      # Laravel server only
```

**Testing**:
```bash
composer run test      # Run PHPUnit tests
php artisan test       # Run tests directly
php artisan test --filter ExampleTest  # Run single test
```

**Build**:
```bash
npm run build          # Production frontend build
```

**Database**:
```bash
php artisan migrate         # Run migrations
php artisan migrate:fresh   # Fresh migration
php artisan tinker          # Laravel REPL for DB interaction
```

## Key Configuration

- `.env` uses SQLite: `DB_CONNECTION=sqlite` (database file at `database/database.sqlite`)
- PHPUnit configured to use in-memory SQLite for testing
- Vite config at `vite.config.js` with Laravel + React plugins
- Entry point: `resources/js/app.jsx` loads Inertia app with `./Pages/**/*.jsx` glob

## Routing Pattern

Routes defined in `routes/web.php`:
- Public pages render Inertia components directly in route closures
- Auth pages wrapped in `Route::middleware('auth')->group()`
- API endpoints prefixed with `/api/` under auth middleware
- Mode-specific pages grouped by prefix (/muslim/, /creator/, /work/)

## AI Chatbot Integration

ChatController sends requests to Qwen API (`https://coding-intl.dashscope.aliyuncs.com/v1`). Configuration in `.env`:
```
AI_BASE_URL=...
AI_API_KEY=...
AI_MODEL=qwen3-coder-plus
```

## Notes

- PWA enabled with offline page and service worker
- SEO configured with sitemap.xml, robots.txt, structured data
- Guided tour feature using driver.js library
- Mode switching persists user preference to database
