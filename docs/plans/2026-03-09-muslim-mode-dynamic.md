# Muslim Mode Dynamic Features Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make 5 main Muslim mode pages (Daily Spread, Sholat Tracker, Quran Journal, Dzikir, Muhasabah) dynamic with backend and ghost UI placeholders.

**Architecture:** Laravel backend with migrations, models, controllers, and API endpoints. React frontend with Inertia.js, auto-save, and ghost UI patterns matching Life mode DailySpread.

**Tech Stack:** Laravel 12, PHP 8.2+, React 18, Inertia.js, Tailwind CSS, SQLite

---

## Task 1: Muslim Daily Spread - Database Migration

**Files:**
- Create: `database/migrations/2026_03_09_120001_create_sholat_logs_table.php`
- Create: `database/migrations/2026_03_09_120002_create_dzikir_logs_table.php`
- Create: `database/migrations/2026_03_09_120003_create_quran_daily_targets_table.php`
- Create: `database/migrations/2026_03_09_120004_create_muhasabah_entries_table.php`

**Step 1: Create sholat_logs migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sholat_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->string('sholat_name', 20); // Subuh, Dzuhur, Ashar, Maghrib, Isya
            $table->string('time', 10)->nullable();
            $table->enum('status', ['missed', 'alone', 'jamaah'])->default('missed');
            $table->timestamps();

            $table->unique(['user_id', 'date', 'sholat_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sholat_logs');
    }
};
```

**Step 2: Create dzikir_logs migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dzikir_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->string('dzikir_name', 100);
            $table->boolean('done')->default(false);
            $table->timestamps();

            $table->unique(['user_id', 'date', 'dzikir_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dzikir_logs');
    }
};
```

**Step 3: Create quran_daily_targets migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quran_daily_targets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->integer('juz')->nullable();
            $table->string('surah', 100)->nullable();
            $table->integer('ayat_start')->nullable();
            $table->integer('ayat_end')->nullable();
            $table->integer('progress')->default(0);
            $table->timestamps();

            $table->unique(['user_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quran_daily_targets');
    }
};
```

**Step 4: Create muhasabah_entries migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('muhasabah_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->text('content')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('muhasabah_entries');
    }
};
```

**Step 5: Run migrations**

Run: `php artisan migrate`
Expected: "Migration completed successfully"

**Step 6: Commit**

```bash
git add database/migrations/
git commit -m "feat(muslim): add migrations for daily spread tables"
```

---

## Task 2: Muslim Daily Spread - Models

**Files:**
- Create: `app/Models/SholatLog.php`
- Create: `app/Models/DzikirLog.php`
- Create: `app/Models/QuranDailyTarget.php`
- Create: `app/Models/MuhasabahEntry.php`

**Step 1: Create SholatLog model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SholatLog extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'sholat_name',
        'time',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

