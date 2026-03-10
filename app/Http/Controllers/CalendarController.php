<?php

namespace App\Http\Controllers;

use App\Models\ScheduleItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index(Request $request)
    {
        $month = $request->query('month', now()->format('Y-m'));
        $startOfMonth = Carbon::parse($month . '-01')->startOfMonth();
        $endOfMonth = $startOfMonth->copy()->endOfMonth();
        $user = $request->user();

        $events = [];
        $upcoming = [];

        if ($user) {
            $events = $user->scheduleItems()
                ->whereBetween('date', [$startOfMonth->format('Y-m-d'), $endOfMonth->format('Y-m-d')])
                ->orderBy('date')
                ->orderBy('time')
                ->get()
                ->groupBy(fn($item) => (int) Carbon::parse($item->date)->format('d'))
                ->map(fn($items) => $items->map(fn($i) => [
                    'id' => $i->id,
                    'text' => $i->title,
                    'time' => $i->time,
                    'color' => $i->color,
                ]))
                ->toArray();

            $upcoming = $user->scheduleItems()
                ->where('date', '>=', now()->format('Y-m-d'))
                ->where('date', '<=', $endOfMonth->format('Y-m-d'))
                ->orderBy('date')
                ->orderBy('time')
                ->limit(5)
                ->get()
                ->map(fn($i) => [
                    'id' => $i->id,
                    'date' => $i->date->format('j M'),
                    'text' => $i->title,
                    'color' => $i->color,
                ]);
        }

        return Inertia::render('Calendar', [
            'month' => $month,
            'year' => $startOfMonth->year,
            'monthNum' => $startOfMonth->month,
            'monthName' => $startOfMonth->translatedFormat('F'),
            'daysInMonth' => $endOfMonth->day,
            'firstDayOfWeek' => ($startOfMonth->dayOfWeekIso % 7),
            'events' => $events,
            'upcoming' => $upcoming,
            'today' => now()->format('Y-m-d'),
        ]);
    }

    public function storeEvent(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'title' => 'required|string|max:255',
            'time' => 'nullable|string|max:5',
            'color' => 'nullable|string|max:20',
        ]);

        $request->user()->scheduleItems()->create([
            'date' => $request->date,
            'title' => $request->title,
            'time' => $request->time ?? '00:00',
            'color' => $request->color ?? 'blue',
            'sort_order' => 0,
        ]);

        return response()->json(['status' => 'ok']);
    }

    public function destroyEvent(Request $request, int $id)
    {
        $request->user()->scheduleItems()->where('id', $id)->delete();
        return response()->json(['status' => 'ok']);
    }
}
