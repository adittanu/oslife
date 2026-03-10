<?php

namespace App\Http\Controllers;

use App\Models\Script;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScriptWriterController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $scripts = $user
            ? $user->scripts()->orderBy('updated_at', 'desc')->get()
            : collect();

        return Inertia::render('Creator/ScriptWriter', [
            'scripts' => $scripts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'platform' => 'required|string|in:youtube,instagram,tiktok,twitter',
            'status' => 'nullable|string|in:draft,editing,final',
            'content' => 'nullable|string',
        ]);

        $script = $request->user()->scripts()->create($validated);

        return response()->json(['status' => 'ok', 'script' => $script]);
    }

    public function update(Request $request, Script $script)
    {
        $this->authorize('update', $script);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'platform' => 'nullable|string|in:youtube,instagram,tiktok,twitter',
            'status' => 'nullable|string|in:draft,editing,final',
            'content' => 'nullable|string',
        ]);

        $script->update(array_filter($validated, fn($v) => $v !== null));

        return response()->json(['status' => 'ok', 'script' => $script]);
    }

    public function destroy(Request $request, Script $script)
    {
        $this->authorize('delete', $script);

        $script->delete();

        return response()->json(['status' => 'ok']);
    }
}
