<?php

namespace App\Http\Controllers;

use App\Models\PlatformStat;
use App\Models\PlatformStatSnapshot;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $stats = $user
            ? $user->platformStats()->get()->keyBy('platform')->map->toArray()
            : [];

        $weeklyGrowth = $user
            ? $this->getWeeklyGrowth($user->id)
            : $this->emptyWeeklyGrowth();

        $topContent = $user
            ? $this->getTopContent($user->id)
            : [];

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

        PlatformStatSnapshot::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'platform' => $validated['platform'],
                'recorded_on' => now()->toDateString(),
            ],
            [
                'followers' => $validated['followers'] ?? 0,
                'engagement_rate' => $validated['engagement_rate'] ?? 0,
                'avg_views' => $validated['avg_views'] ?? 0,
                'revenue' => $validated['revenue'] ?? 0,
            ]
        );

        return response()->json([
            'status' => 'ok',
            'stat' => $stat->fresh(),
            'weeklyGrowth' => $this->getWeeklyGrowth($request->user()->id),
            'topContent' => $this->getTopContent($request->user()->id),
        ]);
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

        PlatformStatSnapshot::updateOrCreate(
            [
                'user_id' => $stat->user_id,
                'platform' => $stat->platform,
                'recorded_on' => now()->toDateString(),
            ],
            [
                'followers' => $validated['followers'] ?? $stat->followers,
                'engagement_rate' => $validated['engagement_rate'] ?? $stat->engagement_rate,
                'avg_views' => $validated['avg_views'] ?? $stat->avg_views,
                'revenue' => $validated['revenue'] ?? $stat->revenue,
            ]
        );

        return response()->json([
            'status' => 'ok',
            'stat' => $stat->fresh(),
            'weeklyGrowth' => $this->getWeeklyGrowth($stat->user_id),
            'topContent' => $this->getTopContent($stat->user_id),
        ]);
    }

    private function emptyWeeklyGrowth(): array
    {
        return collect(range(6, 0))->map(function ($offset) {
            $date = now()->subDays($offset);

            return [
                'day' => $date->format('D'),
                'followers' => 0,
                'height' => '0%',
            ];
        })->all();
    }

    private function getWeeklyGrowth($userId): array
    {
        $days = collect(range(6, 0))->map(fn ($offset) => now()->subDays($offset)->startOfDay());
        $snapshots = PlatformStatSnapshot::where('user_id', $userId)
            ->whereDate('recorded_on', '<=', now()->toDateString())
            ->orderBy('recorded_on')
            ->get()
            ->groupBy('platform');

        $growth = $days->map(function (Carbon $date) use ($snapshots) {
            $followers = $snapshots->sum(function ($platformSnapshots) use ($date) {
                $current = $platformSnapshots->first(fn ($snapshot) => $snapshot->recorded_on->isSameDay($date));
                $previous = $platformSnapshots
                    ->filter(fn ($snapshot) => $snapshot->recorded_on->lt($date))
                    ->sortByDesc('recorded_on')
                    ->first();

                if (! $current || ! $previous) {
                    return 0;
                }

                return max(0, (int) $current->followers - (int) $previous->followers);
            });

            return [
                'day' => $date->format('D'),
                'followers' => $followers,
            ];
        });

        $maxFollowers = max(1, (int) $growth->max('followers'));

        return $growth->map(fn ($item) => [
            ...$item,
            'height' => round(($item['followers'] / $maxFollowers) * 100).'%',
        ])->all();
    }

    private function getTopContent($userId): array
    {
        return \App\Models\ContentPost::where('user_id', $userId)
            ->where('status', 'published')
            ->get()
            ->map(function ($post) {
                $engagement = (int) $post->likes + (int) $post->comments + (int) $post->shares + (int) $post->saves;

                return [
                    'id' => $post->id,
                    'title' => $post->title ?: $post->type.' on '.ucfirst($post->platform),
                    'platform' => $post->platform,
                    'views' => (int) $post->views,
                    'engagement' => $engagement,
                    'score' => ((int) $post->views * 0.2) + ($engagement * 5),
                ];
            })
            ->filter(fn ($post) => $post['views'] > 0 || $post['engagement'] > 0)
            ->sortByDesc('score')
            ->take(5)
            ->values()
            ->map(fn ($post) => [
                'id' => $post['id'],
                'title' => $post['title'],
                'platform' => $post['platform'],
                'views' => $post['views'],
                'engagement' => $post['engagement'],
            ])
            ->all();
    }
}
