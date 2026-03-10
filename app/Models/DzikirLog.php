<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DzikirLog extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'dzikir_name',
        'done',
        'count',
        'target',
    ];

    protected $casts = [
        'date' => 'date',
        'done' => 'boolean',
        'count' => 'integer',
        'target' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
