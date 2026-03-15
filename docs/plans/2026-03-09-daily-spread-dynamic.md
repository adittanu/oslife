# Dynamic Daily Spread Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert the Life mode Daily Spread page from static mock data to a dynamic, database-backed page with date navigation and ghost placeholder UX.

**Architecture:** Laravel backend with 5 new tables (schedule_items, priorities, daily_notes, mood_entries, habit_logs), a DailySpreadController that loads all data for a given date via Inertia, and per-section auto-save endpoints. Frontend uses debounced POST requests and ghost placeholders for empty state.

**Tech Stack:** Laravel 12, Inertia.js, React, Tailwind CSS

---

### Task 1: Create database migrations

**Files:**
- Create: `database/migrations/2026_03_09_000001_create_schedule_items_table.php`
- Create: `database/migrations/2026_03_09_000002_create_priorities_table.php`
- Create: `database/migrations/2026_03_09_000003_create_daily_notes_table.php`
- Create: `database/migrations/2026_03_09_000004_create_mood_entries_table.php`
- Create: `database/migrations/2026_03_09_000005_create_habit_logs_table.php`

**Step 1: Create all 5 migration files**

`database/migrations/2026_03_09_000001_create_schedule_items_table.php`:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedule_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('date')->index();
            $table->string('time', 5); // "07:00"
            $table->string('title');
            $table->string('description')->nullable();
            $table->string('color', 20)->default('blue');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['user_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedule_items');
    }
};
```

`database/migrations/2026_03_09_000002_create_priorities_table.php`:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('priorities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('date')->index();
            $table->string('text');
            $table->boolean('completed')->default(false);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['user_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('priorities');
    }
};
```

`database/migrations/2026_03_09_000003_create_daily_notes_table.php`:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->text('content')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_notes');
    }
};
```

`database/migrations/2026_03_09_000004_create_mood_entries_table.php`:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mood_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->string('mood', 50);
            $table->string('icon', 50);
            $table->timestamps();

            $table->unique(['user_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mood_entries');
    }
};
```

`database/migrations/2026_03_09_000005_create_habit_logs_table.php`:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('habit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->string('habit_name', 100);
            $table->string('icon', 50);
            $table->json('value')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'date', 'habit_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('habit_logs');
    }
};
```

**Step 2: Run migrations**

Run: `php artisan migrate`
Expected: 5 tables created successfully

**Step 3: Commit**

```bash
git add database/migrations/2026_03_09_*.php
git commit -m "feat: add migrations for daily spread tables"
```

---

### Task 2: Create Eloquent models

**Files:**
- Create: `app/Models/ScheduleItem.php`
- Create: `app/Models/Priority.php`
- Create: `app/Models/DailyNote.php`
- Create: `app/Models/MoodEntry.php`
- Create: `app/Models/HabitLog.php`
- Modify: `app/Models/User.php` (add relationships)

**Step 1: Create all 5 models**

`app/Models/ScheduleItem.php`:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScheduleItem extends Model
{
    protected $fillable = ['user_id', 'date', 'time', 'title', 'description', 'color', 'sort_order'];

    protected function casts(): array
    {
        return ['date' => 'date:Y-m-d'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

`app/Models/Priority.php`:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Priority extends Model
{
    protected $fillable = ['user_id', 'date', 'text', 'completed', 'sort_order'];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'completed' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

`app/Models/DailyNote.php`:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyNote extends Model
{
    protected $fillable = ['user_id', 'date', 'content'];

    protected function casts(): array
    {
        return ['date' => 'date:Y-m-d'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

`app/Models/MoodEntry.php`:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MoodEntry extends Model
{
    protected $fillable = ['user_id', 'date', 'mood', 'icon'];

    protected function casts(): array
    {
        return ['date' => 'date:Y-m-d'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

`app/Models/HabitLog.php`:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HabitLog extends Model
{
    protected $fillable = ['user_id', 'date', 'habit_name', 'icon', 'value'];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'value' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

**Step 2: Add relationships to User model**

In `app/Models/User.php`, add these methods (after existing methods):

```php
public function scheduleItems(): HasMany
{
    return $this->hasMany(ScheduleItem::class);
}

public function priorities(): HasMany
{
    return $this->hasMany(Priority::class);
}

public function dailyNotes(): HasMany
{
    return $this->hasMany(DailyNote::class);
}

