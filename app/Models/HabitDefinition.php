<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HabitDefinition extends Model
{
    protected $fillable = ['user_id', 'name', 'icon', 'color', 'is_default', 'sort_order', 'archived'];

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
            'archived' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
