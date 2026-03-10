<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WeeklyMuhasabah extends Model
{
    protected $fillable = [
        'user_id',
        'week_start',
        'achievements',
        'challenges',
        'lessons_learned',
        'next_week_goals',
        'gratitude',
        'overall_mood',
    ];

    protected $casts = [
        'week_start' => 'date',
        'achievements' => 'array',
        'challenges' => 'array',
        'next_week_goals' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}