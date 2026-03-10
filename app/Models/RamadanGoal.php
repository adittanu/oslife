<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RamadanGoal extends Model
{
    protected $fillable = [
        'user_id',
        'goal_type',
        'description',
        'target',
        'current',
        'ramadan_year',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}