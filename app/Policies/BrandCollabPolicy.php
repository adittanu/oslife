<?php

namespace App\Policies;

use App\Models\BrandCollab;
use App\Models\User;

class BrandCollabPolicy
{
    public function view(User $user, BrandCollab $collab): bool
    {
        return $user->id === $collab->user_id;
    }

    public function update(User $user, BrandCollab $collab): bool
    {
        return $user->id === $collab->user_id;
    }

    public function delete(User $user, BrandCollab $collab): bool
    {
        return $user->id === $collab->user_id;
    }
}
