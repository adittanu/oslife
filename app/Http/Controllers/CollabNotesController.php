<?php

namespace App\Http\Controllers;

use App\Models\BrandCollab;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CollabNotesController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $collabs = $user
            ? $user->brandCollabs()->orderBy('created_at', 'desc')->get()
            : collect();

        $stats = $user
            ? [
                'active' => $user->brandCollabs()->whereIn('status', ['outreach', 'negotiating', 'confirmed'])->count(),
                'completed' => $user->brandCollabs()->where('status', 'done')->count(),
                'pendingRevenue' => $user->brandCollabs()
                    ->whereIn('status', ['confirmed', 'negotiating'])
                    ->get()
                    ->sum(fn($c) => (float) preg_replace('/[^0-9.]/', '', $c->payment ?? '0')),
                'totalEarned' => $user->brandCollabs()
                    ->where('status', 'done')
                    ->get()
                    ->sum(fn($c) => (float) preg_replace('/[^0-9.]/', '', $c->payment ?? '0')),
            ]
            : ['active' => 0, 'completed' => 0, 'pendingRevenue' => 0, 'totalEarned' => 0];

        return Inertia::render('Creator/CollabNotes', [
            'collabs' => $collabs,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand_name' => 'required|string|max:255',
            'status' => 'required|string|in:outreach,negotiating,confirmed,done',
            'deadline' => 'nullable|date',
            'payment' => 'nullable|string|max:50',
            'deliverables' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $collab = $request->user()->brandCollabs()->create($validated);

        return response()->json(['status' => 'ok', 'collab' => $collab]);
    }

    public function update(Request $request, BrandCollab $collab)
    {
        $this->authorize('update', $collab);

        $validated = $request->validate([
            'brand_name' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:outreach,negotiating,confirmed,done',
            'deadline' => 'nullable|date',
            'payment' => 'nullable|string|max:50',
            'deliverables' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $collab->update(array_filter($validated, fn($v) => $v !== null));

        return response()->json(['status' => 'ok', 'collab' => $collab]);
    }

    public function destroy(Request $request, BrandCollab $collab)
    {
        $this->authorize('delete', $collab);

        $collab->delete();

        return response()->json(['status' => 'ok']);
    }
}
