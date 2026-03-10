<?php

namespace App\Http\Controllers;

use App\Models\GratitudeEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GratitudeController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $entries = [];

        if ($user) {
            $entries = $user->gratitudeEntries()
                ->orderBy('created_at', 'desc')
                ->limit(20)
                ->get();
        }

        return Inertia::render('Gratitude', [
            'entries' => $entries,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'content' => 'required|string',
            'media_type' => 'nullable|in:image,text',
            'media_path' => 'nullable|string|max:255',
        ]);

        $entry = $request->user()->gratitudeEntries()->create($data);
        return response()->json($entry);
    }

    public function update(Request $request, int $id)
    {
        $entry = $request->user()->gratitudeEntries()->findOrFail($id);

        $data = $request->validate([
            'content' => 'sometimes|string',
            'media_type' => 'nullable|in:image,text',
            'media_path' => 'nullable|string|max:255',
        ]);

        $entry->update($data);
        return response()->json($entry);
    }

    public function destroy(Request $request, int $id)
    {
        $request->user()->gratitudeEntries()->where('id', $id)->delete();
        return response()->json(['status' => 'ok']);
    }
}
