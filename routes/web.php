<?php

use App\Http\Controllers\CalendarController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\DailySpreadController;
use App\Http\Controllers\FinancesController;
use App\Http\Controllers\FocusTimerController;
use App\Http\Controllers\GoalsController;
use App\Http\Controllers\GratitudeController;
use App\Http\Controllers\HabitTrackerController;
use App\Http\Controllers\IdeaDumpController;
use App\Http\Controllers\MoodTrackerController;
use App\Http\Controllers\NotesController;
use App\Http\Controllers\TourController;
use App\Http\Controllers\WeeklyReviewController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ModeController;
use App\Http\Controllers\PreferencesController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskLogController;
use App\Http\Controllers\ContentCalendarController;
use App\Http\Controllers\ContentIdeasController;
use App\Http\Controllers\ScriptWriterController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\BrandKitController;
use App\Http\Controllers\CollabNotesController;
use App\Http\Controllers\Muslim\DailySpreadController as MuslimDailySpreadController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/offline', function () {
    return view('offline');
});

Route::get('/sitemap.xml', function () {
    $urls = [
        ['loc' => url('/'), 'priority' => '1.0', 'changefreq' => 'weekly'],
        ['loc' => url('/login'), 'priority' => '0.8', 'changefreq' => 'monthly'],
        ['loc' => url('/register'), 'priority' => '0.8', 'changefreq' => 'monthly'],
    ];

    return response()->view('sitemap', ['urls' => $urls], 200)
        ->header('Content-Type', 'application/xml');
});

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/gratitude', [GratitudeController::class, 'index']);

Route::get('/idea-dump', [IdeaDumpController::class, 'index']);

Route::get('/daily-spread', [DailySpreadController::class, 'index']);

Route::get('/task-log', [TaskLogController::class, 'index']);

Route::get('/habit-tracker', [HabitTrackerController::class, 'index']);

Route::get('/notes', [NotesController::class, 'index']);

Route::get('/finances', [FinancesController::class, 'index']);

Route::get('/calendar', [CalendarController::class, 'index']);

Route::get('/mood-tracker', [MoodTrackerController::class, 'index']);

Route::get('/goals', [GoalsController::class, 'index']);

Route::get('/focus-timer', [FocusTimerController::class, 'index']);

