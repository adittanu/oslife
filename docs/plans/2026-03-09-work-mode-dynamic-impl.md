# Work Mode Dynamic Features Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Mengubah 8 halaman Work mode dari data statis menjadi dinamis dengan database SQLite, API endpoints, dan empty state placeholders.

**Architecture:** Laravel controller menerima data dari database dan pass ke Inertia page components. Frontend menggunakan useState + useEffect pattern seperti DailySpread, dengan auto-save ke API endpoints. Empty state menggunakan komponen reusable.

**Tech Stack:** Laravel 12, Inertia.js, React, SQLite, axios

---

## Task 1: Create WorkClient Migration & Model

**Files:**
- Create: `database/migrations/2026_03_09_130001_create_work_clients_table.php`
- Create: `app/Models/WorkClient.php`

**Step 1: Create migration file**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('company')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->enum('status', ['Active', 'Lead', 'Inactive'])->default('Lead');
            $table->text('notes')->nullable();
            $table->string('avatar_color')->default('bg-blue-200');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_clients');
    }
};
```

**Step 2: Create WorkClient model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkClient extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'company',
        'email',
        'phone',
        'status',
        'notes',
        'avatar_color',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

**Step 3: Run migration**

Run: `php artisan migrate`
Expected: Migration runs successfully

**Step 4: Commit**

```bash
git add database/migrations/2026_03_09_130001_create_work_clients_table.php app/Models/WorkClient.php
git commit -m "feat: add WorkClient migration and model"
```

---

## Task 2: Create WorkProject Migration & Model

**Files:**
- Create: `database/migrations/2026_03_09_130002_create_work_projects_table.php`
- Create: `app/Models/WorkProject.php`

**Step 1: Create migration file**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('client_id')->nullable()->constrained('work_clients')->onDelete('set null');
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('status', ['Active', 'Completed', 'On Hold', 'Cancelled'])->default('Active');
            $table->decimal('budget', 12, 2)->nullable();
            $table->date('deadline')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_projects');
    }
};
```

**Step 2: Create WorkProject model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkProject extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'client_id',
        'name',
        'description',
        'status',
        'budget',
        'deadline',
    ];

    protected $casts = [
        'budget' => 'decimal:2',
        'deadline' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(WorkClient::class, 'client_id');
    }
}
```

**Step 3: Run migration**

Run: `php artisan migrate`
Expected: Migration runs successfully

**Step 4: Commit**

```bash
git add database/migrations/2026_03_09_130002_create_work_projects_table.php app/Models/WorkProject.php
git commit -m "feat: add WorkProject migration and model"
```

---

## Task 3: Create WorkInvoice Migration & Model

**Files:**
- Create: `database/migrations/2026_03_09_130003_create_work_invoices_table.php`
- Create: `app/Models/WorkInvoice.php`

**Step 1: Create migration file**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('client_id')->nullable()->constrained('work_clients')->onDelete('set null');
            $table->foreignId('project_id')->nullable()->constrained('work_projects')->onDelete('set null');
            $table->string('invoice_number');
            $table->decimal('amount', 12, 2);
            $table->enum('status', ['Pending', 'Paid', 'Overdue', 'Cancelled'])->default('Pending');
            $table->date('issue_date');
            $table->date('due_date');
            $table->date('paid_date')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_invoices');
    }
};
```

**Step 2: Create WorkInvoice model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'client_id',
        'project_id',
        'invoice_number',
        'amount',
        'status',
        'issue_date',
        'due_date',
        'paid_date',
        'description',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'issue_date' => 'date',
        'due_date' => 'date',
        'paid_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(WorkClient::class, 'client_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(WorkProject::class, 'project_id');
    }
}
```

**Step 3: Run migration**

Run: `php artisan migrate`
Expected: Migration runs successfully

**Step 4: Commit**

```bash
git add database/migrations/2026_03_09_130003_create_work_invoices_table.php app/Models/WorkInvoice.php
git commit -m "feat: add WorkInvoice migration and model"
```

---

## Task 4: Create WorkTimeEntry Migration & Model

**Files:**
- Create: `database/migrations/2026_03_09_130004_create_work_time_entries_table.php`
- Create: `app/Models/WorkTimeEntry.php`

**Step 1: Create migration file**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_time_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->nullable()->constrained('work_projects')->onDelete('set null');
            $table->datetime('start_time');
            $table->datetime('end_time')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_running')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_time_entries');
    }
};
```

