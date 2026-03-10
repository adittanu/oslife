<?php

namespace App\Http\Controllers;

use App\Models\ContentPost;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContentCalendarController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->query('year', now()->year);
        $month = $request->query('month', now()->month);
        $user = $request->user();

        $posts = $user
            ? $user->contentPosts()
                ->whereYear('post_date', $year)
                ->whereMonth('post_date', $month)
                ->get()
                ->groupBy(fn($post) => (int) $post->post_date->format('j'))
            : collect();

        $stats = $user
            ? [
                'postsThisMonth' => $user->contentPosts()
                    ->whereYear('post_date', $year)
                    ->whereMonth('post_date', $month)
                    ->count(),
                'platformsActive' => $user->contentPosts()
                    ->whereYear('post_date', $year)
                    ->whereMonth('post_date', $month)
                    ->distinct('platform')
                    ->count('platform'),
            ]
            : ['postsThisMonth' => 0, 'platformsActive' => 0];

        return Inertia::render('Creator/ContentCalendar', [
            'year' => (int) $year,
            'month' => (int) $month,
            'posts' => $posts,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'post_date' => 'required|date',
            'platform' => 'required|string|in:instagram,youtube,tiktok,twitter',
            'type' => 'required|string|max:50',
            'title' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'nullable|string|in:planned,draft,published',
        ]);

        $post = $request->user()->contentPosts()->create($validated);

        return response()->json(['status' => 'ok', 'post' => $post]);
    }

    public function update(Request $request, ContentPost $post)
    {
        $this->authorize('update', $post);

        $validated = $request->validate([
            'post_date' => 'nullable|date',
            'platform' => 'nullable|string|in:instagram,youtube,tiktok,twitter',
            'type' => 'nullable|string|max:50',
            'title' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'nullable|string|in:planned,draft,published',
        ]);

        $post->update(array_filter($validated, fn($v) => $v !== null));

        return response()->json(['status' => 'ok', 'post' => $post]);
    }

    public function destroy(Request $request, ContentPost $post)
    {
        $this->authorize('delete', $post);

        $post->delete();

        return response()->json(['status' => 'ok']);
    }
}
