# Muslim Mode Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Muslim mode that transforms sidebar, theme, and pages when user switches from Life to Muslim mode.

**Architecture:** Mode config lives in a shared JS module (`modeConfig.js`) that maps each mode to its menu items, default theme, and branding. SidebarNav reads the current mode from Inertia page props and renders the correct menu. ThemeProvider overrides theme color based on mode. Mode switching hits a Laravel API endpoint and reloads via Inertia.

**Tech Stack:** React, Inertia.js, Laravel, Tailwind CSS

---

### Task 1: Mode Switching API Endpoint

**Files:**
- Create: `app/Http/Controllers/ModeController.php`
- Modify: `routes/web.php`

**Step 1: Create ModeController**

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ModeController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'mode' => 'required|in:life,muslim,work',
        ]);

        $request->user()->update([
            'default_mode' => $request->mode,
        ]);

        $homePages = [
            'life' => '/daily-spread',
            'muslim' => '/muslim/daily-spread',
            'work' => '/daily-spread',
        ];

        return redirect($homePages[$request->mode]);
    }
}
```

**Step 2: Add route to `routes/web.php`**

Inside the `auth` middleware group, add:
```php
Route::post('/api/mode', [ModeController::class, 'update']);
```

**Step 3: Commit**
```
feat: add mode switching API endpoint
```

---

### Task 2: Mode Config Module

**Files:**
- Create: `resources/js/config/modeConfig.js`

**Step 1: Create mode configuration**

```js
export const modeConfig = {
    life: {
        label: 'Life OS v2.4',
        brandTitle: 'My Journal',
        defaultTheme: 'pink',
        homePath: '/daily-spread',
        main: [
            { href: '/daily-spread', icon: 'auto_stories', label: 'Daily Spread' },
            { href: '/calendar', icon: 'calendar_month', label: 'Calendar' },
            { href: '/task-log', icon: 'edit_calendar', label: 'Task Log' },
            { href: '/habit-tracker', icon: 'track_changes', label: 'Habit Tracker' },
        ],
        collections: [
            { href: '/notes', icon: 'edit_document', label: 'Notes' },
            { href: '/finances', icon: 'account_balance_wallet', label: 'Finances' },
            { href: '/idea-dump', icon: 'lightbulb', label: 'Idea Dump' },
            { href: '/gratitude', icon: 'favorite', label: 'Gratitude' },
            { href: '/mood-tracker', icon: 'mood', label: 'Mood Tracker' },
            { href: '/goals', icon: 'flag', label: 'Goals' },
        ],
        tools: [
            { href: '/focus-timer', icon: 'timer', label: 'Focus Timer' },
            { href: '/weekly-review', icon: 'rate_review', label: 'Weekly Review' },
        ],
    },
    muslim: {
        label: 'Muslim OS v2.4',
        brandTitle: 'My Journal',
        defaultTheme: 'green',
        homePath: '/muslim/daily-spread',
        main: [
            { href: '/muslim/daily-spread', icon: 'auto_stories', label: 'Daily Spread' },
            { href: '/muslim/islamic-calendar', icon: 'calendar_month', label: 'Islamic Calendar' },
            { href: '/muslim/sholat-tracker', icon: 'mosque', label: 'Sholat Tracker' },
            { href: '/muslim/quran-journal', icon: 'menu_book', label: "Al-Qur'an Journal" },
        ],
        collections: [
            { href: '/muslim/dzikir', icon: 'prayer_times', label: 'Dzikir Counter' },
            { href: '/muslim/doa', icon: 'volunteer_activism', label: 'Doa Collection' },
            { href: '/muslim/kajian-notes', icon: 'school', label: 'Kajian Notes' },
            { href: '/muslim/muhasabah', icon: 'self_improvement', label: 'Muhasabah' },
            { href: '/muslim/sedekah-tracker', icon: 'savings', label: 'Sedekah Tracker' },
            { href: '/muslim/ramadan-planner', icon: 'nights_stay', label: 'Ramadan Planner' },
        ],
        tools: [
            { href: '/muslim/habit-tracker', icon: 'track_changes', label: 'Habit Islami' },
            { href: '/muslim/weekly-muhasabah', icon: 'rate_review', label: 'Weekly Muhasabah' },
        ],
    },
};
```

**Step 2: Commit**
```
feat: add mode config module with life and muslim menus
```

---

### Task 3: Update SidebarNav to Use Mode Config

**Files:**
- Modify: `resources/js/Components/SidebarNav.jsx`

**Step 1: Refactor SidebarNav to read mode from props and render from config**

Replace hardcoded menu items with dynamic rendering from `modeConfig`. Read `auth.user.default_mode` from `usePage()`. Keep `SidebarLink` and `CollectionLink` subcomponents as-is. Map over `config.main`, `config.collections`, `config.tools` arrays.

**Step 2: Commit**
```
feat: SidebarNav renders menu from mode config
```

---

### Task 4: Update ThemeProvider for Mode-Based Theme

**Files:**
- Modify: `resources/js/Components/ThemeProvider.jsx`

**Step 1: Import modeConfig, apply mode's default theme when switching**

ThemeProvider should read both `auth.user.theme` and `auth.user.default_mode`. When mode has a `defaultTheme`, use that instead of user's saved theme. This way Muslim mode = green, Life mode = pink automatically.

**Step 2: Commit**
```
feat: ThemeProvider applies mode-based default theme
```

---

### Task 5: Update Mode Switcher Components

**Files:**
- Modify: `resources/js/Components/Header.jsx`
- Modify: `resources/js/Components/MobileSidebar.jsx`

**Step 1: Make mode switcher functional**

Replace static radio buttons with an Inertia `router.post('/api/mode', { mode })` call on change. Read current mode from `usePage().props.auth.user.default_mode`. Set the correct radio as checked based on current mode.

**Step 2: Commit**
```
feat: mode switcher posts to API and reloads
```

---

### Task 6: Update Header & Layout Branding

**Files:**
- Modify: `resources/js/Components/MobileSidebar.jsx`
- Modify: `resources/js/Components/Sidebar.jsx`

**Step 1: Read mode config for subtitle**

Replace hardcoded "Life OS v2.4" with `config.label` from modeConfig based on current mode.

**Step 2: Commit**
```
feat: sidebar branding updates based on current mode
```

---

### Task 7: Create Muslim Page Components (12 pages)

**Files:**
- Create: `resources/js/Pages/Muslim/DailySpread.jsx`
- Create: `resources/js/Pages/Muslim/IslamicCalendar.jsx`
- Create: `resources/js/Pages/Muslim/SholatTracker.jsx`
- Create: `resources/js/Pages/Muslim/QuranJournal.jsx`
- Create: `resources/js/Pages/Muslim/Dzikir.jsx`
- Create: `resources/js/Pages/Muslim/Doa.jsx`
- Create: `resources/js/Pages/Muslim/KajianNotes.jsx`
- Create: `resources/js/Pages/Muslim/Muhasabah.jsx`
- Create: `resources/js/Pages/Muslim/SedekahTracker.jsx`
- Create: `resources/js/Pages/Muslim/RamadanPlanner.jsx`
- Create: `resources/js/Pages/Muslim/HabitTracker.jsx`
- Create: `resources/js/Pages/Muslim/WeeklyMuhasabah.jsx`

**Step 1: Create each page as a static/dummy page**

Each page follows the same pattern as existing Life pages — uses `JournalLayout`, has journal aesthetic with dummy content, sticky notes, washi tape elements. Content should be Islamic-themed and relevant to each feature.

Example pattern:
```jsx
import React from 'react';
import JournalLayout from '@/Layouts/JournalLayout';

