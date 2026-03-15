# Dynamic Calendar, Task Log, Habit Tracker — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert Calendar, Task Log, and Habit Tracker from static mock to dynamic database-backed pages with the same UX patterns as Daily Spread (ghost placeholders, auto-save, borderless inputs, date/month navigation).

**Architecture:** 2 new tables (tasks, habit_definitions) + 3 controllers + 3 page rewrites. Reuses existing schedule_items, habit_logs, daily_notes tables from Daily Spread. Calendar reads schedule_items by month, Task Log has carry-forward logic, Habit Tracker uses habit_definitions as master list + habit_logs as daily check grid.

**Tech Stack:** Laravel 12, Inertia.js, React, Tailwind CSS, axios

---

### Task 1: Create migrations for `tasks` and `habit_definitions`

**Files:**
- Create: `database/migrations/2026_03_09_100001_create_tasks_table.php`
- Create: `database/migrations/2026_03_09_100002_create_habit_definitions_table.php`

**Step 1: Create migration files**

`database/migrations/2026_03_09_100001_create_tasks_table.php`:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('text');
            $table->string('tag', 50)->nullable();
            $table->date('due_date')->nullable();
            $table->boolean('completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['user_id', 'due_date']);
            $table->index(['user_id', 'completed']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
```

`database/migrations/2026_03_09_100002_create_habit_definitions_table.php`:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('habit_definitions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('icon', 50);
            $table->string('color', 20)->default('blue');
            $table->boolean('is_default')->default(false);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('archived')->default(false);
            $table->timestamps();

            $table->unique(['user_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('habit_definitions');
    }
};
```

**Step 2: Run migrations**

Run: `php artisan migrate`

**Step 3: Commit**

```bash
git add database/migrations/2026_03_09_10000*.php
git commit -m "feat: add migrations for tasks and habit_definitions tables"
```

---

### Task 2: Create models + update User relationships

**Files:**
- Create: `app/Models/Task.php`
- Create: `app/Models/HabitDefinition.php`
- Modify: `app/Models/User.php`

**Step 1: Create Task model**

`app/Models/Task.php`:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $fillable = ['user_id', 'text', 'tag', 'due_date', 'completed', 'completed_at', 'sort_order'];

    protected function casts(): array
    {
        return [
            'due_date' => 'date:Y-m-d',
            'completed' => 'boolean',
            'completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

**Step 2: Create HabitDefinition model**

`app/Models/HabitDefinition.php`:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HabitDefinition extends Model
{
    protected $fillable = ['user_id', 'name', 'icon', 'color', 'is_default', 'sort_order', 'archived'];

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
            'archived' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

**Step 3: Add relationships to User.php**

Add to `app/Models/User.php` (after existing hasMany methods):
```php
public function tasks(): HasMany
{
    return $this->hasMany(Task::class);
}

public function habitDefinitions(): HasMany
{
    return $this->hasMany(HabitDefinition::class);
}
```

**Step 4: Commit**

```bash
git add app/Models/Task.php app/Models/HabitDefinition.php app/Models/User.php
git commit -m "feat: add Task and HabitDefinition models with User relationships"
```

---

### Task 3: Create CalendarController + routes + rewrite Calendar.jsx

**Files:**
- Create: `app/Http/Controllers/CalendarController.php`
- Modify: `routes/web.php`
- Modify: `resources/js/Pages/Calendar.jsx`

**Step 1: Create CalendarController**

`app/Http/Controllers/CalendarController.php`:
```php
<?php

namespace App\Http\Controllers;

use App\Models\ScheduleItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index(Request $request)
    {
        $month = $request->query('month', now()->format('Y-m'));
        $startOfMonth = Carbon::parse($month . '-01')->startOfMonth();
        $endOfMonth = $startOfMonth->copy()->endOfMonth();
        $user = $request->user();

        $events = [];
        $upcoming = [];

        if ($user) {
            $events = $user->scheduleItems()
                ->whereBetween('date', [$startOfMonth->format('Y-m-d'), $endOfMonth->format('Y-m-d')])
                ->orderBy('date')
                ->orderBy('time')
                ->get()
                ->groupBy(fn($item) => (int) Carbon::parse($item->date)->format('d'))
                ->map(fn($items) => $items->map(fn($i) => [
                    'id' => $i->id,
                    'text' => $i->title,
                    'time' => $i->time,
                    'color' => $i->color,
                ]))
                ->toArray();

            $upcoming = $user->scheduleItems()
                ->where('date', '>=', now()->format('Y-m-d'))
                ->where('date', '<=', $endOfMonth->format('Y-m-d'))
                ->orderBy('date')
                ->orderBy('time')
                ->limit(5)
                ->get()
                ->map(fn($i) => [
                    'id' => $i->id,
                    'date' => $i->date->format('j M'),
                    'text' => $i->title,
                    'color' => $i->color,
                ]);
        }

        return Inertia::render('Calendar', [
            'month' => $month,
            'year' => $startOfMonth->year,
            'monthNum' => $startOfMonth->month,
            'monthName' => $startOfMonth->translatedFormat('F'),
            'daysInMonth' => $endOfMonth->day,
            'firstDayOfWeek' => ($startOfMonth->dayOfWeekIso % 7), // Monday = 1
            'events' => $events,
            'upcoming' => $upcoming,
            'today' => now()->format('Y-m-d'),
        ]);
    }

    public function storeEvent(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'title' => 'required|string|max:255',
            'time' => 'nullable|string|max:5',
            'color' => 'nullable|string|max:20',
        ]);

        $request->user()->scheduleItems()->create([
            'date' => $request->date,
            'title' => $request->title,
            'time' => $request->time ?? '00:00',
            'color' => $request->color ?? 'blue',
            'sort_order' => 0,
        ]);

        return response()->json(['status' => 'ok']);
    }

    public function destroyEvent(Request $request, int $id)
    {
        $request->user()->scheduleItems()->where('id', $id)->delete();
        return response()->json(['status' => 'ok']);
    }
}
```

**Step 2: Update routes**

In `routes/web.php`:
- Replace `Route::get('/calendar', ...)` with `Route::get('/calendar', [CalendarController::class, 'index']);`
- Add import: `use App\Http\Controllers\CalendarController;`
- Inside auth middleware group add:
```php
Route::post('/api/calendar/event', [CalendarController::class, 'storeEvent']);
Route::delete('/api/calendar/event/{id}', [CalendarController::class, 'destroyEvent']);
```

**Step 3: Rewrite Calendar.jsx**

Full rewrite of `resources/js/Pages/Calendar.jsx` with:
- Props: month, year, monthNum, monthName, daysInMonth, firstDayOfWeek, events, upcoming, today
- Month navigation: `← prev month | Month Year | next month →` using `router.visit('/calendar?month=YYYY-MM')`
- Calendar grid: dynamically built from daysInMonth + firstDayOfWeek
- Events per day: rendered from events prop (grouped by day number)
- Click day cell: show inline add form (date pre-filled, title input, color picker)
- Upcoming events: rendered from upcoming prop, ghost "Belum ada jadwal bulan ini..." when empty
- Quick add: borderless input, save via axios.post, then router.reload()
- Delete event: small x button on hover
- Ghost: empty calendar cells, upcoming sticky with placeholder
- All inputs borderless: bg-transparent, border-none, outline-none, focus:ring-0
- Preserve journal aesthetic: sticky notes, washi tape, handwriting fonts

**Step 4: Build and verify**

Run: `bun run build`

**Step 5: Commit**

```bash
git add app/Http/Controllers/CalendarController.php routes/web.php resources/js/Pages/Calendar.jsx
git commit -m "feat: dynamic Calendar page with month navigation and event CRUD"
```

---

### Task 4: Create TaskLogController + routes + rewrite TaskLog.jsx

**Files:**
- Create: `app/Http/Controllers/TaskLogController.php`
- Modify: `routes/web.php`
- Modify: `resources/js/Pages/TaskLog.jsx`

**Step 1: Create TaskLogController**

`app/Http/Controllers/TaskLogController.php`:
```php
<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskLogController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->query('date', now()->format('Y-m-d'));
        $user = $request->user();

        $tasks = [];
        $habits = [];
        $notes = null;

        if ($user) {
            // Carry forward: tasks for today + overdue uncompleted tasks
            $tasks = $user->tasks()
                ->where(function ($q) use ($date) {
                    $q->where('due_date', $date)
                      ->orWhere(function ($q2) use ($date) {
                          $q2->where('due_date', '<', $date)
                             ->where('completed', false);
                      });
                })
                ->orderBy('completed')
                ->orderBy('sort_order')
                ->get();

            $habits = $user->habitLogs()
                ->where('date', $date)
                ->get();

            $notes = $user->dailyNotes()
                ->where('date', $date)
                ->first()?->content;
        }

        return Inertia::render('TaskLog', [
            'date' => $date,
            'tasks' => $tasks,
            'habits' => $habits,
            'notes' => $notes,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'text' => 'required|string|max:255',
            'tag' => 'nullable|string|max:50',
            'due_date' => 'nullable|date',
        ]);

        $task = $request->user()->tasks()->create([
            'text' => $request->text,
            'tag' => $request->tag,
            'due_date' => $request->due_date ?? now()->format('Y-m-d'),
            'sort_order' => $request->user()->tasks()->count(),
        ]);

        return response()->json($task);
    }

    public function update(Request $request, int $id)
    {
        $task = $request->user()->tasks()->findOrFail($id);

        $data = $request->validate([
            'text' => 'sometimes|string|max:255',
            'tag' => 'nullable|string|max:50',
            'completed' => 'sometimes|boolean',
            'due_date' => 'nullable|date',
        ]);

        if (isset($data['completed'])) {
            $data['completed_at'] = $data['completed'] ? now() : null;
        }

        $task->update($data);
        return response()->json($task);
    }

    public function destroy(Request $request, int $id)
    {
        $request->user()->tasks()->where('id', $id)->delete();
        return response()->json(['status' => 'ok']);
    }
}
```

**Step 2: Update routes**

In `routes/web.php`:
- Replace `Route::get('/task-log', ...)` with `Route::get('/task-log', [TaskLogController::class, 'index']);`
- Add import: `use App\Http\Controllers\TaskLogController;`
- Inside auth middleware group add:
```php
Route::post('/api/tasks', [TaskLogController::class, 'store']);
Route::patch('/api/tasks/{id}', [TaskLogController::class, 'update']);
Route::delete('/api/tasks/{id}', [TaskLogController::class, 'destroy']);
```

**Step 3: Rewrite TaskLog.jsx**

Full rewrite of `resources/js/Pages/TaskLog.jsx` with:
- Props: date, tasks, habits, notes
- Date navigation: `← tanggal →` same pattern as Daily Spread
- LEFT PAGE — Task List:
  - Tasks rendered from props with checkbox toggle
  - Overdue tasks (due_date < today, not completed) shown with subtle indicator
  - Inline add: borderless input at bottom, enter to submit via axios.post
  - Toggle completed: immediate axios.patch, strikethrough visual
  - Delete: x button on hover, axios.delete
  - Tag badges: colored pill (Work=blue, Personal=purple, Sunnah=green)
  - Ghost: "Belum ada task hari ini..." with input placeholder
- RIGHT PAGE — Mini Habits + Quick Notes:
  - Mini habit grid: 4 boxes from habit_logs (same as Daily Spread)
  - Quick notes: textarea from daily_notes, auto-save debounced
  - Ghost placeholders for both
- All inputs borderless, journal fonts

**Step 4: Build and verify**

Run: `bun run build`

**Step 5: Commit**

```bash
git add app/Http/Controllers/TaskLogController.php routes/web.php resources/js/Pages/TaskLog.jsx
git commit -m "feat: dynamic Task Log with carry-forward and date navigation"
```

---

### Task 5: Create HabitTrackerController + routes + rewrite HabitTracker.jsx

**Files:**
- Create: `app/Http/Controllers/HabitTrackerController.php`
- Modify: `routes/web.php`
- Modify: `resources/js/Pages/HabitTracker.jsx`

**Step 1: Create HabitTrackerController**

`app/Http/Controllers/HabitTrackerController.php`:
```php
<?php

namespace App\Http\Controllers;

use App\Models\HabitDefinition;
use App\Models\HabitLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HabitTrackerController extends Controller
{
    private const DEFAULT_HABITS = [
        ['name' => 'Water 2L', 'icon' => 'water_drop', 'color' => 'blue'],
        ['name' => 'Read 30m', 'icon' => 'menu_book', 'color' => 'green'],
        ['name' => 'Prayer', 'icon' => 'self_improvement', 'color' => 'purple'],
        ['name' => 'Exercise', 'icon' => 'fitness_center', 'color' => 'pink'],
    ];

    public function index(Request $request)
    {
        $month = $request->query('month', now()->format('Y-m'));
        $startOfMonth = Carbon::parse($month . '-01')->startOfMonth();
        $endOfMonth = $startOfMonth->copy()->endOfMonth();
        $user = $request->user();

        $definitions = [];
        $logs = [];
        $reflection = null;

        if ($user) {
            // Auto-create defaults on first visit
            if ($user->habitDefinitions()->count() === 0) {
                foreach (self::DEFAULT_HABITS as $i => $habit) {
                    $user->habitDefinitions()->create([
                        ...$habit,
                        'is_default' => true,
                        'sort_order' => $i,
                    ]);
                }
            }

            $definitions = $user->habitDefinitions()
                ->where('archived', false)
                ->orderBy('sort_order')
                ->get();

            $logs = $user->habitLogs()
                ->whereBetween('date', [$startOfMonth->format('Y-m-d'), $endOfMonth->format('Y-m-d')])
                ->get()
                ->groupBy('habit_name')
                ->map(fn($items) => $items->keyBy(fn($i) => Carbon::parse($i->date)->day))
                ->toArray();
        }

        return Inertia::render('HabitTracker', [
            'month' => $month,
            'monthName' => $startOfMonth->translatedFormat('F'),
            'year' => $startOfMonth->year,
            'daysInMonth' => $endOfMonth->day,
            'definitions' => $definitions,
            'logs' => $logs,
            'today' => now()->format('Y-m-d'),
        ]);
    }

    public function storeDefinition(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'icon' => 'required|string|max:50',
            'color' => 'nullable|string|max:20',
        ]);

        $def = $request->user()->habitDefinitions()->create([
            'name' => $request->name,
            'icon' => $request->icon,
            'color' => $request->color ?? 'blue',
            'sort_order' => $request->user()->habitDefinitions()->count(),
        ]);

        return response()->json($def);
    }

    public function updateDefinition(Request $request, int $id)
    {
        $def = $request->user()->habitDefinitions()->findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|string|max:100',
            'icon' => 'sometimes|string|max:50',
            'color' => 'sometimes|string|max:20',
            'archived' => 'sometimes|boolean',
        ]);
        $def->update($data);
        return response()->json($def);
    }

    public function toggleLog(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'habit_name' => 'required|string|max:100',
            'icon' => 'required|string|max:50',
        ]);

        $user = $request->user();
        $existing = $user->habitLogs()
            ->where('date', $request->date)
            ->where('habit_name', $request->habit_name)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['status' => 'removed']);
        }

        $user->habitLogs()->create([
            'date' => $request->date,
            'habit_name' => $request->habit_name,
            'icon' => $request->icon,
            'value' => true,
        ]);

        return response()->json(['status' => 'added']);
    }
}
```

**Step 2: Update routes**

In `routes/web.php`:
- Replace `Route::get('/habit-tracker', ...)` with `Route::get('/habit-tracker', [HabitTrackerController::class, 'index']);`
- Add import: `use App\Http\Controllers\HabitTrackerController;`
- Inside auth middleware group add:
```php
Route::post('/api/habits/definitions', [HabitTrackerController::class, 'storeDefinition']);
Route::patch('/api/habits/definitions/{id}', [HabitTrackerController::class, 'updateDefinition']);
Route::post('/api/habits/toggle', [HabitTrackerController::class, 'toggleLog']);
```

**Step 3: Rewrite HabitTracker.jsx**

Full rewrite of `resources/js/Pages/HabitTracker.jsx` with:
- Props: month, monthName, year, daysInMonth, definitions, logs, today
- Month navigation: `← prev | Month Year | next →` via router.visit
- LEFT PAGE — Habit Grid (2/3 width):
  - Table: rows = habit_definitions, columns = days 1-N
  - Each cell: clickable, toggles habit_log via axios.post
  - Checked = colored icon, unchecked = gray dot
  - "Add New Habit" button at bottom → inline form (name + icon dropdown + color)
  - Ghost: "Tambah habit pertamamu!" when no definitions
- RIGHT PAGE — Insights (1/3 width):
  - Completion rate bar chart: calculated from logs count / daysInMonth per habit
  - Streak badge: longest consecutive days
  - Reflection textarea: auto-save debounced (save to separate endpoint or daily_notes)
  - Ghost: bars at 0%, "Mulai track habit untuk lihat insights"
- All inputs borderless, journal fonts, preserve washi tape/sticky note aesthetic

**Step 4: Build and verify**

Run: `bun run build`

**Step 5: Commit**

```bash
git add app/Http/Controllers/HabitTrackerController.php routes/web.php resources/js/Pages/HabitTracker.jsx
git commit -m "feat: dynamic Habit Tracker with definitions grid and insights"
```

---

### Task 6: Final build verification

**Step 1: Build**

Run: `bun run build`
Expected: No errors

**Step 2: Verify no remaining static references**

Check that Calendar, TaskLog, HabitTracker all receive dynamic props and no longer have hardcoded mock data.
