<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlatformStatSnapshot extends Model
{
    protected $fillable = [
        'user_id',
        'platform',
        'followers',
        'engagement_rate',
        'avg_views',
        'revenue',
        'recorded_on',
    ];

    protected $casts = [
        'engagement_rate' => 'decimal:2',
        'revenue' => 'decimal:2',
        'recorded_on' => 'date:Y-m-d',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
