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
use App\Http\Controllers\WorkController;
use App\Http\Controllers\Muslim\DailySpreadController as MuslimDailySpreadController;
use App\Http\Controllers\Muslim\SholatTrackerController as MuslimSholatTrackerController;
use App\Http\Controllers\Muslim\QuranJournalController as MuslimQuranJournalController;
use App\Http\Controllers\Muslim\DzikirController as MuslimDzikirController;
use App\Http\Controllers\Muslim\MuhasabahController as MuslimMuhasabahController;
use App\Http\Controllers\Muslim\SedekahTrackerController as MuslimSedekahTrackerController;
use App\Http\Controllers\Muslim\KajianNotesController as MuslimKajianNotesController;
use App\Http\Controllers\Muslim\DoaController as MuslimDoaController;
use App\Http\Controllers\Muslim\RamadanPlannerController as MuslimRamadanPlannerController;
use App\Http\Controllers\Muslim\WeeklyMuhasabahController as MuslimWeeklyMuhasabahController;
use App\Http\Controllers\Muslim\HabitTrackerController as MuslimHabitTrackerController;
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
Route::redirect('/dashboard', '/daily-spread')->middleware('auth')->name('dashboard');

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
    Route::post('/api/habits/reflection', [HabitTrackerController::class, 'saveReflection']);

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

    // Muslim Sholat Tracker API
    Route::post('/api/muslim/sholat-tracker/log', [MuslimSholatTrackerController::class, 'saveLog']);
    Route::post('/api/muslim/sholat-tracker/sunnah', [MuslimSholatTrackerController::class, 'saveSunnah']);

    // Muslim Quran Journal API
    Route::post('/api/muslim/quran-journal/reading-log', [MuslimQuranJournalController::class, 'saveReadingLog']);
    Route::post('/api/muslim/quran-journal/hifz', [MuslimQuranJournalController::class, 'saveHifz']);
    Route::patch('/api/muslim/quran-journal/hifz/{id}', [MuslimQuranJournalController::class, 'updateHifz']);
    Route::post('/api/muslim/quran-journal/tadabbur', [MuslimQuranJournalController::class, 'saveTadabbur']);
    Route::patch('/api/muslim/quran-journal/tadabbur/{id}', [MuslimQuranJournalController::class, 'updateTadabbur']);
    Route::delete('/api/muslim/quran-journal/tadabbur/{id}', [MuslimQuranJournalController::class, 'deleteTadabbur']);

    // Muslim Dzikir API
    Route::post('/api/muslim/dzikir/increment', [MuslimDzikirController::class, 'increment']);
    Route::post('/api/muslim/dzikir/set', [MuslimDzikirController::class, 'setCount']);
    Route::post('/api/muslim/dzikir/reset', [MuslimDzikirController::class, 'reset']);

    // Muslim Muhasabah API
    Route::post('/api/muslim/muhasabah', [MuslimMuhasabahController::class, 'save']);

    // Muslim Sedekah Tracker API
    Route::post('/api/muslim/sedekah', [MuslimSedekahTrackerController::class, 'store']);
    Route::delete('/api/muslim/sedekah/{id}', [MuslimSedekahTrackerController::class, 'destroy']);

    // Muslim Kajian Notes API
    Route::post('/api/muslim/kajian-notes', [MuslimKajianNotesController::class, 'store']);
    Route::patch('/api/muslim/kajian-notes/{id}', [MuslimKajianNotesController::class, 'update']);
    Route::delete('/api/muslim/kajian-notes/{id}', [MuslimKajianNotesController::class, 'destroy']);

    // Muslim Doa API
    Route::post('/api/muslim/doa/favorite', [MuslimDoaController::class, 'toggleFavorite']);
    Route::post('/api/muslim/doa/note', [MuslimDoaController::class, 'updateNote']);
    Route::post('/api/muslim/doa/read', [MuslimDoaController::class, 'markRead']);

    // Muslim Ramadan Planner API
    Route::post('/api/muslim/ramadan/log', [MuslimRamadanPlannerController::class, 'saveLog']);
    Route::post('/api/muslim/ramadan/goal', [MuslimRamadanPlannerController::class, 'saveGoal']);
    Route::patch('/api/muslim/ramadan/goal/{id}', [MuslimRamadanPlannerController::class, 'updateGoalProgress']);

    // Muslim Weekly Muhasabah API
    Route::post('/api/muslim/weekly-muhasabah', [MuslimWeeklyMuhasabahController::class, 'save']);

    // Muslim Habit Tracker API
    Route::post('/api/muslim/habit-tracker/definitions', [MuslimHabitTrackerController::class, 'storeDefinition']);
    Route::patch('/api/muslim/habit-tracker/definitions/{id}', [MuslimHabitTrackerController::class, 'updateDefinition']);
    Route::post('/api/muslim/habit-tracker/toggle', [MuslimHabitTrackerController::class, 'toggleLog']);
    Route::post('/api/muslim/habit-tracker/reflection', [MuslimHabitTrackerController::class, 'saveReflection']);

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
Route::get('/muslim/sholat-tracker', [MuslimSholatTrackerController::class, 'index']);
Route::get('/muslim/quran-journal', [MuslimQuranJournalController::class, 'index']);
Route::get('/muslim/dzikir', [MuslimDzikirController::class, 'index']);
Route::get('/muslim/doa', [MuslimDoaController::class, 'index']);
Route::get('/muslim/kajian-notes', [MuslimKajianNotesController::class, 'index']);
Route::get('/muslim/muhasabah', [MuslimMuhasabahController::class, 'index']);
Route::get('/muslim/sedekah-tracker', [MuslimSedekahTrackerController::class, 'index']);
Route::get('/muslim/ramadan-planner', [MuslimRamadanPlannerController::class, 'index']);
Route::get('/muslim/habit-tracker', [MuslimHabitTrackerController::class, 'index']);
Route::get('/muslim/weekly-muhasabah', [MuslimWeeklyMuhasabahController::class, 'index']);

// Creator Mode Pages
Route::get('/creator/content-calendar', [ContentCalendarController::class, 'index']);
Route::get('/creator/content-ideas', [ContentIdeasController::class, 'index']);
Route::get('/creator/script-writer', [ScriptWriterController::class, 'index']);
Route::get('/creator/analytics', [AnalyticsController::class, 'index']);
Route::get('/creator/brand-kit', [BrandKitController::class, 'index']);
Route::get('/creator/collab-notes', [CollabNotesController::class, 'index']);

// Work/Freelancer Mode Pages (require auth)
Route::middleware('auth')->group(function () {
    Route::get('/work/dashboard', [WorkController::class, 'dashboard']);
    Route::get('/work/clients', [WorkController::class, 'clients']);
    Route::get('/work/pipeline', [WorkController::class, 'pipeline']);
    Route::get('/work/time-tracking', [WorkController::class, 'timeTracking']);
    Route::get('/work/invoices', [WorkController::class, 'invoices']);
    Route::get('/work/income', [WorkController::class, 'income']);
    Route::get('/work/meeting-notes', [WorkController::class, 'meetingNotes']);
    Route::get('/work/contracts', [WorkController::class, 'contracts']);

    // Work Mode API Routes
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

require __DIR__.'/auth.php';
