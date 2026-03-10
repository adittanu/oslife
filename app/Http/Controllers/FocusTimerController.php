<?php

namespace App\Http\Controllers;

use App\Models\FocusSession;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FocusTimerController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $todaySessions = [];
        $stats = [
            'total_sessions' => 0,
            'total_minutes' => 0,
            'tasks_completed' => 0,
            'streak' => 0,
        ];

        if ($user) {
            $today = now()->format('Y-m-d');

            $todaySessions = $user->focusSessions()
                ->where('date', $today)
                ->orderBy('created_at', 'desc')
                ->get();

            // Calculate stats
            $stats['total_sessions'] = $user->focusSessions()
                ->where('date', $today)
                ->where('completed', true)
                ->count();

            $stats['total_minutes'] = $user->focusSessions()
                ->where('date', $today)
                ->where('completed', true)
                ->sum('duration');

            // Simple streak calculation (consecutive days with at least one session)
            $streak = 0;
            $checkDate = now();
            while (true) {
                $count = $user->focusSessions()
                    ->where('date', $checkDate->format('Y-m-d'))
                    ->where('completed', true)
                    ->count();
                if ($count === 0) {
                    break;
                }
                $streak++;
                $checkDate->subDay();
                if ($streak >= 30) { // Cap at 30 days
                    break;
                }
            }
            $stats['streak'] = $streak;
        }

        return Inertia::render('FocusTimer', [
            'todaySessions' => $todaySessions,
            'stats' => $stats,
        ]);
    }

    public function startSession(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'duration' => 'required|integer|min:1',
            'mode' => 'nullable|string|default:focus',
            'tasks' => 'nullable|array',
        ]);

        $session = $request->user()->focusSessions()->create($data);
        return response()->json($session);
    }

    public function completeSession(Request $request, int $id)
    {
        $session = $request->user()->focusSessions()->findOrFail($id);
        $session->update(['completed' => true]);
        return response()->json($session);
    }

    public function addTask(Request $request, int $sessionId)
    {
        $session = $request->user()->focusSessions()->findOrFail($sessionId);

        $data = $request->validate([
            'text' => 'required|string|max:255',
            'done' => 'nullable|boolean',
        ]);

        $tasks = $session->tasks ?? [];
        $tasks[] = [
            'text' => $data['text'],
            'done' => $data['done'] ?? false,
        ];

        $session->update(['tasks' => $tasks]);
        return response()->json($session->fresh());
    }
}
