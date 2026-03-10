<?php

namespace App\Http\Controllers;

use App\Models\HabitDefinition;
use App\Models\HabitMonthlyReflection;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HabitTrackerController extends Controller
{
    private const DEFAULT_HABITS = [
        ['name' => 'Water', 'icon' => 'water_drop', 'color' => 'blue'],
        ['name' => 'Sleep', 'icon' => 'bedtime', 'color' => 'indigo'],
        ['name' => 'Pray', 'icon' => 'mosque', 'color' => 'green'],
        ['name' => 'Read', 'icon' => 'menu_book', 'color' => 'yellow'],
    ];

    public function index(Request $request)
    {
        $month = $request->query('month', now()->format('Y-m'));
        $startOfMonth = Carbon::parse($month . '-01')->startOfMonth();
        $endOfMonth = $startOfMonth->copy()->endOfMonth();
        $user = $request->user();

        $definitions = [];
        $logs = [];
        $reflection = null;

        if ($user) {
            // Auto-create defaults on first visit
            if ($user->habitDefinitions()->count() === 0) {
                foreach (self::DEFAULT_HABITS as $i => $habit) {
                    $user->habitDefinitions()->create([
                        ...$habit,
                        'is_default' => true,
                        'sort_order' => $i,
                    ]);
                }
            }

            $definitions = $user->habitDefinitions()
                ->where('archived', false)
                ->orderBy('sort_order')
                ->get();

            $logs = $user->habitLogs()
                ->whereBetween('date', [$startOfMonth->format('Y-m-d'), $endOfMonth->format('Y-m-d')])
                ->get()
                ->groupBy('habit_name')
                ->map(fn($items) => $items->keyBy(fn($i) => Carbon::parse($i->date)->day))
                ->toArray();

            $reflection = $user->habitMonthlyReflections()
                ->where('month', $month)
                ->value('content');
        }

        return Inertia::render('HabitTracker', [
            'month' => $month,
            'monthName' => $startOfMonth->translatedFormat('F'),
            'year' => $startOfMonth->year,
            'daysInMonth' => $endOfMonth->day,
            'definitions' => $definitions,
            'logs' => $logs,
            'reflection' => $reflection,
            'today' => now()->format('Y-m-d'),
        ]);
    }

    public function storeDefinition(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'icon' => 'required|string|max:50',
            'color' => 'nullable|string|max:20',
        ]);

        $def = $request->user()->habitDefinitions()->create([
            'name' => $request->name,
            'icon' => $request->icon,
            'color' => $request->color ?? 'blue',
            'sort_order' => $request->user()->habitDefinitions()->count(),
        ]);

        return response()->json($def);
    }

    public function updateDefinition(Request $request, int $id)
    {
        $def = $request->user()->habitDefinitions()->findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|string|max:100',
            'icon' => 'sometimes|string|max:50',
            'color' => 'sometimes|string|max:20',
            'archived' => 'sometimes|boolean',
        ]);
        $def->update($data);
        return response()->json($def);
    }

    public function toggleLog(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'habit_name' => 'required|string|max:100',
            'icon' => 'required|string|max:50',
        ]);

        $user = $request->user();
        $existing = $user->habitLogs()
            ->where('date', $request->date)
            ->where('habit_name', $request->habit_name)
            ->first();

        if ($existing) {
            // Toggle value instead of deleting — preserves Daily Spread data
            $isTruthy = $existing->value && $existing->value !== '0' && $existing->value !== '';
            $existing->update(['value' => $isTruthy ? null : true]);
            return response()->json(['status' => $isTruthy ? 'unchecked' : 'checked']);
        }

        $user->habitLogs()->create([
            'date' => $request->date,
            'habit_name' => $request->habit_name,
            'icon' => $request->icon,
            'value' => true,
        ]);

        return response()->json(['status' => 'added']);
    }

    public function saveReflection(Request $request)
    {
        $validated = $request->validate([
            'month' => ['required', 'date_format:Y-m'],
            'content' => 'nullable|string',
        ]);

        $reflection = $request->user()->habitMonthlyReflections()->updateOrCreate(
            ['month' => $validated['month']],
            ['content' => $validated['content'] ?? ''],
        );

        return response()->json($reflection);
    }
}
