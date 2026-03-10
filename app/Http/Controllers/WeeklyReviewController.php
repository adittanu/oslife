<?php

namespace App\Http\Controllers;

use App\Models\WeeklyReview;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WeeklyReviewController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $currentReview = null;
        $pastReviews = [];

        if ($user) {
            $weekStart = now()->startOfWeek()->format('Y-m-d');
            $weekEnd = now()->endOfWeek()->format('Y-m-d');

            $currentReview = $user->weeklyReviews()
                ->where('week_start', $weekStart)
                ->first();

            $pastReviews = $user->weeklyReviews()
                ->where('week_start', '<', $weekStart)
                ->orderBy('week_start', 'desc')
                ->limit(4)
                ->get();
        }

        return Inertia::render('WeeklyReview', [
            'currentReview' => $currentReview,
            'pastReviews' => $pastReviews,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'week_start' => 'required|date',
            'week_end' => 'required|date',
            'wins' => 'nullable|array',
            'challenges' => 'nullable|array',
            'lessons' => 'nullable|string',
            'priorities' => 'nullable|array',
            'scores' => 'nullable|array',
        ]);

        $review = $request->user()->weeklyReviews()->create($data);
        return response()->json($review);
    }

    public function update(Request $request, int $id)
    {
        $review = $request->user()->weeklyReviews()->findOrFail($id);

        $data = $request->validate([
            'week_start' => 'sometimes|date',
            'week_end' => 'sometimes|date',
            'wins' => 'nullable|array',
            'challenges' => 'nullable|array',
            'lessons' => 'nullable|string',
            'priorities' => 'nullable|array',
            'scores' => 'nullable|array',
        ]);

        $review->update($data);
        return response()->json($review);
    }

    public function destroy(Request $request, int $id)
    {
        $request->user()->weeklyReviews()->where('id', $id)->delete();
        return response()->json(['status' => 'ok']);
    }
}
