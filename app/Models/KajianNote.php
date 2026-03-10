<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KajianNote extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'title',
        'speaker',
        'notes',
        'key_points',
        'action_items',
        'color',
    ];

    protected $casts = [
        'date' => 'date',
        'key_points' => 'array',
        'action_items' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}