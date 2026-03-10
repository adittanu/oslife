<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TourController extends Controller
{
    public function markSeen(Request $request)
    {
        $request->validate(['mode' => 'required|string']);

        $user = $request->user();
        $seen = $user->seen_tours ?? [];
        $seen[] = $request->mode;
        $user->update(['seen_tours' => array_unique($seen)]);

        return response()->json(['ok' => true]);
    }
}
