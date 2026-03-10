<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlatformStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'platform',
        'followers',
        'engagement_rate',
        'avg_views',
        'revenue',
        'date_recorded',
    ];

    protected $casts = [
        'engagement_rate' => 'decimal:2',
        'revenue' => 'decimal:2',
        'date_recorded' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
