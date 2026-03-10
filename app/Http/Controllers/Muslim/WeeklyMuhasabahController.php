<?php

namespace App\Http\Controllers\Muslim;

use App\Http\Controllers\Controller;
use App\Models\WeeklyMuhasabah;
use Illuminate\Http\Request;

class WeeklyMuhasabahController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get current week start (Monday)
        $currentWeekStart = now()->startOfWeek()->toDateString();

        if (! $user) {
            return inertia('Muslim/WeeklyMuhasabah', [
                'thisWeek' => null,
                'recentWeeks' => [],
                'currentWeekStart' => $currentWeekStart,
                'weekRange' => [
                    'start' => now()->startOfWeek()->format('d M'),
                    'end' => now()->endOfWeek()->format('d M Y'),
                ],
            ]);
        }

        // Get this week's entry
        $thisWeek = WeeklyMuhasabah::where('user_id', $user->id)
            ->where('week_start', $currentWeekStart)
            ->first();

        // Get recent weeks
        $recentWeeks = WeeklyMuhasabah::where('user_id', $user->id)
            ->orderBy('week_start', 'desc')
            ->limit(12)
            ->get();

        return inertia('Muslim/WeeklyMuhasabah', [
            'thisWeek' => $thisWeek,
            'recentWeeks' => $recentWeeks,
            'currentWeekStart' => $currentWeekStart,
            'weekRange' => [
                'start' => now()->startOfWeek()->format('d M'),
                'end' => now()->endOfWeek()->format('d M Y'),
            ],
        ]);
    }

    public function save(Request $request)
    {
        $validated = $request->validate([
            'week_start' => 'required|date',
            'achievements' => 'nullable|array',
            'challenges' => 'nullable|array',
            'lessons_learned' => 'nullable|string',
            'next_week_goals' => 'nullable|array',
            'gratitude' => 'nullable|string',
            'overall_mood' => 'nullable|string',
        ]);

        $entry = WeeklyMuhasabah::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'week_start' => $validated['week_start'],
            ],
            $validated
        );

        return response()->json($entry);
    }
}
