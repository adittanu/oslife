<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DoaLog extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'doa_name',
        'read',
    ];

    protected $casts = [
        'date' => 'date',
        'read' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}