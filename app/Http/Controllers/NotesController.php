<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotesController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $notes = [];

        if ($user) {
            $notes = $user->notes()->orderBy('created_at', 'desc')->get();
        }

        return Inertia::render('Notes', [
            'notes' => $notes,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'tags' => 'nullable|array',
            'color' => 'nullable|string',
        ]);

        $note = $request->user()->notes()->create($data);
        return response()->json($note);
    }

    public function update(Request $request, int $id)
    {
        $note = $request->user()->notes()->findOrFail($id);

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'tags' => 'nullable|array',
            'color' => 'sometimes|string',
        ]);

        $note->update($data);
        return response()->json($note);
    }

    public function destroy(Request $request, int $id)
    {
        $request->user()->notes()->where('id', $id)->delete();
        return response()->json(['status' => 'ok']);
    }
}
