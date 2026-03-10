<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BrandKit extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'colors',
        'fonts',
        'tone_examples',
        'keywords',
        'content_pillars',
        'dos_donts',
    ];

    protected $casts = [
        'colors' => 'json',
        'fonts' => 'json',
        'tone_examples' => 'json',
        'keywords' => 'json',
        'content_pillars' => 'json',
        'dos_donts' => 'json',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function getDefaults(): array
    {
        return [
            'colors' => [
                ['name' => 'Primary Orange', 'hex' => '#F97316', 'bg' => 'bg-orange-500'],
                ['name' => 'Warm Cream', 'hex' => '#FFF7ED', 'bg' => 'bg-orange-50'],
                ['name' => 'Deep Charcoal', 'hex' => '#1C1917', 'bg' => 'bg-stone-900'],
                ['name' => 'Soft Gray', 'hex' => '#A8A29E', 'bg' => 'bg-stone-400'],
                ['name' => 'Accent Pink', 'hex' => '#F472B6', 'bg' => 'bg-pink-400'],
                ['name' => 'Success Green', 'hex' => '#22C55E', 'bg' => 'bg-green-500'],
            ],
            'fonts' => [
                ['role' => 'Headings', 'font' => 'Playfair Display', 'weight' => 'Bold / Semi-Bold', 'example' => 'The Quick Brown Fox'],
                ['role' => 'Body Text', 'font' => 'Inter', 'weight' => 'Regular / Medium', 'example' => 'The quick brown fox jumps over the lazy dog.'],
                ['role' => 'Accents', 'font' => 'Caveat', 'weight' => 'Regular', 'example' => 'Add a personal touch!'],
            ],
            'tone_examples' => [
                ['tone' => 'Friendly', 'emoji' => 'sentiment_satisfied', 'example' => '"Hey friend! I just tried this amazing hack and I HAD to share it with you."'],
                ['tone' => 'Professional', 'emoji' => 'business_center', 'example' => '"Based on my experience working with 50+ brands, here are the key takeaways."'],
                ['tone' => 'Witty', 'emoji' => 'mood', 'example' => '"My content calendar said I needed to post today. My bed said otherwise. Guess who won?"'],
            ],
            'keywords' => ['Authentic', 'Empowering', 'Creative', 'Relatable', 'Inspiring'],
            'content_pillars' => [
                ['pillar' => 'Education', 'icon' => 'school', 'desc' => 'Tutorials, tips, how-tos, and industry insights'],
                ['pillar' => 'Entertainment', 'icon' => 'theater_comedy', 'desc' => 'Trending audio, funny takes, relatable skits'],
                ['pillar' => 'Inspiration', 'icon' => 'auto_awesome', 'desc' => 'Motivational stories, before/after, milestones'],
                ['pillar' => 'Behind-the-Scenes', 'icon' => 'videocam', 'desc' => 'Day-in-my-life, process, workspace tours'],
            ],
            'dos_donts' => [
                'dos' => [
                    'Use warm, natural lighting in all photos',
                    'Maintain consistent color grading (warm tones)',
                    'Speak directly to the audience like a friend',
                    'Share real stories and genuine experiences',
                    'Use brand colors in graphics and thumbnails',
                ],
                'donts' => [
                    'Use overly salesy or pushy language',
                    'Post blurry or low-quality images',
                    'Use more than 2 fonts in a single graphic',
                    'Stray from the warm color palette',
                    'Ignore comments or community engagement',
                ],
            ],
        ];
    }
}