**Step 2: Create DzikirLog model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DzikirLog extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'dzikir_name',
        'done',
    ];

    protected $casts = [
        'date' => 'date',
        'done' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

**Step 3: Create QuranDailyTarget model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuranDailyTarget extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'juz',
        'surah',
        'ayat_start',
        'ayat_end',
        'progress',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

**Step 4: Create MuhasabahEntry model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MuhasabahEntry extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'content',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

**Step 5: Commit**

```bash
git add app/Models/
git commit -m "feat(muslim): add models for daily spread"
```

---

## Task 3: Muslim Daily Spread - Controller

**Files:**
- Create: `app/Http/Controllers/Muslim/DailySpreadController.php`

**Step 1: Create Muslim directory and DailySpreadController**

```php
<?php

namespace App\Http\Controllers\Muslim;

use App\Http\Controllers\Controller;
use App\Models\DzikirLog;
use App\Models\MuhasabahEntry;
use App\Models\QuranDailyTarget;
use App\Models\SholatLog;
use Illuminate\Http\Request;

class DailySpreadController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->query('date', now()->toDateString());
        $user = $request->user();

        $sholatLogs = SholatLog::where('user_id', $user->id)
            ->where('date', $date)
            ->get()
            ->keyBy('sholat_name');

        $dzikirLogs = DzikirLog::where('user_id', $user->id)
            ->where('date', $date)
            ->get();

        $quranTarget = QuranDailyTarget::where('user_id', $user->id)
            ->where('date', $date)
            ->first();

        $muhasabah = MuhasabahEntry::where('user_id', $user->id)
            ->where('date', $date)
            ->first();

        return inertia('Muslim/DailySpread', [
            'date' => $date,
            'sholatLogs' => $sholatLogs,
            'dzikirLogs' => $dzikirLogs,
            'quranTarget' => $quranTarget,
            'muhasabah' => $muhasabah,
        ]);
    }

    public function saveSholat(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'sholat_name' => 'required|string',
            'status' => 'required|in:missed,alone,jamaah',
            'time' => 'nullable|string',
        ]);

        SholatLog::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
                'sholat_name' => $validated['sholat_name'],
            ],
            [
                'status' => $validated['status'],
                'time' => $validated['time'],
            ]
        );

        return back();
    }

    public function saveDzikir(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'items' => 'required|array',
            'items.*.dzikir_name' => 'required|string',
            'items.*.done' => 'required|boolean',
        ]);

        foreach ($validated['items'] as $item) {
            DzikirLog::updateOrCreate(
                [
                    'user_id' => $request->user()->id,
                    'date' => $validated['date'],
                    'dzikir_name' => $item['dzikir_name'],
                ],
                ['done' => $item['done']]
            );
        }

        return back();
    }

    public function saveQuranTarget(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'juz' => 'nullable|integer',
            'surah' => 'nullable|string',
            'ayat_start' => 'nullable|integer',
            'ayat_end' => 'nullable|integer',
            'progress' => 'nullable|integer|min:0|max:100',
        ]);

        QuranDailyTarget::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
            ],
            $validated
        );

        return back();
    }

    public function saveMuhasabah(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'content' => 'nullable|string',
        ]);

        MuhasabahEntry::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
            ],
            ['content' => $validated['content']]
        );

        return back();
    }
}
```

**Step 2: Commit**

```bash
git add app/Http/Controllers/Muslim/
git commit -m "feat(muslim): add DailySpreadController"
```

---

## Task 4: Muslim Daily Spread - Routes

**Files:**
- Modify: `routes/web.php`

**Step 1: Add Muslim Daily Spread routes**

Add these routes in `routes/web.php` inside the auth middleware group:

```php
// Muslim Mode Routes
Route::prefix('muslim')->name('muslim.')->group(function () {
    Route::get('/daily-spread', [\App\Http\Controllers\Muslim\DailySpreadController::class, 'index'])->name('daily-spread');
    Route::post('/daily-spread/sholat', [\App\Http\Controllers\Muslim\DailySpreadController::class, 'saveSholat'])->name('daily-spread.sholat');
    Route::post('/daily-spread/dzikir', [\App\Http\Controllers\Muslim\DailySpreadController::class, 'saveDzikir'])->name('daily-spread.dzikir');
    Route::post('/daily-spread/quran-target', [\App\Http\Controllers\Muslim\DailySpreadController::class, 'saveQuranTarget'])->name('daily-spread.quran-target');
    Route::post('/daily-spread/muhasabah', [\App\Http\Controllers\Muslim\DailySpreadController::class, 'saveMuhasabah'])->name('daily-spread.muhasabah');
});
```

**Step 2: Commit**

```bash
git add routes/web.php
git commit -m "feat(muslim): add routes for daily spread API"
```

---

## Task 5: Muslim Daily Spread - Frontend Component

**Files:**
- Modify: `resources/js/Pages/Muslim/DailySpread.jsx`

**Step 1: Replace static DailySpread with dynamic component**

See full implementation in `resources/js/Pages/Muslim/DailySpread.jsx` - complete rewrite with:
- State management for sholat, dzikir, quran target, muhasabah
- Ghost UI placeholders
- Auto-save with debounce
- Date navigation

**Step 2: Commit**

```bash
git add resources/js/Pages/Muslim/DailySpread.jsx
git commit -m "feat(muslim): make DailySpread dynamic with ghost UI"
```

---

## Task 6: Sholat Tracker - Database Migration

**Files:**
- Create: `database/migrations/2026_03_09_120005_create_sholat_weekly_logs_table.php`
- Create: `database/migrations/2026_03_09_120006_create_sunnah_prayer_logs_table.php`

**Step 1: Create sholat_weekly_logs migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sholat_weekly_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->string('prayer_name', 20);
            $table->enum('status', ['missed', 'alone', 'jamaah'])->default('missed');
            $table->timestamps();

            $table->unique(['user_id', 'date', 'prayer_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sholat_weekly_logs');
    }
};
```

**Step 2: Create sunnah_prayer_logs migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sunnah_prayer_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->string('prayer_name', 50);
            $table->boolean('done')->default(false);
            $table->timestamps();

            $table->unique(['user_id', 'date', 'prayer_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sunnah_prayer_logs');
    }
};
```

