<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FocusSession extends Model
{
    protected $fillable = ['user_id', 'date', 'duration', 'mode', 'tasks', 'completed'];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'tasks' => 'array',
            'completed' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
