<?php

namespace App\Http\Controllers\Muslim;

use App\Http\Controllers\Controller;
use App\Models\MuhasabahEntry;
use Illuminate\Http\Request;

class MuhasabahController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        if (! $user) {
            return inertia('Muslim/Muhasabah', [
                'todayEntry' => null,
                'recentEntries' => [],
                'weeklyMoods' => [],
                'stats' => [
                    'totalEntries' => 0,
                    'streak' => 0,
                    'moodCounts' => [],
                ],
            ]);
        }

        // Get today's entry
        $todayEntry = MuhasabahEntry::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        // Get recent entries for history
        $recentEntries = MuhasabahEntry::where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->limit(30)
            ->get();

        // Get weekly mood summary
        $weeklyMoods = MuhasabahEntry::where('user_id', $user->id)
            ->where('date', '>=', now()->subDays(7))
            ->pluck('mood', 'date');

        // Stats
        $totalEntries = MuhasabahEntry::where('user_id', $user->id)->count();
        $streak = $this->calculateStreak($user->id);
        $moodCounts = MuhasabahEntry::where('user_id', $user->id)
            ->where('date', '>=', now()->subDays(30))
            ->whereNotNull('mood')
            ->get()
            ->groupBy('mood')
            ->map(fn($items) => $items->count());

        return inertia('Muslim/Muhasabah', [
            'todayEntry' => $todayEntry,
            'recentEntries' => $recentEntries,
            'weeklyMoods' => $weeklyMoods,
            'stats' => [
                'totalEntries' => $totalEntries,
                'streak' => $streak,
                'moodCounts' => $moodCounts,
            ],
        ]);
    }

    public function save(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'gratitude' => 'nullable|string|max:1000',
            'improvement' => 'nullable|string|max:1000',
            'achievement' => 'nullable|string|max:1000',
            'tomorrow_goal' => 'nullable|string|max:1000',
            'reflection' => 'nullable|string|max:2000',
            'mood' => 'nullable|in:happy,grateful,neutral,sad,anxious,peaceful',
        ]);

        $entry = MuhasabahEntry::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
            ],
            $validated
        );

        return response()->json($entry);
    }

    private function calculateStreak($userId)
    {
        $entries = MuhasabahEntry::where('user_id', $userId)
            ->orderBy('date', 'desc')
            ->limit(365)
            ->pluck('date');

        if ($entries->isEmpty()) {
            return 0;
        }

        $streak = 0;
        $expectedDate = now()->toDateString();

        foreach ($entries as $date) {
            if ($date === $expectedDate || ($streak === 0 && $date === now()->subDay()->toDateString())) {
                $streak++;
                $expectedDate = now()->subDays($streak)->toDateString();
            } else {
                break;
            }
        }

        return $streak;
    }
}
