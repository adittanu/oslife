<?php

namespace App\Http\Controllers;

use App\Models\MoodEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MoodTrackerController extends Controller
{
    private const LEVEL_TO_LEGACY_MOOD = [
        5 => ['mood' => 'happy', 'icon' => 'sentiment_very_satisfied'],
        4 => ['mood' => 'optimistic', 'icon' => 'sentiment_satisfied'],
        3 => ['mood' => 'neutral', 'icon' => 'sentiment_neutral'],
        2 => ['mood' => 'sad', 'icon' => 'sentiment_dissatisfied'],
        1 => ['mood' => 'stressed', 'icon' => 'sentiment_stressed'],
    ];

    private const LEGACY_MOOD_TO_LEVEL = [
        'happy' => 5,
        'optimistic' => 4,
        'neutral' => 3,
        'sad' => 2,
        'stressed' => 1,
    ];

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
                ->get()
                ->map(fn (MoodEntry $entry) => $this->normalizeEntry($entry))
                ->values();

            // Get today's mood
            $todayMood = $user->moodEntries()
                ->where('date', now()->format('Y-m-d'))
                ->first();

            if ($todayMood) {
                $todayMood = $this->normalizeEntry($todayMood);
            }
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

        $legacyMood = self::LEVEL_TO_LEGACY_MOOD[$data['mood_level']] ?? self::LEVEL_TO_LEGACY_MOOD[3];
        $payload = [
            'mood_level' => $data['mood_level'],
            'note' => $data['note'] ?? '',
            'tags' => $data['tags'] ?? [],
            'mood' => $legacyMood['mood'],
            'icon' => $legacyMood['icon'],
        ];

        // Upsert: update if exists for this date, otherwise create
        $existing = $request->user()->moodEntries()
            ->where('date', $data['date'])
            ->first();

        if ($existing) {
            $existing->update($payload);
            return response()->json($this->normalizeEntry($existing->fresh()));
        }

        $mood = $request->user()->moodEntries()->create([
            'date' => $data['date'],
            ...$payload,
        ]);

        return response()->json($this->normalizeEntry($mood));
    }

    public function getWeeklyMoods(Request $request)
    {
        $user = $request->user();
        $weekStart = now()->startOfWeek();
        $weekEnd = now()->endOfWeek();

        $moods = $user->moodEntries()
            ->whereBetween('date', [$weekStart, $weekEnd])
            ->orderBy('date')
            ->get()
            ->map(fn (MoodEntry $entry) => $this->normalizeEntry($entry))
            ->values();

        return response()->json($moods);
    }

    private function normalizeEntry(MoodEntry $entry): array
    {
        return [
            'id' => $entry->id,
            'date' => $entry->date?->format('Y-m-d'),
            'mood_level' => $entry->mood_level ?? self::LEGACY_MOOD_TO_LEVEL[$entry->mood] ?? 3,
            'note' => $entry->note ?? '',
            'tags' => $entry->tags ?? [],
            'mood' => $entry->mood,
            'icon' => $entry->icon,
        ];
    }
}
