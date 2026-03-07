<?php

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

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
