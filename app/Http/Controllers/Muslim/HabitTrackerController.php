<?php

namespace App\Http\Controllers\Muslim;

use App\Http\Controllers\Controller;
use App\Models\MuslimHabitDefinition;
use App\Models\MuslimHabitLog;
use App\Models\MuslimHabitReflection;
use Carbon\Carbon;
use Illuminate\Http\Request;

class HabitTrackerController extends Controller
{
    private const DEFAULT_HABITS = [
        ['name' => 'Tahajud', 'icon' => 'dark_mode', 'color' => 'indigo'],
        ['name' => 'Dhuha', 'icon' => 'wb_sunny', 'color' => 'amber'],
        ['name' => 'Puasa Sunnah', 'icon' => 'restaurant', 'color' => 'emerald'],
        ['name' => 'Tilawah', 'icon' => 'menu_book', 'color' => 'teal'],
        ['name' => 'Sedekah', 'icon' => 'favorite', 'color' => 'pink'],
        ['name' => 'Istighfar 100x', 'icon' => 'self_improvement', 'color' => 'purple'],
        ['name' => 'Sholawat 100x', 'icon' => 'volunteer_activism', 'color' => 'rose'],
    ];

    public function index(Request $request)
    {
        $weekStart = $request->query('week_start', now()->startOfWeek()->toDateString());
        $startDate = Carbon::parse($weekStart)->startOfWeek();
        $endDate = $startDate->copy()->endOfWeek();
        $user = $request->user();

        if (! $user) {
            return inertia('Muslim/HabitTracker', [
                'weekStart' => $startDate->toDateString(),
                'weekRange' => [
                    'start' => $startDate->translatedFormat('j M'),
                    'end' => $endDate->translatedFormat('j M Y'),
                ],
                'definitions' => [],
                'logs' => [],
                'reflection' => null,
            ]);
        }

        if (MuslimHabitDefinition::where('user_id', $user->id)->count() === 0) {
            foreach (self::DEFAULT_HABITS as $index => $habit) {
                MuslimHabitDefinition::create([
                    'user_id' => $user->id,
                    ...$habit,
                    'is_default' => true,
                    'sort_order' => $index,
                ]);
            }
        }

        $definitions = MuslimHabitDefinition::where('user_id', $user->id)
            ->where('archived', false)
            ->orderBy('sort_order')
            ->get();

        $logs = MuslimHabitLog::where('user_id', $user->id)
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->get()
            ->groupBy('habit_name')
            ->map(fn ($items) => $items->keyBy(fn ($item) => Carbon::parse($item->date)->format('Y-m-d')))
            ->toArray();

        $reflection = MuslimHabitReflection::where('user_id', $user->id)
            ->where('week_start', $startDate->toDateString())
            ->value('content');

        return inertia('Muslim/HabitTracker', [
            'weekStart' => $startDate->toDateString(),
            'weekRange' => [
                'start' => $startDate->translatedFormat('j M'),
                'end' => $endDate->translatedFormat('j M Y'),
            ],
            'definitions' => $definitions,
            'logs' => $logs,
            'reflection' => $reflection,
        ]);
    }

    public function storeDefinition(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'icon' => 'required|string|max:50',
            'color' => 'required|string|max:30',
        ]);

        $definition = MuslimHabitDefinition::create([
            'user_id' => $request->user()->id,
            ...$validated,
            'sort_order' => MuslimHabitDefinition::where('user_id', $request->user()->id)->count(),
        ]);

        return response()->json($definition);
    }

    public function updateDefinition(Request $request, int $id)
    {
        $definition = MuslimHabitDefinition::where('user_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'icon' => 'sometimes|string|max:50',
            'color' => 'sometimes|string|max:30',
            'archived' => 'sometimes|boolean',
        ]);

        $definition->update($validated);

        return response()->json($definition->fresh());
    }

    public function toggleLog(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'habit_name' => 'required|string|max:100',
            'done' => 'required|boolean',
        ]);

        if (! $validated['done']) {
            MuslimHabitLog::where('user_id', $request->user()->id)
                ->where('date', $validated['date'])
                ->where('habit_name', $validated['habit_name'])
                ->delete();

            return response()->json(['status' => 'unchecked']);
        }

        $definition = MuslimHabitDefinition::where('user_id', $request->user()->id)
            ->where('name', $validated['habit_name'])
            ->first();

        $log = MuslimHabitLog::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
                'habit_name' => $validated['habit_name'],
            ],
            [
                'icon' => $definition?->icon,
                'value' => true,
            ],
        );

        return response()->json($log);
    }

    public function saveReflection(Request $request)
    {
        $validated = $request->validate([
            'week_start' => 'required|date',
            'content' => 'nullable|string',
        ]);

        $reflection = MuslimHabitReflection::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'week_start' => $validated['week_start'],
            ],
            ['content' => $validated['content'] ?? ''],
        );

        return response()->json($reflection);
    }
}
