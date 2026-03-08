<?php

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ModeController;
use App\Http\Controllers\PreferencesController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/gratitude', function () {
    return Inertia::render('Gratitude');
});

Route::get('/idea-dump', function () {
    return Inertia::render('IdeaDump');
});

Route::get('/daily-spread', function () {
    return Inertia::render('DailySpread');
});

Route::get('/task-log', function () {
    return Inertia::render('TaskLog');
});

Route::get('/habit-tracker', function () {
    return Inertia::render('HabitTracker');
});

Route::get('/notes', function () {
    return Inertia::render('Notes');
});

Route::get('/finances', function () {
    return Inertia::render('Finances');
});

Route::get('/calendar', function () {
    return Inertia::render('Calendar');
});

Route::get('/mood-tracker', function () {
    return Inertia::render('MoodTracker');
});

Route::get('/goals', function () {
    return Inertia::render('Goals');
});

Route::get('/focus-timer', function () {
    return Inertia::render('FocusTimer');
});

Route::get('/weekly-review', function () {
    return Inertia::render('WeeklyReview');
});

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
});

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

require __DIR__.'/auth.php';
