<?php

namespace App\Http\Controllers\Muslim;

use App\Http\Controllers\Controller;
use App\Models\DzikirLog;
use Illuminate\Http\Request;

class DzikirController extends Controller
{
    // Default dzikir list
    private const DEFAULT_DZIKIR = [
        ['name' => 'Subhanallah', 'target' => 33],
        ['name' => 'Alhamdulillah', 'target' => 33],
        ['name' => 'Allahu Akbar', 'target' => 34],
        ['name' => 'La ilaha illallah', 'target' => 100],
        ['name' => 'Astaghfirullah', 'target' => 100],
        ['name' => 'Hasbunallah wa ni\'mal wakil', 'target' => 7],
    ];

    public function index(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        // Get today's dzikir logs
        $todayLogs = DzikirLog::where('user_id', $user->id)
            ->where('date', $today)
            ->get()
            ->keyBy('dzikir_name');

        // Get weekly stats
        $weeklyLogs = DzikirLog::where('user_id', $user->id)
            ->where('date', '>=', now()->subDays(7))
            ->orderBy('date', 'desc')
            ->get();

        // Build dzikir list with current progress
        $dzikirList = collect(self::DEFAULT_DZIKIR)->map(function ($dzikir) use ($todayLogs) {
            $log = $todayLogs->get($dzikir['name']);
            return [
                'name' => $dzikir['name'],
                'target' => $dzikir['target'],
                'count' => $log?->count ?? 0,
                'id' => $log?->id,
            ];
        });

        // Calculate stats
        $totalToday = $todayLogs->sum('count');
        $totalWeek = $weeklyLogs->sum('count');
        $completedToday = $todayLogs->where('count', '>=', 'target')->count();

        return inertia('Muslim/Dzikir', [
            'dzikirList' => $dzikirList,
            'weeklyLogs' => $weeklyLogs->groupBy('date')->map(function ($logs, $date) {
                return [
                    'date' => $date,
                    'total' => $logs->sum('count'),
                    'completed' => $logs->where('count', '>=', 'target')->count(),
                ];
            })->values(),
            'stats' => [
                'today' => $totalToday,
                'week' => $totalWeek,
                'completedToday' => $completedToday,
                'totalDzikir' => count(self::DEFAULT_DZIKIR),
            ],
        ]);
    }

    public function increment(Request $request)
    {
        $validated = $request->validate([
            'dzikir_name' => 'required|string',
            'date' => 'required|date',
            'target' => 'nullable|integer',
        ]);

        $dzikir = collect(self::DEFAULT_DZIKIR)->firstWhere('name', $validated['dzikir_name']);
        $target = $validated['target'] ?? $dzikir['target'] ?? 33;

        $log = DzikirLog::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
                'dzikir_name' => $validated['dzikir_name'],
            ],
            [
                'target' => $target,
            ]
        );

        $log->increment('count');

        return back();
    }

    public function setCount(Request $request)
    {
        $validated = $request->validate([
            'dzikir_name' => 'required|string',
            'date' => 'required|date',
            'count' => 'required|integer|min:0',
            'target' => 'nullable|integer',
        ]);

        $dzikir = collect(self::DEFAULT_DZIKIR)->firstWhere('name', $validated['dzikir_name']);
        $target = $validated['target'] ?? $dzikir['target'] ?? 33;

        DzikirLog::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
                'dzikir_name' => $validated['dzikir_name'],
            ],
            [
                'count' => $validated['count'],
                'target' => $target,
            ]
        );

        return back();
    }

    public function reset(Request $request)
    {
        $validated = $request->validate([
            'dzikir_name' => 'required|string',
            'date' => 'required|date',
        ]);

        DzikirLog::where('user_id', $request->user()->id)
            ->where('date', $validated['date'])
            ->where('dzikir_name', $validated['dzikir_name'])
            ->update(['count' => 0]);

        return back();
    }
}