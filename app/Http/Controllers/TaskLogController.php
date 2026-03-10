<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskLogController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->query('date', now()->format('Y-m-d'));
        $user = $request->user();

        $tasks = [];
        $habits = [];
        $notes = null;

        if ($user) {
            // Carry forward: tasks for today + overdue uncompleted tasks
            $tasks = $user->tasks()
                ->where(function ($q) use ($date) {
                    $q->where('due_date', $date)
                      ->orWhere(function ($q2) use ($date) {
                          $q2->where('due_date', '<', $date)
                             ->where('completed', false);
                      });
                })
                ->orderBy('completed')
                ->orderBy('sort_order')
                ->get();

            $habits = $user->habitLogs()
                ->where('date', $date)
                ->get();

            $notes = $user->dailyNotes()
                ->where('date', $date)
                ->first()?->content;
        }

        return Inertia::render('TaskLog', [
            'date' => $date,
            'tasks' => $tasks,
            'habits' => $habits,
            'notes' => $notes,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'text' => 'required|string|max:255',
            'tag' => 'nullable|string|max:50',
            'due_date' => 'nullable|date',
        ]);

        $task = $request->user()->tasks()->create([
            'text' => $request->text,
            'tag' => $request->tag,
            'due_date' => $request->due_date ?? now()->format('Y-m-d'),
            'sort_order' => $request->user()->tasks()->count(),
        ]);

        return response()->json($task);
    }

    public function update(Request $request, int $id)
    {
        $task = $request->user()->tasks()->findOrFail($id);

        $data = $request->validate([
            'text' => 'sometimes|string|max:255',
            'tag' => 'nullable|string|max:50',
            'completed' => 'sometimes|boolean',
            'due_date' => 'nullable|date',
        ]);

        if (isset($data['completed'])) {
            $data['completed_at'] = $data['completed'] ? now() : null;
        }

        $task->update($data);
        return response()->json($task);
    }

    public function destroy(Request $request, int $id)
    {
        $request->user()->tasks()->where('id', $id)->delete();
        return response()->json(['status' => 'ok']);
    }
}