**Step 2: Create WorkTimeEntry model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkTimeEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'project_id',
        'start_time',
        'end_time',
        'description',
        'is_running',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(WorkProject::class, 'project_id');
    }

    public function getDurationMinutes(): ?int
    {
        if (!$this->end_time) {
            return null;
        }
        return $this->start_time->diffInMinutes($this->end_time);
    }
}
```

**Step 3: Run migration**

Run: `php artisan migrate`
Expected: Migration runs successfully

**Step 4: Commit**

```bash
git add database/migrations/2026_03_09_130004_create_work_time_entries_table.php app/Models/WorkTimeEntry.php
git commit -m "feat: add WorkTimeEntry migration and model"
```

---

## Task 5: Create WorkContract Migration & Model

**Files:**
- Create: `database/migrations/2026_03_09_130005_create_work_contracts_table.php`
- Create: `app/Models/WorkContract.php`

**Step 1: Create migration file**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('client_id')->nullable()->constrained('work_clients')->onDelete('set null');
            $table->string('title');
            $table->longText('content')->nullable();
            $table->enum('status', ['Draft', 'Sent', 'Signed', 'Expired', 'Cancelled'])->default('Draft');
            $table->date('signed_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_contracts');
    }
};
```

**Step 2: Create WorkContract model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkContract extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'client_id',
        'title',
        'content',
        'status',
        'signed_date',
        'expiry_date',
    ];

    protected $casts = [
        'signed_date' => 'date',
        'expiry_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(WorkClient::class, 'client_id');
    }
}
```

**Step 3: Run migration**

Run: `php artisan migrate`
Expected: Migration runs successfully

**Step 4: Commit**

```bash
git add database/migrations/2026_03_09_130005_create_work_contracts_table.php app/Models/WorkContract.php
git commit -m "feat: add WorkContract migration and model"
```

---

## Task 6: Create WorkMeetingNote Migration & Model

**Files:**
- Create: `database/migrations/2026_03_09_130006_create_work_meeting_notes_table.php`
- Create: `app/Models/WorkMeetingNote.php`

**Step 1: Create migration file**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_meeting_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('client_id')->nullable()->constrained('work_clients')->onDelete('set null');
            $table->foreignId('project_id')->nullable()->constrained('work_projects')->onDelete('set null');
            $table->string('title');
            $table->date('meeting_date');
            $table->longText('content')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_meeting_notes');
    }
};
```

**Step 2: Create WorkMeetingNote model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkMeetingNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'client_id',
        'project_id',
        'title',
        'meeting_date',
        'content',
    ];

    protected $casts = [
        'meeting_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(WorkClient::class, 'client_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(WorkProject::class, 'project_id');
    }
}
```

**Step 3: Run migration**

Run: `php artisan migrate`
Expected: Migration runs successfully

**Step 4: Commit**

```bash
git add database/migrations/2026_03_09_130006_create_work_meeting_notes_table.php app/Models/WorkMeetingNote.php
git commit -m "feat: add WorkMeetingNote migration and model"
```

---

## Task 7: Create EmptyState Component

**Files:**
- Create: `resources/js/Components/WorkEmptyState.jsx`

**Step 1: Create the component**

```jsx
import React from 'react';

