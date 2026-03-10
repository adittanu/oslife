<?php

namespace App\Policies;

use App\Models\PlatformStat;
use App\Models\User;

class PlatformStatPolicy
{
    public function view(User $user, PlatformStat $stat): bool
    {
        return $user->id === $stat->user_id;
    }

    public function update(User $user, PlatformStat $stat): bool
    {
        return $user->id === $stat->user_id;
    }

    public function delete(User $user, PlatformStat $stat): bool
    {
        return $user->id === $stat->user_id;
    }
}
