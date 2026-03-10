<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IdeaDumpController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $ideas = [];

        if ($user) {
            $ideas = $user->ideas()->orderBy('created_at', 'desc')->get();
        }

        return Inertia::render('IdeaDump', [
            'ideas' => $ideas,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'type' => 'nullable|string|max:50',
            'tags' => 'nullable|array',
            'color' => 'nullable|string',
        ]);

        $data['content'] = $data['content'] ?? '';
        $idea = $request->user()->ideas()->create($data);
        return response()->json($idea);
    }

    public function update(Request $request, int $id)
    {
        $idea = $request->user()->ideas()->findOrFail($id);

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'nullable|string',
            'type' => 'nullable|string|max:50',
            'tags' => 'nullable|array',
            'color' => 'sometimes|string',
        ]);

        if (array_key_exists('content', $data) && $data['content'] === null) {
            $data['content'] = '';
        }

        $idea->update($data);
        return response()->json($idea);
    }

    public function destroy(Request $request, int $id)
    {
        $request->user()->ideas()->where('id', $id)->delete();
        return response()->json(['status' => 'ok']);
    }
}
