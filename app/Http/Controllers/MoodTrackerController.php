<?php

namespace App\Http\Controllers;

use App\Models\MoodEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MoodTrackerController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $moods = [];
        $todayMood = null;

        if ($user) {
            // Get this week's moods
            $weekStart = now()->startOfWeek();
            $weekEnd = now()->endOfWeek();

            $moods = $user->moodEntries()
                ->whereBetween('date', [$weekStart, $weekEnd])
                ->orderBy('date')
                ->get();

            // Get today's mood
            $todayMood = $user->moodEntries()
                ->where('date', now()->format('Y-m-d'))
                ->first();
        }

        return Inertia::render('MoodTracker', [
            'moods' => $moods,
            'todayMood' => $todayMood,
        ]);
    }

    public function storeMood(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'mood_level' => 'required|integer|between:1,5',
            'note' => 'nullable|string|max:500',
            'tags' => 'nullable|array',
        ]);

        // Upsert: update if exists for this date, otherwise create
        $existing = $request->user()->moodEntries()
            ->where('date', $data['date'])
            ->first();

        if ($existing) {
            $existing->update($data);
            return response()->json($existing);
        }

        $mood = $request->user()->moodEntries()->create($data);
        return response()->json($mood);
    }

    public function getWeeklyMoods(Request $request)
    {
        $user = $request->user();
        $weekStart = now()->startOfWeek();
        $weekEnd = now()->endOfWeek();

        $moods = $user->moodEntries()
            ->whereBetween('date', [$weekStart, $weekEnd])
            ->orderBy('date')
            ->get();

        return response()->json($moods);
    }
}
