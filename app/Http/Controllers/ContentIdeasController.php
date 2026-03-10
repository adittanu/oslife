<?php

namespace App\Http\Controllers;

use App\Models\ContentIdea;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContentIdeasController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $ideas = $user
            ? $user->contentIdeas()->orderBy('sort_order')->get()->groupBy('category')
            : collect();

        $stats = $user
            ? [
                'total' => $user->contentIdeas()->count(),
                'drafts' => $user->contentIdeas()->where('status', 'draft')->count(),
                'planned' => $user->contentIdeas()->where('status', 'planned')->count(),
                'done' => $user->contentIdeas()->where('status', 'done')->count(),
            ]
            : ['total' => 0, 'drafts' => 0, 'planned' => 0, 'done' => 0];

        return Inertia::render('Creator/ContentIdeas', [
            'ideas' => $ideas,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|in:trending,evergreen,personal,collaboration',
            'platform' => 'required|string|in:instagram,youtube,tiktok,twitter',
            'status' => 'nullable|string|in:draft,planned,done',
            'notes' => 'nullable|string',
        ]);

        $validated['sort_order'] = $request->user()->contentIdeas()->count();

        $idea = $request->user()->contentIdeas()->create($validated);

        return response()->json(['status' => 'ok', 'idea' => $idea]);
    }

    public function update(Request $request, ContentIdea $idea)
    {
        $this->authorize('update', $idea);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'category' => 'nullable|string|in:trending,evergreen,personal,collaboration',
            'platform' => 'nullable|string|in:instagram,youtube,tiktok,twitter',
            'status' => 'nullable|string|in:draft,planned,done',
            'notes' => 'nullable|string',
        ]);

        $idea->update(array_filter($validated, fn($v) => $v !== null));

        return response()->json(['status' => 'ok', 'idea' => $idea]);
    }

    public function destroy(Request $request, ContentIdea $idea)
    {
        $this->authorize('delete', $idea);

        $idea->delete();

        return response()->json(['status' => 'ok']);
    }
}
