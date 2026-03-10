<?php

namespace App\Http\Controllers\Muslim;

use App\Http\Controllers\Controller;
use App\Models\KajianNote;
use Illuminate\Http\Request;

class KajianNotesController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $notes = KajianNote::where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->limit(50)
            ->get();

        return inertia('Muslim/KajianNotes', [
            'notes' => $notes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'title' => 'nullable|string|max:255',
            'speaker' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'key_points' => 'nullable|array',
            'action_items' => 'nullable|array',
            'color' => 'nullable|string',
        ]);

        KajianNote::create([
            'user_id' => $request->user()->id,
            ...$validated,
        ]);

        return back();
    }

    public function update(Request $request, $id)
    {
        $note = KajianNote::where('user_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'speaker' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'key_points' => 'nullable|array',
            'action_items' => 'nullable|array',
            'color' => 'nullable|string',
        ]);

        $note->update($validated);

        return back();
    }

    public function destroy(Request $request, $id)
    {
        $note = KajianNote::where('user_id', $request->user()->id)->findOrFail($id);
        $note->delete();

        return back();
    }
}