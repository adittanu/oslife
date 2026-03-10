<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BrandCollab extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'brand_name',
        'status',
        'deadline',
        'payment',
        'deliverables',
        'notes',
    ];

    protected $casts = [
        'deadline' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
