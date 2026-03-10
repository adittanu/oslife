<?php

namespace App\Http\Controllers\Muslim;

use App\Http\Controllers\Controller;
use App\Models\SedekahLog;
use Illuminate\Http\Request;

class SedekahTrackerController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        // Get today's sedekah
        $todayLogs = SedekahLog::where('user_id', $user->id)
            ->where('date', $today)
            ->get();

        // Get monthly logs
        $monthlyLogs = SedekahLog::where('user_id', $user->id)
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->orderBy('date', 'desc')
            ->get();

        // Calculate stats
        $totalAmount = $monthlyLogs->where('type', 'uang')->sum('amount');
        $totalCount = $monthlyLogs->count();
        $streak = $this->calculateStreak($user->id);

        return inertia('Muslim/SedekahTracker', [
            'todayLogs' => $todayLogs,
            'monthlyLogs' => $monthlyLogs,
            'stats' => [
                'totalAmount' => $totalAmount,
                'totalCount' => $totalCount,
                'streak' => $streak,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'type' => 'required|string',
            'description' => 'nullable|string|max:500',
            'amount' => 'nullable|numeric|min:0',
            'recipient' => 'nullable|string|max:255',
        ]);

        SedekahLog::create([
            'user_id' => $request->user()->id,
            ...$validated,
        ]);

        return back();
    }

    public function destroy(Request $request, $id)
    {
        $log = SedekahLog::where('user_id', $request->user()->id)->findOrFail($id);
        $log->delete();

        return back();
    }

    private function calculateStreak($userId)
    {
        $logs = SedekahLog::where('user_id', $userId)
            ->orderBy('date', 'desc')
            ->distinct('date')
            ->limit(365)
            ->pluck('date');

        if ($logs->isEmpty()) return 0;

        $streak = 0;
        $expectedDate = now()->toDateString();

        foreach ($logs as $date) {
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