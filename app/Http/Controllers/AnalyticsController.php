<?php

namespace App\Http\Controllers;

use App\Models\PlatformStat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $stats = $user
            ? $user->platformStats()->get()->keyBy('platform')
            : collect();

        $weeklyGrowth = $user
            ? $this->getWeeklyGrowth($user->id)
            : collect();

        $topContent = $user
            ? $this->getTopContent($user->id)
            : collect();

        return Inertia::render('Creator/Analytics', [
            'stats' => $stats,
            'weeklyGrowth' => $weeklyGrowth,
            'topContent' => $topContent,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'platform' => 'required|string|in:instagram,youtube,tiktok,twitter',
            'followers' => 'nullable|integer|min:0',
            'engagement_rate' => 'nullable|numeric|min:0|max:100',
            'avg_views' => 'nullable|integer|min:0',
            'revenue' => 'nullable|numeric|min:0',
        ]);

        $stat = $request->user()->platformStats()->updateOrCreate(
            ['platform' => $validated['platform']],
            array_merge($validated, ['date_recorded' => now()])
        );

        return response()->json(['status' => 'ok', 'stat' => $stat]);
    }

    public function update(Request $request, PlatformStat $stat)
    {
        $this->authorize('update', $stat);

        $validated = $request->validate([
            'followers' => 'nullable|integer|min:0',
            'engagement_rate' => 'nullable|numeric|min:0|max:100',
            'avg_views' => 'nullable|integer|min:0',
            'revenue' => 'nullable|numeric|min:0',
        ]);

        $stat->update(array_filter($validated, fn($v) => $v !== null));

        return response()->json(['status' => 'ok', 'stat' => $stat]);
    }

    private function getWeeklyGrowth($userId)
    {
        // This would normally come from a separate table with historical data
        // For now, return a default structure
        return [
            ['day' => 'Mon', 'followers' => 0],
            ['day' => 'Tue', 'followers' => 0],
            ['day' => 'Wed', 'followers' => 0],
            ['day' => 'Thu', 'followers' => 0],
            ['day' => 'Fri', 'followers' => 0],
            ['day' => 'Sat', 'followers' => 0],
            ['day' => 'Sun', 'followers' => 0],
        ];
    }

    private function getTopContent($userId)
    {
        // This would normally come from a content_posts table aggregated by performance
        // For now, return empty
        return [];
    }
}
