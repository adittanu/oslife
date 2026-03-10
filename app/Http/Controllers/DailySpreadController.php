<?php

namespace App\Http\Controllers;

use App\Models\DailyNote;
use App\Models\HabitLog;
use App\Models\MoodEntry;
use App\Models\Priority;
use App\Models\ScheduleItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DailySpreadController extends Controller
{
    private const MOOD_LEVEL_MAP = [
        'happy' => 5,
        'optimistic' => 4,
        'neutral' => 3,
        'sad' => 2,
        'stressed' => 1,
    ];

    public function index(Request $request)
    {
        $date = $request->query('date', now()->format('Y-m-d'));
        $user = $request->user();

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
            'schedule' => $user->scheduleItems()->where('date', $date)->orderBy('sort_order')->get(),
            'priorities' => $user->priorities()->where('date', $date)->orderBy('sort_order')->get(),
            'notes' => $user->dailyNotes()->where('date', $date)->first()?->content,
            'mood' => $user->moodEntries()->where('date', $date)->first(),
            'habits' => $user->habitLogs()->where('date', $date)->get(),
        ]);
    }

    public function saveSchedule(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'items' => 'required|array',
            'items.*.time' => 'required|string|max:5',
            'items.*.title' => 'required|string|max:255',
            'items.*.description' => 'nullable|string|max:255',
            'items.*.color' => 'nullable|string|max:20',
        ]);

        $user = $request->user();
        $user->scheduleItems()->where('date', $validated['date'])->delete();

        foreach ($validated['items'] as $index => $item) {
            $user->scheduleItems()->create([
                'date' => $validated['date'],
                'time' => $item['time'],
                'title' => $item['title'],
                'description' => $item['description'] ?? null,
                'color' => $item['color'] ?? 'blue',
                'sort_order' => $index,
            ]);
        }

        return response()->json(['status' => 'ok']);
    }

    public function savePriorities(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'items' => 'required|array',
            'items.*.text' => 'required|string|max:255',
            'items.*.completed' => 'nullable|boolean',
        ]);

        $user = $request->user();
        $user->priorities()->where('date', $validated['date'])->delete();

        foreach ($validated['items'] as $index => $item) {
            $user->priorities()->create([
                'date' => $validated['date'],
                'text' => $item['text'],
                'completed' => $item['completed'] ?? false,
                'sort_order' => $index,
            ]);
        }

        return response()->json(['status' => 'ok']);
    }

    public function saveNotes(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'content' => 'nullable|string',
        ]);

        $user = $request->user();
        $user->dailyNotes()->updateOrCreate(
            ['date' => $validated['date']],
            ['content' => $validated['content']],
        );

        return response()->json(['status' => 'ok']);
    }

    public function saveMood(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'mood' => 'required|string|max:50',
            'icon' => 'required|string|max:50',
        ]);

        $user = $request->user();
        $user->moodEntries()->updateOrCreate(
            ['date' => $validated['date']],
            [
                'mood' => $validated['mood'],
                'icon' => $validated['icon'],
                'mood_level' => self::MOOD_LEVEL_MAP[$validated['mood']] ?? null,
            ],
        );

        return response()->json(['status' => 'ok']);
    }

    public function saveHabits(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'habits' => 'required|array',
            'habits.*.habit_name' => 'required|string|max:100',
            'habits.*.icon' => 'required|string|max:50',
            'habits.*.value' => 'nullable',
        ]);

        $user = $request->user();

        foreach ($validated['habits'] as $habit) {
            $user->habitLogs()->updateOrCreate(
                ['date' => $validated['date'], 'habit_name' => $habit['habit_name']],
                ['icon' => $habit['icon'], 'value' => $habit['value'] ?? null],
            );
        }

        return response()->json(['status' => 'ok']);
    }
}