public function moodEntries(): HasMany
{
    return $this->hasMany(MoodEntry::class);
}

public function habitLogs(): HasMany
{
    return $this->hasMany(HabitLog::class);
}
```

Also add `use Illuminate\Database\Eloquent\Relations\HasMany;` to imports.

**Step 3: Commit**

```bash
git add app/Models/
git commit -m "feat: add models for daily spread (ScheduleItem, Priority, DailyNote, MoodEntry, HabitLog)"
```

---

### Task 3: Create DailySpreadController

**Files:**
- Create: `app/Http/Controllers/DailySpreadController.php`
- Modify: `routes/web.php`

**Step 1: Create the controller**

`app/Http/Controllers/DailySpreadController.php`:
```php
<?php

namespace App\Http\Controllers;

use App\Models\DailyNote;
use App\Models\HabitLog;
use App\Models\MoodEntry;
use App\Models\Priority;
use App\Models\ScheduleItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DailySpreadController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->query('date', now()->format('Y-m-d'));
        $user = $request->user();

        // Guest users get empty data (ghost placeholders shown on frontend)
        if (!$user) {
            return Inertia::render('DailySpread', [
                'date' => $date,
                'schedule' => [],
                'priorities' => [],
                'notes' => null,
                'mood' => null,
                'habits' => [],
            ]);
        }

        return Inertia::render('DailySpread', [
            'date' => $date,
            'schedule' => $user->scheduleItems()
                ->where('date', $date)
                ->orderBy('sort_order')
                ->orderBy('time')
                ->get(),
            'priorities' => $user->priorities()
                ->where('date', $date)
                ->orderBy('sort_order')
                ->get(),
            'notes' => $user->dailyNotes()
                ->where('date', $date)
                ->first()?->content,
            'mood' => $user->moodEntries()
                ->where('date', $date)
                ->first(),
            'habits' => $user->habitLogs()
                ->where('date', $date)
                ->get(),
        ]);
    }

    public function saveSchedule(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'items' => 'required|array',
            'items.*.time' => 'required|string|max:5',
            'items.*.title' => 'required|string|max:255',
            'items.*.description' => 'nullable|string|max:255',
            'items.*.color' => 'nullable|string|max:20',
        ]);

        $user = $request->user();
        $date = $request->date;

        // Delete existing and re-create (simpler than diffing)
        $user->scheduleItems()->where('date', $date)->delete();

        foreach ($request->items as $i => $item) {
            $user->scheduleItems()->create([
                'date' => $date,
                'time' => $item['time'],
                'title' => $item['title'],
                'description' => $item['description'] ?? null,
                'color' => $item['color'] ?? 'blue',
                'sort_order' => $i,
            ]);
        }

        return response()->json(['status' => 'ok']);
    }

    public function savePriorities(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'items' => 'required|array',
            'items.*.text' => 'required|string|max:255',
            'items.*.completed' => 'boolean',
        ]);

        $user = $request->user();
        $date = $request->date;

        $user->priorities()->where('date', $date)->delete();

        foreach ($request->items as $i => $item) {
            $user->priorities()->create([
                'date' => $date,
                'text' => $item['text'],
                'completed' => $item['completed'] ?? false,
                'sort_order' => $i,
            ]);
        }

        return response()->json(['status' => 'ok']);
    }

    public function saveNotes(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'content' => 'nullable|string|max:10000',
        ]);

        $user = $request->user();

        DailyNote::updateOrCreate(
            ['user_id' => $user->id, 'date' => $request->date],
            ['content' => $request->content]
        );

        return response()->json(['status' => 'ok']);
    }

    public function saveMood(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'mood' => 'required|string|max:50',
            'icon' => 'required|string|max:50',
        ]);

        $user = $request->user();

        MoodEntry::updateOrCreate(
            ['user_id' => $user->id, 'date' => $request->date],
            ['mood' => $request->mood, 'icon' => $request->icon]
        );

        return response()->json(['status' => 'ok']);
    }

    public function saveHabits(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'habits' => 'required|array',
            'habits.*.habit_name' => 'required|string|max:100',
            'habits.*.icon' => 'required|string|max:50',
            'habits.*.value' => 'nullable',
        ]);

        $user = $request->user();

        foreach ($request->habits as $habit) {
            HabitLog::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'date' => $request->date,
                    'habit_name' => $habit['habit_name'],
                ],
                [
                    'icon' => $habit['icon'],
                    'value' => $habit['value'],
                ]
            );
        }

        return response()->json(['status' => 'ok']);
    }
}
```

**Step 2: Update routes**

In `routes/web.php`, replace the static daily-spread route and add API routes:

Replace:
```php
Route::get('/daily-spread', function () {
    return Inertia::render('DailySpread');
});
```

With:
```php
Route::get('/daily-spread', [DailySpreadController::class, 'index']);
```

Add inside the `Route::middleware('auth')->group(function () {` block:
```php
    Route::post('/api/daily-spread/schedule', [DailySpreadController::class, 'saveSchedule']);
    Route::post('/api/daily-spread/priorities', [DailySpreadController::class, 'savePriorities']);
    Route::post('/api/daily-spread/notes', [DailySpreadController::class, 'saveNotes']);
    Route::post('/api/daily-spread/mood', [DailySpreadController::class, 'saveMood']);
    Route::post('/api/daily-spread/habits', [DailySpreadController::class, 'saveHabits']);
```

Add to imports at top of web.php:
```php
use App\Http\Controllers\DailySpreadController;
```

**Step 3: Commit**

```bash
git add app/Http/Controllers/DailySpreadController.php routes/web.php
git commit -m "feat: add DailySpreadController with CRUD endpoints"
```

---

### Task 4: Rewrite DailySpread.jsx — Date navigation + dynamic data

**Files:**
- Modify: `resources/js/Pages/DailySpread.jsx` (full rewrite)

**Step 1: Rewrite the component**

Replace entire `resources/js/Pages/DailySpread.jsx` with dynamic version that:

1. Receives `date`, `schedule`, `priorities`, `notes`, `mood`, `habits` as Inertia props
2. Has date navigation bar with `← date →` arrows and click-to-pick calendar
3. Uses `router.visit('/daily-spread?date=YYYY-MM-DD', { preserveState: false })` for date changes
4. Each section has local state initialized from props
5. Ghost placeholders shown when data is empty
6. Auto-save with 1s debounce per section via `axios.post()`

Key implementation details:

**Date navigation component (inline):**
- Left arrow decrements date by 1 day
- Right arrow increments date by 1 day
- Click on date text opens `<input type="date">` picker
- Format display: "Senin, 9 Maret 2026" using `toLocaleDateString('id-ID')`

**Ghost placeholder behavior:**
- Schedule: Show empty timeline with "Ketuk untuk tambah kegiatan..." in gray italic
- Priorities: 3 input rows with placeholder text "Prioritas pertamamu hari ini..."
- Notes: textarea with placeholder "Tulis catatan & refleksi hari ini..."
- Habits: 4 default habit boxes with "Tap untuk catat"
- Mood: neutral gray face icon + "Bagaimana perasaanmu?"

**Auto-save pattern per section:**
```jsx
// Example for notes section
const [notesContent, setNotesContent] = useState(notes || '');
const notesTimer = useRef(null);

const handleNotesChange = (value) => {
    setNotesContent(value);
    clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(() => {
        axios.post('/api/daily-spread/notes', { date, content: value });
    }, 1000);
};
```

The full component preserves the existing journal aesthetic (sticky notes, washi tape, handwriting fonts, paper texture) but makes all content editable and data-driven.

**Step 2: Build and verify**

Run: `bun run build`
Expected: Build succeeds with no errors

**Step 3: Commit**

```bash
git add resources/js/Pages/DailySpread.jsx
git commit -m "feat: rewrite DailySpread with dynamic data, date nav, ghost placeholders"
```

---

### Task 5: Manual testing & polish

**Step 1: Test guest user (not logged in)**

- Visit `/daily-spread` — should show ghost placeholders, no errors
- Date nav arrows should work (URL changes, page reloads with empty data)
- No save requests should fire (user is null)

**Step 2: Test logged-in user**

- Visit `/daily-spread` — ghost placeholders shown
- Add a schedule item → wait 1s → check database has row
- Add priorities → verify save
- Type notes → verify auto-save after 1s
- Select mood → verify save
- Log habits → verify save
- Navigate to different date → verify empty state
- Navigate back → verify data loads

**Step 3: Test date navigation**

- Click left arrow → goes to yesterday
- Click right arrow → goes to tomorrow
- Click date text → calendar picker opens
- Select date from picker → navigates correctly

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: complete dynamic Daily Spread with persistence and date navigation"
```
