<?php

namespace App\Http\Controllers\Muslim;

use App\Http\Controllers\Controller;
use App\Models\HifzProgress;
use App\Models\QuranReadingLog;
use App\Models\TadabburNote;
use Illuminate\Http\Request;

class QuranJournalController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $readingLogs = QuranReadingLog::where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->limit(30)
            ->get();

        $hifzProgress = HifzProgress::where('user_id', $user->id)
            ->orderBy('surah')
            ->get();

        $tadabburNotes = TadabburNote::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate progress stats
        $totalJuz = $readingLogs->max('juz') ?? 0;
        $totalPages = $readingLogs->sum('pages') ?? 0;
        $totalDaysWithReading = $readingLogs->unique('date')->count();

        return inertia('Muslim/QuranJournal', [
            'readingLogs' => $readingLogs,
            'hifzProgress' => $hifzProgress,
            'tadabburNotes' => $tadabburNotes,
            'stats' => [
                'juz' => $totalJuz,
                'pages' => $totalPages,
                'days' => $totalDaysWithReading,
            ],
        ]);
    }

    public function saveReadingLog(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'juz' => 'required|integer|min:1|max:30',
            'surah' => 'required|string',
            'ayat_start' => 'nullable|integer',
            'ayat_end' => 'nullable|integer',
            'pages' => 'nullable|integer',
        ]);

        QuranReadingLog::create([
            'user_id' => $request->user()->id,
            ...$validated,
        ]);

        return back();
    }

    public function saveHifz(Request $request)
    {
        $validated = $request->validate([
            'surah' => 'required|string',
            'total_ayat' => 'required|integer',
            'memorized' => 'nullable|integer',
            'status' => 'nullable|in:not-started,in-progress,done',
        ]);

        HifzProgress::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'surah' => $validated['surah'],
            ],
            [
                'total_ayat' => $validated['total_ayat'],
                'memorized' => $validated['memorized'] ?? 0,
                'status' => $validated['status'] ?? 'not-started',
            ]
        );

        return back();
    }

    public function updateHifz(Request $request, $id)
    {
        $hifz = HifzProgress::where('user_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'memorized' => 'nullable|integer',
            'status' => 'nullable|in:not-started,in-progress,done',
        ]);

        $hifz->update($validated);

        return back();
    }

    public function saveTadabbur(Request $request)
    {
        $validated = $request->validate([
            'surah' => 'required|string',
            'ayat' => 'required|string',
            'arabic' => 'nullable|string',
            'reflection' => 'nullable|string',
            'color' => 'nullable|string',
        ]);

        TadabburNote::create([
            'user_id' => $request->user()->id,
            ...$validated,
        ]);

        return back();
    }

    public function updateTadabbur(Request $request, $id)
    {
        $note = TadabburNote::where('user_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'surah' => 'nullable|string',
            'ayat' => 'nullable|string',
            'arabic' => 'nullable|string',
            'reflection' => 'nullable|string',
            'color' => 'nullable|string',
        ]);

        $note->update($validated);

        return back();
    }

    public function deleteTadabbur(Request $request, $id)
    {
        $note = TadabburNote::where('user_id', $request->user()->id)->findOrFail($id);
        $note->delete();

        return back();
    }
}