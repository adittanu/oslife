<?php

namespace App\Http\Controllers\Muslim;

use App\Http\Controllers\Controller;
use App\Models\DzikirLog;
use App\Models\MuhasabahEntry;
use App\Models\QuranDailyTarget;
use App\Models\SholatLog;
use Illuminate\Http\Request;

class DailySpreadController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->query('date', now()->toDateString());
        $user = $request->user();

        $sholatLogs = SholatLog::where('user_id', $user->id)
            ->where('date', $date)
            ->get()
            ->keyBy('sholat_name');

        $dzikirLogs = DzikirLog::where('user_id', $user->id)
            ->where('date', $date)
            ->get();

        $quranTarget = QuranDailyTarget::where('user_id', $user->id)
            ->where('date', $date)
            ->first();

        $muhasabah = MuhasabahEntry::where('user_id', $user->id)
            ->where('date', $date)
            ->first();

        return inertia('Muslim/DailySpread', [
            'date' => $date,
            'sholatLogs' => $sholatLogs,
            'dzikirLogs' => $dzikirLogs,
            'quranTarget' => $quranTarget,
            'muhasabah' => $muhasabah,
        ]);
    }

    public function saveSholat(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'sholat_name' => 'required|string',
            'status' => 'required|in:missed,alone,jamaah',
            'time' => 'nullable|string',
        ]);

        SholatLog::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
                'sholat_name' => $validated['sholat_name'],
            ],
            [
                'status' => $validated['status'],
                'time' => $validated['time'],
            ]
        );

        return back();
    }

    public function saveDzikir(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'items' => 'required|array',
            'items.*.dzikir_name' => 'required|string',
            'items.*.done' => 'required|boolean',
        ]);

        foreach ($validated['items'] as $item) {
            DzikirLog::updateOrCreate(
                [
                    'user_id' => $request->user()->id,
                    'date' => $validated['date'],
                    'dzikir_name' => $item['dzikir_name'],
                ],
                ['done' => $item['done']]
            );
        }

        return back();
    }

    public function saveQuranTarget(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'juz' => 'nullable|integer',
            'surah' => 'nullable|string',
            'ayat_start' => 'nullable|integer',
            'ayat_end' => 'nullable|integer',
            'progress' => 'nullable|integer|min:0|max:100',
        ]);

        QuranDailyTarget::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
            ],
            $validated
        );

        return back();
    }

    public function saveMuhasabah(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'content' => 'nullable|string',
        ]);

        MuhasabahEntry::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
            ],
            ['content' => $validated['content']]
        );

        return back();
    }
}