export default function WorkEmptyState({ icon, title, description, actionLabel, onAction }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-5xl text-gray-300">{icon}</span>
            </div>
            <h3 className="font-handwriting text-2xl font-bold text-gray-600">{title}</h3>
            <p className="font-note text-gray-400 mt-2 max-w-sm">{description}</p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="mt-6 flex items-center gap-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 px-5 py-2.5 rounded-xl transition-colors shadow-md"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
```

**Step 2: Commit**

```bash
git add resources/js/Components/WorkEmptyState.jsx
git commit -m "feat: add WorkEmptyState reusable component"
```

---

## Task 8: Create WorkController with API Routes

**Files:**
- Create: `app/Http/Controllers/WorkController.php`
- Modify: `routes/web.php`

**Step 1: Create WorkController**

```php
<?php

namespace App\Http\Controllers;

use App\Models\WorkClient;
use App\Models\WorkProject;
use App\Models\WorkInvoice;
use App\Models\WorkTimeEntry;
use App\Models\WorkContract;
use App\Models\WorkMeetingNote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WorkController extends Controller
{
    // Dashboard
    public function dashboard()
    {
        $userId = Auth::id();
        $clients = WorkClient::where('user_id', $userId)->count();
        $activeProjects = WorkProject::where('user_id', $userId)->where('status', 'Active')->count();
        $pendingInvoices = WorkInvoice::where('user_id', $userId)->where('status', 'Pending')->count();
        $overdueInvoices = WorkInvoice::where('user_id', $userId)->where('status', 'Overdue')->count();

        $thisWeek = now()->startOfWeek();
        $timeThisWeek = WorkTimeEntry::where('user_id', $userId)
            ->where('start_time', '>=', $thisWeek)
            ->get()
            ->sum(function ($entry) {
                return $entry->start_time->diffInMinutes($entry->end_time ?? now());
            });
        $hoursThisWeek = round($timeThisWeek / 60, 1);

        $thisMonth = now()->startOfMonth();
        $incomeThisMonth = WorkInvoice::where('user_id', $userId)
            ->where('status', 'Paid')
            ->where('paid_date', '>=', $thisMonth)
            ->sum('amount');

        return inertia('Work/Dashboard', [
            'stats' => [
                'activeProjects' => $activeProjects,
                'pendingInvoices' => $pendingInvoices,
                'hoursThisWeek' => $hoursThisWeek,
                'incomeThisMonth' => $incomeThisMonth,
                'totalClients' => $clients,
                'overdueInvoices' => $overdueInvoices,
            ],
        ]);
    }

    // Clients
    public function clients()
    {
        $clients = WorkClient::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
        return inertia('Work/Clients', ['clients' => $clients]);
    }

    // Pipeline (Projects)
    public function pipeline()
    {
        $projects = WorkProject::with('client')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
        $clients = WorkClient::where('user_id', Auth::id())->get();
        return inertia('Work/Pipeline', ['projects' => $projects, 'clients' => $clients]);
    }

    // Time Tracking
    public function timeTracking()
    {
        $entries = WorkTimeEntry::with('project')
            ->where('user_id', Auth::id())
            ->orderBy('start_time', 'desc')
            ->limit(50)
            ->get();
        $projects = WorkProject::where('user_id', Auth::id())->get();
        return inertia('Work/TimeTracking', ['entries' => $entries, 'projects' => $projects]);
    }

    // Invoices
    public function invoices()
    {
        $invoices = WorkInvoice::with(['client', 'project'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
        $clients = WorkClient::where('user_id', Auth::id())->get();
        return inertia('Work/Invoices', ['invoices' => $invoices, 'clients' => $clients]);
    }

    // Income (derived from invoices)
    public function income()
    {
        $invoices = WorkInvoice::with('client')
            ->where('user_id', Auth::id())
            ->where('status', 'Paid')
            ->orderBy('paid_date', 'desc')
            ->get();
        return inertia('Work/Income', ['invoices' => $invoices]);
    }

    // Meeting Notes
    public function meetingNotes()
    {
        $notes = WorkMeetingNote::with(['client', 'project'])
            ->where('user_id', Auth::id())
            ->orderBy('meeting_date', 'desc')
            ->get();
        $clients = WorkClient::where('user_id', Auth::id())->get();
        return inertia('Work/MeetingNotes', ['notes' => $notes, 'clients' => $clients]);
    }

    // Contracts
    public function contracts()
    {
        $contracts = WorkContract::with('client')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
        $clients = WorkClient::where('user_id', Auth::id())->get();
        return inertia('Work/Contracts', ['contracts' => $contracts, 'clients' => $clients]);
    }

    // API: Clients CRUD
    public function apiClients(Request $request)
    {
        $userId = Auth::id();

        if ($request->isMethod('GET')) {
            return response()->json(WorkClient::where('user_id', $userId)->get());
        }

        if ($request->isMethod('POST')) {
            $client = WorkClient::create(array_merge($request->all(), ['user_id' => $userId]));
            return response()->json($client);
        }
    }

    public function apiClient(Request $request, $id)
    {
        $client = WorkClient::where('user_id', Auth::id())->findOrFail($id);

        if ($request->isMethod('PUT')) {
            $client->update($request->all());
            return response()->json($client);
        }

        if ($request->isMethod('DELETE')) {
            $client->delete();
            return response()->json(['success' => true]);
        }
    }

    // API: Projects CRUD
    public function apiProjects(Request $request)
    {
        $userId = Auth::id();

        if ($request->isMethod('GET')) {
            return response()->json(WorkProject::with('client')->where('user_id', $userId)->get());
        }

        if ($request->isMethod('POST')) {
            $project = WorkProject::create(array_merge($request->all(), ['user_id' => $userId]));
            return response()->json($project);
        }
    }

    public function apiProject(Request $request, $id)
    {
        $project = WorkProject::where('user_id', Auth::id())->findOrFail($id);

        if ($request->isMethod('PUT')) {
            $project->update($request->all());
            return response()->json($project);
        }

        if ($request->isMethod('DELETE')) {
            $project->delete();
            return response()->json(['success' => true]);
        }
    }

    // API: Invoices CRUD
    public function apiInvoices(Request $request)
    {
        $userId = Auth::id();

        if ($request->isMethod('GET')) {
            return response()->json(WorkInvoice::with(['client', 'project'])->where('user_id', $userId)->get());
        }

        if ($request->isMethod('POST')) {
            $invoice = WorkInvoice::create(array_merge($request->all(), ['user_id' => $userId]));
            return response()->json($invoice);
        }
    }

    public function apiInvoice(Request $request, $id)
    {
        $invoice = WorkInvoice::where('user_id', Auth::id())->findOrFail($id);

        if ($request->isMethod('PUT')) {
            $invoice->update($request->all());
            return response()->json($invoice);
        }

        if ($request->isMethod('DELETE')) {
            $invoice->delete();
            return response()->json(['success' => true]);
        }
    }

    // API: Time Entries CRUD
    public function apiTimeEntries(Request $request)
    {
        $userId = Auth::id();

        if ($request->isMethod('GET')) {
            return response()->json(WorkTimeEntry::with('project')->where('user_id', $userId)->get());
        }

        if ($request->isMethod('POST')) {
            $entry = WorkTimeEntry::create(array_merge($request->all(), ['user_id' => $userId]));
            return response()->json($entry);
        }
    }

    public function apiTimeEntry(Request $request, $id)
    {
        $entry = WorkTimeEntry::where('user_id', Auth::id())->findOrFail($id);

        if ($request->isMethod('PUT')) {
            $entry->update($request->all());
            return response()->json($entry);
        }

        if ($request->isMethod('DELETE')) {
            $entry->delete();
            return response()->json(['success' => true]);
        }
    }

    // API: Contracts CRUD
    public function apiContracts(Request $request)
    {
        $userId = Auth::id();

        if ($request->isMethod('GET')) {
            return response()->json(WorkContract::with('client')->where('user_id', $userId)->get());
        }

        if ($request->isMethod('POST')) {
            $contract = WorkContract::create(array_merge($request->all(), ['user_id' => $userId]));
            return response()->json($contract);
        }
    }

    public function apiContract(Request $request, $id)
    {
        $contract = WorkContract::where('user_id', Auth::id())->findOrFail($id);

        if ($request->isMethod('PUT')) {
            $contract->update($request->all());
            return response()->json($contract);
        }

        if ($request->isMethod('DELETE')) {
            $contract->delete();
            return response()->json(['success' => true]);
        }
    }

    // API: Meeting Notes CRUD
    public function apiMeetingNotes(Request $request)
    {
        $userId = Auth::id();

        if ($request->isMethod('GET')) {
            return response()->json(WorkMeetingNote::with(['client', 'project'])->where('user_id', $userId)->get());
        }

        if ($request->isMethod('POST')) {
            $note = WorkMeetingNote::create(array_merge($request->all(), ['user_id' => $userId]));
            return response()->json($note);
        }
    }

    public function apiMeetingNote(Request $request, $id)
    {
        $note = WorkMeetingNote::where('user_id', Auth::id())->findOrFail($id);

        if ($request->isMethod('PUT')) {
            $note->update($request->all());
            return response()->json($note);
        }

        if ($request->isMethod('DELETE')) {
            $note->delete();
            return response()->json(['success' => true]);
        }
    }
}
```

**Step 2: Update routes/web.php**

Modify the Work routes section to use the controller:

```php
// Work Mode Routes
Route::middleware('auth')->group(function () {
    Route::get('/work/dashboard', [WorkController::class, 'dashboard']);
    Route::get('/work/clients', [WorkController::class, 'clients']);
    Route::get('/work/pipeline', [WorkController::class, 'pipeline']);
    Route::get('/work/time-tracking', [WorkController::class, 'timeTracking']);
    Route::get('/work/invoices', [WorkController::class, 'invoices']);
    Route::get('/work/income', [WorkController::class, 'income']);
    Route::get('/work/meeting-notes', [WorkController::class, 'meetingNotes']);
    Route::get('/work/contracts', [WorkController::class, 'contracts']);

    // API Routes
    Route::get('/api/work/clients', [WorkController::class, 'apiClients']);
    Route::post('/api/work/clients', [WorkController::class, 'apiClients']);
    Route::put('/api/work/clients/{id}', [WorkController::class, 'apiClient']);
    Route::delete('/api/work/clients/{id}', [WorkController::class, 'apiClient']);

    Route::get('/api/work/projects', [WorkController::class, 'apiProjects']);
    Route::post('/api/work/projects', [WorkController::class, 'apiProjects']);
    Route::put('/api/work/projects/{id}', [WorkController::class, 'apiProject']);
    Route::delete('/api/work/projects/{id}', [WorkController::class, 'apiProject']);

    Route::get('/api/work/invoices', [WorkController::class, 'apiInvoices']);
    Route::post('/api/work/invoices', [WorkController::class, 'apiInvoices']);
    Route::put('/api/work/invoices/{id}', [WorkController::class, 'apiInvoice']);
    Route::delete('/api/work/invoices/{id}', [WorkController::class, 'apiInvoice']);

    Route::get('/api/work/time-entries', [WorkController::class, 'apiTimeEntries']);
    Route::post('/api/work/time-entries', [WorkController::class, 'apiTimeEntries']);
    Route::put('/api/work/time-entries/{id}', [WorkController::class, 'apiTimeEntry']);
    Route::delete('/api/work/time-entries/{id}', [WorkController::class, 'apiTimeEntry']);

    Route::get('/api/work/contracts', [WorkController::class, 'apiContracts']);
    Route::post('/api/work/contracts', [WorkController::class, 'apiContracts']);
    Route::put('/api/work/contracts/{id}', [WorkController::class, 'apiContract']);
    Route::delete('/api/work/contracts/{id}', [WorkController::class, 'apiContract']);

    Route::get('/api/work/meeting-notes', [WorkController::class, 'apiMeetingNotes']);
    Route::post('/api/work/meeting-notes', [WorkController::class, 'apiMeetingNotes']);
    Route::put('/api/work/meeting-notes/{id}', [WorkController::class, 'apiMeetingNote']);
    Route::delete('/api/work/meeting-notes/{id}', [WorkController::class, 'apiMeetingNote']);
});
```

**Step 3: Commit**

```bash
git add app/Http/Controllers/WorkController.php routes/web.php
git commit -m "feat: add WorkController with all routes"
```

---

## Task 9: Update Clients Page (Dynamic)

**Files:**
- Modify: `resources/js/Pages/Work/Clients.jsx`

**Step 1: Add dynamic functionality**

Replace the static client data with state management:

```jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import JournalLayout from '@/Layouts/JournalLayout';
import WorkEmptyState from '@/Components/WorkEmptyState';

const STATUS_CONFIG = {
    Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Lead: 'bg-amber-100 text-amber-700 border-amber-200',
    Inactive: 'bg-gray-100 text-gray-500 border-gray-200',
};

const AVATAR_COLORS = [
    'bg-blue-200 text-blue-800',
    'bg-emerald-200 text-emerald-800',
    'bg-purple-200 text-purple-800',
    'bg-pink-200 text-pink-800',
    'bg-amber-200 text-amber-800',
    'bg-orange-200 text-orange-800',
];

export default function Clients({ clients: propClients }) {
    const { auth } = usePage().props;
    const isAuth = !!auth?.user;

    const [clients, setClients] = useState(propClients || []);
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '', status: 'Lead', notes: '' });

    useEffect(() => { setClients(propClients || []); }, [propClients]);

    const saveRef = useRef(null);
    const autoSave = useCallback((data) => {
        if (!isAuth || !editingClient?.id) return;
        clearTimeout(saveRef.current);
        saveRef.current = setTimeout(() => {
            axios.put(`/api/work/clients/${editingClient.id}`, data);
        }, 1000);
    }, [isAuth, editingClient]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingClient?.id) {
                await axios.put(`/api/work/clients/${editingClient.id}`, formData);
                setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...formData } : c));
            } else {
                const res = await axios.post('/api/work/clients', formData);
                setClients([res.data, ...clients]);
            }
            setShowModal(false);
            setEditingClient(null);
            setFormData({ name: '', company: '', email: '', phone: '', status: 'Lead', notes: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this client?')) return;
        await axios.delete(`/api/work/clients/${id}`);
        setClients(clients.filter(c => c.id !== id));
    };

    const openEdit = (client) => {
        setEditingClient(client);
        setFormData({ name: client.name, company: client.company || '', email: client.email || '', phone: client.phone || '', status: client.status, notes: client.notes || '' });
        setShowModal(true);
    };

    const statusCounts = {
        Active: clients.filter(c => c.status === 'Active').length,
        Lead: clients.filter(c => c.status === 'Lead').length,
        Inactive: clients.filter(c => c.status === 'Inactive').length,
    };

    // Empty state
    if (!clients.length) {
        return (
            <JournalLayout pageTitle="Work OS - Clients" headerTitle="Client Tracker" headerSubtitle="Manage your relationships" titleFontClass="font-handwriting">
                <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <WorkEmptyState icon="people" title="Belum ada klien" description="Tambahkan klien pertama untuk memulai workflow freelancer-mu" actionLabel="Add Client" onAction={() => setShowModal(true)} />
                    </div>
                </div>
                {/* Modal form */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                            <h3 className="font-handwriting text-xl font-bold mb-4">{editingClient ? 'Edit Client' : 'Add Client'}</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-xl" required />
                                <input type="text" placeholder="Company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full p-3 border rounded-xl" />
                                <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border rounded-xl" />
                                <input type="tel" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border rounded-xl" />
                                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-3 border rounded-xl">
                                    <option value="Lead">Lead</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                                <textarea placeholder="Notes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-3 border rounded-xl" rows={3} />
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border rounded-xl">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl">{editingClient ? 'Update' : 'Add'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </JournalLayout>
        );
    }

    return (
        <JournalLayout pageTitle="Work OS - Clients" headerTitle="Client Tracker" headerSubtitle="Manage your relationships" titleFontClass="font-handwriting">
            <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8">
                {/* Header section same as original */}
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Status badges, add button, client list - same UI as original but using dynamic 'clients' state */}
                    {/* ... existing UI code ... */}
                    <div className="flex items-center gap-3">
                        <h3 className="font-handwriting text-2xl font-bold text-gray-700">All Clients</h3>
                        <span className="bg-primary/10 text-primary font-bold text-sm px-3 py-1 rounded-full">{clients.length} total</span>
                    </div>
                    <button onClick={() => { setEditingClient(null); setFormData({ name: '', company: '', email: '', phone: '', status: 'Lead', notes: '' }); setShowModal(true); }} className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">person_add</span> Add Client
                    </button>

                    {/* Client cards */}
                    <div className="grid gap-4">
                        {clients.map((client, idx) => (
                            <div key={client.id || idx} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full ${client.avatar_color || AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center font-bold text-lg`}>
                                        {client.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-handwriting font-bold text-gray-800">{client.name}</h4>
                                        <p className="font-note text-sm text-gray-500">{client.company}</p>
                                        <p className="font-note text-xs text-gray-400">{client.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_CONFIG[client.status]}`}>{client.status}</span>
                                    <button onClick={() => openEdit(client)} className="text-gray-400 hover:text-primary"><span className="material-symbols-outlined">edit</span></button>
                                    <button onClick={() => handleDelete(client.id)} className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined">delete</span></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h3 className="font-handwriting text-xl font-bold mb-4">{editingClient ? 'Edit Client' : 'Add Client'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-xl" required />
                            <input type="text" placeholder="Company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full p-3 border rounded-xl" />
                            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border rounded-xl" />
                            <input type="tel" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border rounded-xl" />
                            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-3 border rounded-xl">
                                <option value="Lead">Lead</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <textarea placeholder="Notes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-3 border rounded-xl" rows={3} />
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border rounded-xl">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl">{editingClient ? 'Update' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </JournalLayout>
    );
}
```

**Step 2: Commit**

```bash
git add resources/js/Pages/Work/Clients.jsx
git commit -m "feat: make Clients page dynamic with CRUD"
```

---

## Task 10: Update Invoices Page (Dynamic)

**Files:**
- Modify: `resources/js/Pages/Work/Invoices.jsx`

**Step 1: Add dynamic functionality with empty state**

Similar pattern to Clients - add state management, modal forms, empty state placeholder.

**Step 2: Commit**

```bash
git add resources/js/Pages/Work/Invoices.jsx
git commit -m "feat: make Invoices page dynamic with CRUD"
```

---

## Task 11: Update Pipeline Page (Dynamic)

**Files:**
- Modify: `resources/js/Pages/Work/Pipeline.jsx`

**Step 1: Add dynamic functionality with empty state**

**Step 2: Commit**

```bash
git add resources/js/Pages/Work/Pipeline.jsx
git commit -m "feat: make Pipeline page dynamic with CRUD"
```

---

## Task 12: Update TimeTracking Page (Dynamic)

**Files:**
- Modify: `resources/js/Pages/Work/TimeTracking.jsx`

**Step 1: Add timer functionality and empty state**

- Add start/stop timer button
- Show running timer
- Manual entry form

**Step 2: Commit**

```bash
git add resources/js/Pages/Work/TimeTracking.jsx
git commit -m "feat: make TimeTracking page dynamic with timer"
```

---

## Task 13: Update Contracts Page (Dynamic)

**Files:**
- Modify: `resources/js/Pages/Work/Contracts.jsx`

**Step 1: Add dynamic functionality with empty state**

**Step 2: Commit**

```bash
git add resources/js/Pages/Work/Contracts.jsx
git commit -m "feat: make Contracts page dynamic with CRUD"
```

---

## Task 14: Update MeetingNotes Page (Dynamic)

**Files:**
- Modify: `resources/js/Pages/Work/MeetingNotes.jsx`

**Step 1: Add dynamic functionality with empty state**

**Step 2: Commit**

```bash
git add resources/js/Pages/Work/MeetingNotes.jsx
git commit -m "feat: make MeetingNotes page dynamic with CRUD"
```

---

## Task 15: Update Dashboard Page (Dynamic)

**Files:**
- Modify: `resources/js/Pages/Work/Dashboard.jsx`

**Step 1: Use stats from props instead of static data**

Pass `stats` prop from controller and display dynamically.

**Step 2: Commit**

```bash
git add resources/js/Pages/Work/Dashboard.jsx
git commit -m "feat: make Dashboard display dynamic stats"
```

---

## Task 16: Update Income Page (Dynamic)

**Files:**
- Modify: `resources/js/Pages/Work/Income.jsx`

**Step 1: Use invoices data from props**

Display income based on paid invoices from database.

**Step 2: Commit**

```bash
git add resources/js/Pages/Work/Income.jsx
git commit -m "feat: make Income page show paid invoices"
```

---

## Task 17: Final Testing & Verification

**Step 1: Test all pages**

- Run: `php artisan serve` and navigate to each Work page
- Verify empty state shows when no data
- Test CRUD operations
- Test timer functionality

**Step 2: Commit**

```bash
git add . && git commit -m "feat: complete Work mode dynamic features"
```

---

**Plan complete!** Implementation will proceed in order from Task 1-17, starting with migrations and models, then controller, then frontend pages.