<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WeeklyReview extends Model
{
    protected $fillable = [
        'user_id', 'week_start', 'week_end', 'wins', 'challenges',
        'lessons', 'priorities', 'scores', 'gratitude'
    ];

    protected function casts(): array
    {
        return [
            'week_start' => 'date:Y-m-d',
            'week_end' => 'date:Y-m-d',
            'wins' => 'array',
            'challenges' => 'array',
            'priorities' => 'array',
            'scores' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
