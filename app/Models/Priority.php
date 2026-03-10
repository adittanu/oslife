<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Priority extends Model
{
    protected $fillable = ['user_id', 'date', 'text', 'completed', 'sort_order'];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'completed' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