export default function SholatTracker() {
    return (
        <JournalLayout
            pageTitle="Muslim OS - Sholat Tracker"
            headerTitle="Sholat Tracker"
            headerSubtitle="Track your daily prayers"
            titleFontClass="font-handwriting"
            bgIcon={<span className="material-symbols-outlined text-[120px] text-primary rotate-12">mosque</span>}
        >
            {/* Dummy content with journal aesthetic */}
        </JournalLayout>
    );
}
```

**Step 2: Commit after every 3-4 pages**
```
feat: add Muslim daily spread, islamic calendar, sholat tracker, quran journal pages
feat: add dzikir, doa, kajian notes, muhasabah pages
feat: add sedekah tracker, ramadan planner, habit islami, weekly muhasabah pages
```

---

### Task 8: Add Laravel Routes for Muslim Pages

**Files:**
- Modify: `routes/web.php`

**Step 1: Add all 12 Muslim routes**

```php
// Muslim Mode Pages
Route::get('/muslim/daily-spread', fn() => Inertia::render('Muslim/DailySpread'));
Route::get('/muslim/islamic-calendar', fn() => Inertia::render('Muslim/IslamicCalendar'));
Route::get('/muslim/sholat-tracker', fn() => Inertia::render('Muslim/SholatTracker'));
Route::get('/muslim/quran-journal', fn() => Inertia::render('Muslim/QuranJournal'));
Route::get('/muslim/dzikir', fn() => Inertia::render('Muslim/Dzikir'));
Route::get('/muslim/doa', fn() => Inertia::render('Muslim/Doa'));
Route::get('/muslim/kajian-notes', fn() => Inertia::render('Muslim/KajianNotes'));
Route::get('/muslim/muhasabah', fn() => Inertia::render('Muslim/Muhasabah'));
Route::get('/muslim/sedekah-tracker', fn() => Inertia::render('Muslim/SedekahTracker'));
Route::get('/muslim/ramadan-planner', fn() => Inertia::render('Muslim/RamadanPlanner'));
Route::get('/muslim/habit-tracker', fn() => Inertia::render('Muslim/HabitTracker'));
Route::get('/muslim/weekly-muhasabah', fn() => Inertia::render('Muslim/WeeklyMuhasabah'));
```

**Step 2: Commit**
```
feat: add Laravel routes for all Muslim mode pages
```

---

### Task 9: Build & Verify

**Step 1: Run `bun run build`**

**Step 2: Test flow**
1. Navigate to app, click "Muslim" in mode switcher
2. Verify sidebar changes to Muslim menu
3. Verify theme turns green
4. Verify redirect to `/muslim/daily-spread`
5. Click through each Muslim page
6. Switch back to "Life", verify everything reverts

**Step 3: Final commit**
```
feat: complete Muslim mode with mode switching, 12 pages, and dynamic sidebar
```
