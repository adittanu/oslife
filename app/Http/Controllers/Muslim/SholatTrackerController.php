<?php

namespace App\Http\Controllers\Muslim;

use App\Http\Controllers\Controller;
use App\Models\SholatWeeklyLog;
use App\Models\SunnahPrayerLog;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SholatTrackerController extends Controller
{
    public function index(Request $request)
    {
        $weekStart = $request->query('week_start', now()->startOfWeek()->toDateString());
        $user = $request->user();

        $startDate = Carbon::parse($weekStart)->startOfWeek();
        $endDate = $startDate->copy()->endOfWeek();

        if (! $user) {
            return inertia('Muslim/SholatTracker', [
                'weekStart' => $weekStart,
                'weeklyLogs' => [],
                'sunnahLogs' => [],
            ]);
        }

        $weeklyLogs = SholatWeeklyLog::where('user_id', $user->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        $sunnahLogs = SunnahPrayerLog::where('user_id', $user->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        return inertia('Muslim/SholatTracker', [
            'weekStart' => $weekStart,
            'weeklyLogs' => $weeklyLogs,
            'sunnahLogs' => $sunnahLogs,
        ]);
    }

    public function saveLog(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'prayer_name' => 'required|string',
            'status' => 'nullable|in:missed,alone,jamaah',
        ]);

        if ($validated['status'] === null) {
            SholatWeeklyLog::where('user_id', $request->user()->id)
                ->where('date', $validated['date'])
                ->where('prayer_name', $validated['prayer_name'])
                ->delete();

            return response()->json(['status' => 'cleared']);
        }

        SholatWeeklyLog::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
                'prayer_name' => $validated['prayer_name'],
            ],
            ['status' => $validated['status']]
        );

        return response()->json(['status' => $validated['status']]);
    }

    public function saveSunnah(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'prayer_name' => 'required|string',
            'done' => 'required|boolean',
        ]);

        $log = SunnahPrayerLog::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
                'prayer_name' => $validated['prayer_name'],
            ],
            ['done' => $validated['done']]
        );

        return response()->json($log);
    }
}
