<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use App\Models\GoalMilestone;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GoalsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $goals = [];

        if ($user) {
            $goals = $user->goals()
                ->with('milestones')
                ->orderBy('deadline')
                ->get();
        }

        return Inertia::render('Goals', [
            'goals' => $goals,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'deadline' => 'nullable|date',
            'progress' => 'nullable|integer|between:0,100',
            'color' => 'nullable|string',
            'milestones' => 'nullable|array',
        ]);

        $milestones = $data['milestones'] ?? [];
        unset($data['milestones']);

        $goal = $request->user()->goals()->create($data);

        foreach ($milestones as $ms) {
            $goal->milestones()->create([
                'text' => $ms['text'],
                'completed' => $ms['completed'] ?? false,
            ]);
        }

        return response()->json($goal->load('milestones'));
    }

    public function update(Request $request, int $id)
    {
        $goal = $request->user()->goals()->findOrFail($id);

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:100',
            'deadline' => 'nullable|date',
            'progress' => 'nullable|integer|between:0,100',
            'color' => 'sometimes|string',
        ]);

        $goal->update($data);
        return response()->json($goal->load('milestones'));
    }

    public function destroy(Request $request, int $id)
    {
        $request->user()->goals()->where('id', $id)->delete();
        return response()->json(['status' => 'ok']);
    }

    public function storeMilestone(Request $request, int $goalId)
    {
        $goal = $request->user()->goals()->findOrFail($goalId);

        $data = $request->validate([
            'text' => 'required|string|max:255',
            'completed' => 'nullable|boolean',
        ]);

        $milestone = $goal->milestones()->create($data);
        return response()->json($milestone);
    }

    public function updateMilestone(Request $request, int $milestoneId)
    {
        $milestone = GoalMilestone::findOrFail($milestoneId);
        $goal = $request->user()->goals()->where('id', $milestone->goal_id)->first();

        if (!$goal) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'text' => 'sometimes|string|max:255',
            'completed' => 'sometimes|boolean',
        ]);

        $milestone->update($data);
        return response()->json($milestone);
    }

    public function destroyMilestone(Request $request, int $milestoneId)
    {
        $milestone = GoalMilestone::findOrFail($milestoneId);
        $goal = $request->user()->goals()->where('id', $milestone->goal_id)->first();

        if (!$goal) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $milestone->delete();
        return response()->json(['status' => 'ok']);
    }
}
