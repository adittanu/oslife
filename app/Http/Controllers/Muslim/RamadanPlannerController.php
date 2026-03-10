<?php

namespace App\Http\Controllers\Muslim;

use App\Http\Controllers\Controller;
use App\Models\RamadanLog;
use App\Models\RamadanGoal;
use Illuminate\Http\Request;

class RamadanPlannerController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $currentYear = now()->year;

        // Get ramadan logs
        $logs = RamadanLog::where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->get()
            ->keyBy('date');

        // Get ramadan goals
        $goals = RamadanGoal::where('user_id', $user->id)
            ->where('ramadan_year', $currentYear)
            ->get();

        // Calculate stats
        $totalDays = $logs->count();
        $completeFast = $logs->filter(fn($l) => $l->sahur && $l->iftar)->count();
        $totalQuran = $logs->sum('quran_pages');
        $totalTarawih = $logs->filter(fn($l) => $l->tarawih)->count();

        return inertia('Muslim/RamadanPlanner', [
            'logs' => $logs,
            'goals' => $goals,
            'stats' => [
                'totalDays' => $totalDays,
                'completeFast' => $completeFast,
                'totalQuran' => $totalQuran,
                'totalTarawih' => $totalTarawih,
            ],
            'currentYear' => $currentYear,
        ]);
    }

    public function saveLog(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'sahur' => 'nullable|boolean',
            'iftar' => 'nullable|boolean',
            'tarawih' => 'nullable|boolean',
            'quran_pages' => 'nullable|integer|min:0',
            'reflection' => 'nullable|string',
        ]);

        RamadanLog::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
            ],
            $validated
        );

        return back();
    }

    public function saveGoal(Request $request)
    {
        $validated = $request->validate([
            'goal_type' => 'required|string',
            'description' => 'required|string',
            'target' => 'nullable|integer|min:1',
            'ramadan_year' => 'required|integer',
        ]);

        RamadanGoal::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'goal_type' => $validated['goal_type'],
                'ramadan_year' => $validated['ramadan_year'],
            ],
            $validated
        );

        return back();
    }

    public function updateGoalProgress(Request $request, $id)
    {
        $goal = RamadanGoal::where('user_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'current' => 'required|integer|min:0',
        ]);

        $goal->update($validated);

        return back();
    }
}