**Step 3: Run migrations**

Run: `php artisan migrate`

**Step 4: Commit**

```bash
git add database/migrations/
git commit -m "feat(muslim): add migrations for sholat tracker"
```

---

## Task 7: Sholat Tracker - Models and Controller

**Files:**
- Create: `app/Models/SholatWeeklyLog.php`
- Create: `app/Models/SunnahPrayerLog.php`
- Create: `app/Http/Controllers/Muslim/SholatTrackerController.php`

**Step 1: Create SholatWeeklyLog model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SholatWeeklyLog extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'prayer_name',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

**Step 2: Create SunnahPrayerLog model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SunnahPrayerLog extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'prayer_name',
        'done',
    ];

    protected $casts = [
        'date' => 'date',
        'done' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

**Step 3: Create SholatTrackerController**

```php
<?php

namespace App\Http\Controllers\Muslim;

use App\Http\Controllers\Controller;
use App\Models\SholatWeeklyLog;
use App\Models\SunnahPrayerLog;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SholatTrackerController extends Controller
{
    public function index(Request $request)
    {
        $weekStart = $request->query('week_start', now()->startOfWeek()->toDateString());
        $user = $request->user();

        $startDate = Carbon::parse($weekStart)->startOfWeek();
        $endDate = $startDate->copy()->endOfWeek();

        $weeklyLogs = SholatWeeklyLog::where('user_id', $user->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        $sunnahLogs = SunnahPrayerLog::where('user_id', $user->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        return inertia('Muslim/SholatTracker', [
            'weekStart' => $weekStart,
            'weeklyLogs' => $weeklyLogs,
            'sunnahLogs' => $sunnahLogs,
        ]);
    }

    public function saveLog(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'prayer_name' => 'required|string',
            'status' => 'required|in:missed,alone,jamaah',
        ]);

        SholatWeeklyLog::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
                'prayer_name' => $validated['prayer_name'],
            ],
            ['status' => $validated['status']]
        );

        return back();
    }

    public function saveSunnah(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'prayer_name' => 'required|string',
            'done' => 'required|boolean',
        ]);

        SunnahPrayerLog::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
                'prayer_name' => $validated['prayer_name'],
            ],
            ['done' => $validated['done']]
        );

        return back();
    }
}
```

**Step 4: Commit**

```bash
git add app/Models/ app/Http/Controllers/Muslim/
git commit -m "feat(muslim): add models and controller for sholat tracker"
```

---

## Task 8: Sholat Tracker - Routes and Frontend

**Files:**
- Modify: `routes/web.php`
- Modify: `resources/js/Pages/Muslim/SholatTracker.jsx`

**Step 1: Add routes**

```php
Route::get('/sholat-tracker', [\App\Http\Controllers\Muslim\SholatTrackerController::class, 'index'])->name('sholat-tracker');
Route::post('/sholat-tracker/log', [\App\Http\Controllers\Muslim\SholatTrackerController::class, 'saveLog'])->name('sholat-tracker.log');
Route::post('/sholat-tracker/sunnah', [\App\Http\Controllers\Muslim\SholatTrackerController::class, 'saveSunnah'])->name('sholat-tracker.sunnah');
```

**Step 2: Update frontend with dynamic data and ghost UI**

**Step 3: Commit**

```bash
git add routes/web.php resources/js/Pages/Muslim/SholatTracker.jsx
git commit -m "feat(muslim): make SholatTracker dynamic with ghost UI"
```

---

## Task 9: Quran Journal - Database Migration

**Files:**
- Create: `database/migrations/2026_03_09_120007_create_quran_reading_logs_table.php`
- Create: `database/migrations/2026_03_09_120008_create_hifz_progress_table.php`
- Create: `database/migrations/2026_03_09_120009_create_tadabbur_notes_table.php`

**Step 1: Create migrations**

```php
// quran_reading_logs
Schema::create('quran_reading_logs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->date('date');
    $table->integer('juz');
    $table->string('surah', 100);
    $table->integer('ayat_start')->nullable();
    $table->integer('ayat_end')->nullable();
    $table->integer('pages')->nullable();
    $table->timestamps();
});

// hifz_progress
Schema::create('hifz_progress', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('surah', 100);
    $table->integer('total_ayat');
    $table->integer('memorized')->default(0);
    $table->enum('status', ['not-started', 'in-progress', 'done'])->default('not-started');
    $table->timestamps();
    $table->unique(['user_id', 'surah']);
});

// tadabbur_notes
Schema::create('tadabbur_notes', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('surah', 100);
    $table->string('ayat', 50);
    $table->text('arabic')->nullable();
    $table->text('reflection')->nullable();
    $table->string('color', 50)->default('bg-blue-50');
    $table->timestamps();
});
```

**Step 2: Run migrations**

**Step 3: Commit**

```bash
git add database/migrations/
git commit -m "feat(muslim): add migrations for quran journal"
```

---

## Task 10: Quran Journal - Models, Controller, Routes, Frontend

Follow same pattern as previous tasks:
1. Create models: `QuranReadingLog`, `HifzProgress`, `TadabburNote`
2. Create `QuranJournalController` with CRUD operations
3. Add routes
4. Update frontend with ghost UI

---

## Task 11: Dzikir - Database Migration

**Files:**
- Create migrations for: `dzikir_counters`, `dzikir_morning_checklist`, `dzikir_evening_checklist`, `custom_dzikir`

**Schema:**

```php
// dzikir_counters
$table->foreignId('user_id');
$table->string('name', 100);
$table->integer('count')->default(0);
$table->integer('target')->default(33);
$table->date('date');
$table->unique(['user_id', 'name', 'date']);

// dzikir_morning_checklist
$table->foreignId('user_id');
$table->date('date');
$table->string('item_text', 255);
$table->boolean('done')->default(false);
$table->integer('sort_order')->default(0);
$table->unique(['user_id', 'date', 'item_text']);

// dzikir_evening_checklist (same structure as morning)

// custom_dzikir
$table->foreignId('user_id');
$table->string('text', 255);
$table->integer('count')->default(0);
$table->integer('target')->default(100);
$table->date('date');
```

---

## Task 12: Dzikir - Models, Controller, Routes, Frontend

Same pattern:
1. Create models
2. Create `DzikirController`
3. Add routes
4. Update frontend

---

## Task 13: Muhasabah - Database Migration

**Files:**
- Create migrations for: `good_deeds`, `sins_to_repent`, `improvements`, `gratitude_items`, `istighfar_tracker`

**Schema:**

```php
// good_deeds
$table->foreignId('user_id');
$table->date('date');
$table->string('text', 255);
$table->boolean('done')->default(false);

// sins_to_repent
$table->foreignId('user_id');
$table->date('date');
$table->string('text', 255);
$table->enum('level', ['ringan', 'sedang', 'berat'])->default('sedang');
$table->boolean('repented')->default(false);

// improvements
$table->foreignId('user_id');
$table->date('date');
$table->string('text', 255);
$table->enum('priority', ['rendah', 'sedang', 'tinggi'])->default('sedang');

// gratitude_items
$table->foreignId('user_id');
$table->date('date');
$table->string('text', 255);

// istighfar_tracker
$table->foreignId('user_id');
$table->date('date');
$table->integer('count')->default(0);
$table->integer('target')->default(100);
$table->unique(['user_id', 'date']);
```

---

## Task 14: Muhasabah - Models, Controller, Routes, Frontend

Same pattern:
1. Create models
2. Create `MuhasabahController`
3. Add routes
4. Update frontend

---

## Task 15: Final Testing and Polish

**Step 1: Run all migrations**

```bash
php artisan migrate:fresh
```

**Step 2: Test each page manually**

1. Navigate to each Muslim mode page
2. Verify ghost UI displays correctly
3. Add data and verify auto-save works
4. Refresh and verify data persists

**Step 3: Run existing tests**

```bash
php artisan test
```

**Step 4: Final commit**

```bash
git add .
git commit -m "feat(muslim): complete dynamic Muslim mode with 5 main pages"
```

---

## Notes

- All tables use SQLite (existing config)
- Foreign key to users table for authentication
- Auto-save with debounce (1 second delay)
- Date-based queries for daily/weekly views
- Consistent with Life mode DailySpread patterns