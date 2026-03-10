<?php

namespace App\Http\Controllers;

use App\Models\BrandKit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrandKitController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $brandKit = null;
        if ($user) {
            $brandKit = $user->brandKit;
            if (!$brandKit) {
                $brandKit = $user->brandKit()->create(BrandKit::getDefaults());
            }
        }

        return Inertia::render('Creator/BrandKit', [
            'brandKit' => $brandKit,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'colors' => 'nullable|array',
            'fonts' => 'nullable|array',
            'tone_examples' => 'nullable|array',
            'keywords' => 'nullable|array',
            'content_pillars' => 'nullable|array',
            'dos_donts' => 'nullable|array',
        ]);

        $brandKit = $request->user()->brandKit()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $validated
        );

        return response()->json(['status' => 'ok', 'brandKit' => $brandKit]);
    }

    public function update(Request $request, BrandKit $brandKit)
    {
        $this->authorize('update', $brandKit);

        $validated = $request->validate([
            'colors' => 'nullable|array',
            'fonts' => 'nullable|array',
            'tone_examples' => 'nullable|array',
            'keywords' => 'nullable|array',
            'content_pillars' => 'nullable|array',
            'dos_donts' => 'nullable|array',
        ]);

        $brandKit->update(array_filter($validated, fn($v) => $v !== null));

        return response()->json(['status' => 'ok', 'brandKit' => $brandKit]);
    }
}
