<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MuslimHabitDefinition extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'icon',
        'color',
        'is_default',
        'sort_order',
        'archived',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'archived' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
