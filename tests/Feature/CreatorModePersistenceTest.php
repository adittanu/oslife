<?php

namespace Tests\Feature;

use App\Models\BrandKit;
use App\Models\ContentPost;
use App\Models\PlatformStat;
use App\Models\PlatformStatSnapshot;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreatorModePersistenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_content_posts_can_store_performance_metrics(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/creator/content-posts', [
            'post_date' => '2026-03-10',
            'platform' => 'instagram',
            'type' => 'Reel',
            'title' => 'Launch Reel',
            'notes' => 'Initial launch push',
            'status' => 'published',
            'views' => 12000,
            'likes' => 850,
            'comments' => 44,
            'shares' => 31,
            'saves' => 67,
        ]);

        $response->assertOk()
            ->assertJsonPath('post.views', 12000)
            ->assertJsonPath('post.likes', 850)
            ->assertJsonPath('post.saves', 67);

        $post = ContentPost::query()->firstOrFail();

        $this->assertSame(12000, $post->views);
        $this->assertSame(850, $post->likes);
        $this->assertSame(44, $post->comments);
        $this->assertSame(31, $post->shares);
        $this->assertSame(67, $post->saves);
    }

    public function test_platform_stats_store_creates_snapshot_and_growth_payload(): void
    {
        Carbon::setTestNow('2026-03-10 09:00:00');

        $user = User::factory()->create();

        PlatformStatSnapshot::query()->create([
            'user_id' => $user->id,
            'platform' => 'instagram',
            'followers' => 1000,
            'engagement_rate' => 4.5,
            'avg_views' => 2500,
            'revenue' => 0,
            'recorded_on' => '2026-03-09',
        ]);

        $response = $this->actingAs($user)->postJson('/api/creator/platform-stats', [
            'platform' => 'instagram',
            'followers' => 1250,
            'engagement_rate' => 5.1,
            'avg_views' => 3400,
            'revenue' => 180,
        ]);

        $response->assertOk()
            ->assertJsonPath('stat.platform', 'instagram')
            ->assertJsonPath('stat.followers', 1250)
            ->assertJsonCount(7, 'weeklyGrowth');

        $this->assertDatabaseHas('platform_stats', [
            'user_id' => $user->id,
            'platform' => 'instagram',
            'followers' => 1250,
        ]);

        $this->assertDatabaseHas('platform_stat_snapshots', [
            'user_id' => $user->id,
            'platform' => 'instagram',
            'followers' => 1250,
            'recorded_on' => '2026-03-10',
        ]);

        Carbon::setTestNow();
    }

    public function test_brand_kit_can_persist_fonts_tone_and_pillars(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/creator/brand-kit', [
            'colors' => [
                ['name' => 'Primary', 'hex' => '#111827'],
            ],
            'fonts' => [
                ['role' => 'Headings', 'font' => 'DM Serif Display', 'weight' => 'Bold', 'example' => 'Bold ideas sell.'],
            ],
            'tone_examples' => [
                ['tone' => 'Sharp', 'emoji' => 'campaign', 'color' => 'bg-orange-100 border-orange-200', 'example' => 'Short, direct, and useful.'],
            ],
            'keywords' => ['Bold', 'Warm'],
            'content_pillars' => [
                ['pillar' => 'Proof', 'icon' => 'verified', 'desc' => 'Case studies and receipts', 'color' => 'bg-blue-50 border-blue-200 text-blue-700'],
            ],
            'dos_donts' => [
                'dos' => ['Show proof'],
                'donts' => ['Over-explain'],
            ],
        ]);

        $response->assertOk();

        $brandKit = BrandKit::query()->firstOrFail();

        $this->assertSame('DM Serif Display', $brandKit->fonts[0]['font']);
        $this->assertSame('Sharp', $brandKit->tone_examples[0]['tone']);
        $this->assertSame('Proof', $brandKit->content_pillars[0]['pillar']);
        $this->assertSame(['Bold', 'Warm'], $brandKit->keywords);
    }

    public function test_creator_analytics_page_surfaces_top_content_from_saved_posts(): void
    {
        $user = User::factory()->create();

        PlatformStat::query()->create([
            'user_id' => $user->id,
            'platform' => 'instagram',
            'followers' => 2400,
            'engagement_rate' => 4.8,
            'avg_views' => 5100,
            'revenue' => 0,
            'date_recorded' => '2026-03-10',
        ]);

        ContentPost::query()->create([
            'user_id' => $user->id,
            'post_date' => '2026-03-10',
            'platform' => 'instagram',
            'type' => 'Reel',
            'title' => 'Launch Reel',
            'status' => 'published',
            'views' => 12000,
            'likes' => 800,
            'comments' => 55,
            'shares' => 40,
            'saves' => 65,
        ]);

        $this->actingAs($user)
            ->get('/creator/analytics')
            ->assertOk()
            ->assertSee('Launch Reel');
    }
}