Route::get('/weekly-review', [WeeklyReviewController::class, 'index']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/checkout/{plan}', [CheckoutController::class, 'show']);
    Route::post('/checkout/{plan}', [CheckoutController::class, 'store']);

    Route::get('/preferences', function () {
        return \Inertia\Inertia::render('Preferences');
    });
    Route::patch('/preferences/appearance', [PreferencesController::class, 'updateAppearance'])->name('preferences.appearance');
    Route::patch('/preferences/journal', [PreferencesController::class, 'updateJournalSettings'])->name('preferences.journal');

    Route::post('/api/mode', [ModeController::class, 'update']);

    Route::get('/api/chat/conversations', [ChatController::class, 'conversations']);
    Route::get('/api/chat/{conversationId}/messages', [ChatController::class, 'messages']);
    Route::post('/api/chat/send', [ChatController::class, 'send']);

    Route::post('/api/tour/seen', [TourController::class, 'markSeen']);

    Route::post('/api/calendar/event', [CalendarController::class, 'storeEvent']);
    Route::delete('/api/calendar/event/{id}', [CalendarController::class, 'destroyEvent']);

    Route::post('/api/tasks', [TaskLogController::class, 'store']);
    Route::patch('/api/tasks/{id}', [TaskLogController::class, 'update']);
    Route::delete('/api/tasks/{id}', [TaskLogController::class, 'destroy']);

    Route::post('/api/habits/definitions', [HabitTrackerController::class, 'storeDefinition']);
    Route::patch('/api/habits/definitions/{id}', [HabitTrackerController::class, 'updateDefinition']);
    Route::post('/api/habits/toggle', [HabitTrackerController::class, 'toggleLog']);

    Route::post('/api/daily-spread/schedule', [DailySpreadController::class, 'saveSchedule']);
    Route::post('/api/daily-spread/priorities', [DailySpreadController::class, 'savePriorities']);
    Route::post('/api/daily-spread/notes', [DailySpreadController::class, 'saveNotes']);
    Route::post('/api/daily-spread/mood', [DailySpreadController::class, 'saveMood']);
    Route::post('/api/daily-spread/habits', [DailySpreadController::class, 'saveHabits']);

    // Notes API
    Route::post('/api/notes', [NotesController::class, 'store']);
    Route::patch('/api/notes/{id}', [NotesController::class, 'update']);
    Route::delete('/api/notes/{id}', [NotesController::class, 'destroy']);

    // Finances API
    Route::post('/api/finances/transactions', [FinancesController::class, 'storeTransaction']);
    Route::patch('/api/finances/transactions/{id}', [FinancesController::class, 'updateTransaction']);
    Route::delete('/api/finances/transactions/{id}', [FinancesController::class, 'destroyTransaction']);
    Route::post('/api/finances/budgets', [FinancesController::class, 'storeBudget']);
    Route::post('/api/finances/goals', [FinancesController::class, 'storeGoal']);
    Route::patch('/api/finances/goals/{id}', [FinancesController::class, 'updateGoal']);

    // Ideas API
    Route::post('/api/ideas', [IdeaDumpController::class, 'store']);
    Route::patch('/api/ideas/{id}', [IdeaDumpController::class, 'update']);
    Route::delete('/api/ideas/{id}', [IdeaDumpController::class, 'destroy']);

    // Gratitude API
    Route::post('/api/gratitude', [GratitudeController::class, 'store']);
    Route::patch('/api/gratitude/{id}', [GratitudeController::class, 'update']);
    Route::delete('/api/gratitude/{id}', [GratitudeController::class, 'destroy']);

    // Mood Tracker API
    Route::post('/api/mood', [MoodTrackerController::class, 'storeMood']);
    Route::get('/api/mood/weekly', [MoodTrackerController::class, 'getWeeklyMoods']);

    // Goals API
    Route::post('/api/goals', [GoalsController::class, 'store']);
    Route::patch('/api/goals/{id}', [GoalsController::class, 'update']);
    Route::delete('/api/goals/{id}', [GoalsController::class, 'destroy']);
    Route::post('/api/goals/{goalId}/milestones', [GoalsController::class, 'storeMilestone']);
    Route::patch('/api/milestones/{milestoneId}', [GoalsController::class, 'updateMilestone']);
    Route::delete('/api/milestones/{milestoneId}', [GoalsController::class, 'destroyMilestone']);

    // Focus Timer API
    Route::post('/api/focus/sessions', [FocusTimerController::class, 'startSession']);
    Route::patch('/api/focus/sessions/{id}', [FocusTimerController::class, 'completeSession']);
    Route::post('/api/focus/sessions/{id}/tasks', [FocusTimerController::class, 'addTask']);

    // Weekly Review API
    Route::post('/api/weekly-review', [WeeklyReviewController::class, 'store']);
    Route::patch('/api/weekly-review/{id}', [WeeklyReviewController::class, 'update']);
    Route::delete('/api/weekly-review/{id}', [WeeklyReviewController::class, 'destroy']);

    // Muslim Daily Spread API
    Route::post('/api/muslim/daily-spread/sholat', [MuslimDailySpreadController::class, 'saveSholat']);
    Route::post('/api/muslim/daily-spread/dzikir', [MuslimDailySpreadController::class, 'saveDzikir']);
    Route::post('/api/muslim/daily-spread/quran-target', [MuslimDailySpreadController::class, 'saveQuranTarget']);
    Route::post('/api/muslim/daily-spread/muhasabah', [MuslimDailySpreadController::class, 'saveMuhasabah']);

    // Creator Mode APIs
    Route::post('/api/creator/content-posts', [ContentCalendarController::class, 'store']);
    Route::patch('/api/creator/content-posts/{post}', [ContentCalendarController::class, 'update']);
    Route::delete('/api/creator/content-posts/{post}', [ContentCalendarController::class, 'destroy']);

    Route::post('/api/creator/content-ideas', [ContentIdeasController::class, 'store']);
    Route::patch('/api/creator/content-ideas/{idea}', [ContentIdeasController::class, 'update']);
    Route::delete('/api/creator/content-ideas/{idea}', [ContentIdeasController::class, 'destroy']);

    Route::post('/api/creator/scripts', [ScriptWriterController::class, 'store']);
    Route::patch('/api/creator/scripts/{script}', [ScriptWriterController::class, 'update']);
    Route::delete('/api/creator/scripts/{script}', [ScriptWriterController::class, 'destroy']);

    Route::post('/api/creator/platform-stats', [AnalyticsController::class, 'store']);
    Route::patch('/api/creator/platform-stats/{stat}', [AnalyticsController::class, 'update']);

    Route::post('/api/creator/brand-kit', [BrandKitController::class, 'store']);
    Route::patch('/api/creator/brand-kit/{brandKit}', [BrandKitController::class, 'update']);

    Route::post('/api/creator/collabs', [CollabNotesController::class, 'store']);
    Route::patch('/api/creator/collabs/{collab}', [CollabNotesController::class, 'update']);
    Route::delete('/api/creator/collabs/{collab}', [CollabNotesController::class, 'destroy']);
});

// Muslim Mode Pages
Route::get('/muslim/daily-spread', [MuslimDailySpreadController::class, 'index']);
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

// Creator Mode Pages
Route::get('/creator/content-calendar', [ContentCalendarController::class, 'index']);
Route::get('/creator/content-ideas', [ContentIdeasController::class, 'index']);
Route::get('/creator/script-writer', [ScriptWriterController::class, 'index']);
Route::get('/creator/analytics', [AnalyticsController::class, 'index']);
Route::get('/creator/brand-kit', [BrandKitController::class, 'index']);
Route::get('/creator/collab-notes', [CollabNotesController::class, 'index']);

// Work/Freelancer Mode Pages
Route::get('/work/dashboard', fn() => Inertia::render('Work/Dashboard'));
Route::get('/work/clients', fn() => Inertia::render('Work/Clients'));
Route::get('/work/pipeline', fn() => Inertia::render('Work/Pipeline'));
Route::get('/work/time-tracking', fn() => Inertia::render('Work/TimeTracking'));
Route::get('/work/invoices', fn() => Inertia::render('Work/Invoices'));
Route::get('/work/income', fn() => Inertia::render('Work/Income'));
Route::get('/work/meeting-notes', fn() => Inertia::render('Work/MeetingNotes'));
Route::get('/work/contracts', fn() => Inertia::render('Work/Contracts'));

require __DIR__.'/auth.php';
