<?php

namespace App\Http\Controllers;

use App\Models\WorkClient;
use App\Models\WorkContract;
use App\Models\WorkInvoice;
use App\Models\WorkMeetingNote;
use App\Models\WorkProject;
use App\Models\WorkTimeEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class WorkController extends Controller
{
    public function dashboard()
    {
        $userId = Auth::id();
        $clients = WorkClient::where('user_id', $userId)->count();
        $activeProjects = WorkProject::where('user_id', $userId)->where('status', 'Active')->count();
        $pendingInvoices = WorkInvoice::where('user_id', $userId)->where('status', 'Pending')->count();
        $overdueInvoices = WorkInvoice::where('user_id', $userId)
            ->where(function ($query) {
                $query->where('status', 'Overdue')
                    ->orWhere(function ($invoiceQuery) {
                        $invoiceQuery->where('status', 'Pending')
                            ->whereDate('due_date', '<', now()->toDateString());
                    });
            })
            ->count();

        $thisWeek = now()->startOfWeek();
        $timeThisWeek = WorkTimeEntry::where('user_id', $userId)
            ->where('start_time', '>=', $thisWeek)
            ->get()
            ->sum(fn ($entry) => $entry->start_time->diffInMinutes($entry->end_time ?? now()));

        $incomeThisMonth = WorkInvoice::where('user_id', $userId)
            ->where('status', 'Paid')
            ->whereDate('paid_date', '>=', now()->startOfMonth()->toDateString())
            ->sum('amount');

        return inertia('Work/Dashboard', [
            'stats' => [
                'activeProjects' => $activeProjects,
                'pendingInvoices' => $pendingInvoices,
                'hoursThisWeek' => round($timeThisWeek / 60, 1),
                'incomeThisMonth' => (float) $incomeThisMonth,
                'totalClients' => $clients,
                'overdueInvoices' => $overdueInvoices,
            ],
            'recentActivity' => $this->buildRecentActivity($userId),
            'upcomingFocus' => $this->buildUpcomingFocus($userId),
        ]);
    }

    public function clients()
    {
        return inertia('Work/Clients', [
            'clients' => WorkClient::where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get(),
        ]);
    }

    public function pipeline()
    {
        $userId = Auth::id();

        return inertia('Work/Pipeline', [
            'projects' => WorkProject::with('client')
                ->where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get(),
            'clients' => WorkClient::where('user_id', $userId)->orderBy('name')->get(),
        ]);
    }

    public function timeTracking()
    {
        $userId = Auth::id();

        return inertia('Work/TimeTracking', [
            'entries' => WorkTimeEntry::with('project')
                ->where('user_id', $userId)
                ->orderByDesc('start_time')
                ->limit(50)
                ->get(),
            'projects' => WorkProject::where('user_id', $userId)->orderBy('name')->get(),
        ]);
    }

    public function invoices()
    {
        $userId = Auth::id();

        return inertia('Work/Invoices', [
            'invoices' => WorkInvoice::with(['client', 'project'])
                ->where('user_id', $userId)
                ->orderByDesc('created_at')
                ->get(),
            'clients' => WorkClient::where('user_id', $userId)->orderBy('name')->get(),
            'projects' => WorkProject::where('user_id', $userId)->orderBy('name')->get(),
        ]);
    }

    public function income()
    {
        return inertia('Work/Income', [
            'invoices' => WorkInvoice::with('client')
                ->where('user_id', Auth::id())
                ->where('status', 'Paid')
                ->orderByDesc('paid_date')
                ->get(),
        ]);
    }

    public function meetingNotes()
    {
        $userId = Auth::id();

        return inertia('Work/MeetingNotes', [
            'notes' => WorkMeetingNote::with(['client', 'project'])
                ->where('user_id', $userId)
                ->orderByDesc('meeting_date')
                ->get(),
            'clients' => WorkClient::where('user_id', $userId)->orderBy('name')->get(),
            'projects' => WorkProject::where('user_id', $userId)->orderBy('name')->get(),
        ]);
    }

    public function contracts()
    {
        $userId = Auth::id();

        return inertia('Work/Contracts', [
            'contracts' => WorkContract::with('client')
                ->where('user_id', $userId)
                ->orderByDesc('created_at')
                ->get(),
            'clients' => WorkClient::where('user_id', $userId)->orderBy('name')->get(),
        ]);
    }

    public function apiClients(Request $request)
    {
        $userId = Auth::id();

        if ($request->isMethod('GET')) {
            return response()->json(WorkClient::where('user_id', $userId)->orderByDesc('created_at')->get());
        }

        $client = WorkClient::create([
            ...$this->validateClient($request),
            'user_id' => $userId,
        ]);

        return response()->json($client->fresh());
    }

    public function apiClient(Request $request, $id)
    {
        $client = WorkClient::where('user_id', Auth::id())->findOrFail($id);

        if ($request->isMethod('PUT')) {
            $client->update($this->validateClient($request, true));

            return response()->json($client->fresh());
        }

        $client->delete();

        return response()->json(['success' => true]);
    }

    public function apiProjects(Request $request)
    {
        $userId = Auth::id();

        if ($request->isMethod('GET')) {
            return response()->json(
                WorkProject::with('client')->where('user_id', $userId)->orderByDesc('created_at')->get()
            );
        }

        $project = WorkProject::create([
            ...$this->validateProject($request),
            'user_id' => $userId,
        ]);

        return response()->json($project->load('client'));
    }

    public function apiProject(Request $request, $id)
    {
        $project = WorkProject::where('user_id', Auth::id())->findOrFail($id);

        if ($request->isMethod('PUT')) {
            $project->update($this->validateProject($request, true));

            return response()->json($project->fresh()->load('client'));
        }

        $project->delete();

        return response()->json(['success' => true]);
    }

    public function apiInvoices(Request $request)
    {
        $userId = Auth::id();

        if ($request->isMethod('GET')) {
            return response()->json(
                WorkInvoice::with(['client', 'project'])->where('user_id', $userId)->orderByDesc('created_at')->get()
            );
        }

        $invoice = WorkInvoice::create([
            ...$this->validateInvoice($request),
            'user_id' => $userId,
        ]);

        return response()->json($invoice->load(['client', 'project']));
    }

    public function apiInvoice(Request $request, $id)
    {
        $invoice = WorkInvoice::where('user_id', Auth::id())->findOrFail($id);

        if ($request->isMethod('PUT')) {
            $invoice->update($this->validateInvoice($request, true));

            return response()->json($invoice->fresh()->load(['client', 'project']));
        }

        $invoice->delete();

        return response()->json(['success' => true]);
    }

    public function apiTimeEntries(Request $request)
    {
        $userId = Auth::id();

        if ($request->isMethod('GET')) {
            return response()->json(
                WorkTimeEntry::with('project')->where('user_id', $userId)->orderByDesc('start_time')->get()
            );
        }

        $entry = WorkTimeEntry::create([
            ...$this->validateTimeEntry($request),
            'user_id' => $userId,
        ]);

        return response()->json($entry->load('project'));
    }

    public function apiTimeEntry(Request $request, $id)
    {
        $entry = WorkTimeEntry::where('user_id', Auth::id())->findOrFail($id);

        if ($request->isMethod('PUT')) {
            $entry->update($this->validateTimeEntry($request, true));

            return response()->json($entry->fresh()->load('project'));
        }

        $entry->delete();

        return response()->json(['success' => true]);
    }

    public function apiContracts(Request $request)
    {
        $userId = Auth::id();

        if ($request->isMethod('GET')) {
            return response()->json(
                WorkContract::with('client')->where('user_id', $userId)->orderByDesc('created_at')->get()
            );
        }

        $contract = WorkContract::create([
            ...$this->validateContract($request),
            'user_id' => $userId,
        ]);

        return response()->json($contract->load('client'));
    }

    public function apiContract(Request $request, $id)
    {
        $contract = WorkContract::where('user_id', Auth::id())->findOrFail($id);

        if ($request->isMethod('PUT')) {
            $contract->update($this->validateContract($request, true));

            return response()->json($contract->fresh()->load('client'));
        }

        $contract->delete();

        return response()->json(['success' => true]);
    }

    public function apiMeetingNotes(Request $request)
    {
        $userId = Auth::id();

        if ($request->isMethod('GET')) {
            return response()->json(
                WorkMeetingNote::with(['client', 'project'])->where('user_id', $userId)->orderByDesc('meeting_date')->get()
            );
        }

        $note = WorkMeetingNote::create([
            ...$this->validateMeetingNote($request),
            'user_id' => $userId,
        ]);

        return response()->json($note->load(['client', 'project']));
    }

    public function apiMeetingNote(Request $request, $id)
    {
        $note = WorkMeetingNote::where('user_id', Auth::id())->findOrFail($id);

        if ($request->isMethod('PUT')) {
            $note->update($this->validateMeetingNote($request, true));

            return response()->json($note->fresh()->load(['client', 'project']));
        }

        $note->delete();

        return response()->json(['success' => true]);
    }

    private function validateClient(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'name' => [$required, 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'status' => [$partial ? 'sometimes' : 'required', 'string', Rule::in(['Active', 'Lead', 'Inactive'])],
            'notes' => ['nullable', 'string'],
            'avatar_color' => ['nullable', 'string', 'max:50'],
        ]);
    }

    private function validateProject(Request $request, bool $partial = false): array
    {
        $userId = Auth::id();

        return $request->validate([
            'client_id' => ['nullable', 'integer', Rule::exists('work_clients', 'id')->where('user_id', $userId)],
            'name' => [$partial ? 'sometimes' : 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => [$partial ? 'sometimes' : 'required', 'string', Rule::in(['Active', 'On Hold', 'Completed', 'Cancelled'])],
            'budget' => ['nullable', 'numeric', 'min:0'],
            'deadline' => ['nullable', 'date'],
        ]);
    }

    private function validateInvoice(Request $request, bool $partial = false): array
    {
        $userId = Auth::id();

        return $request->validate([
            'client_id' => ['nullable', 'integer', Rule::exists('work_clients', 'id')->where('user_id', $userId)],
            'project_id' => ['nullable', 'integer', Rule::exists('work_projects', 'id')->where('user_id', $userId)],
            'invoice_number' => [$partial ? 'sometimes' : 'required', 'string', 'max:100'],
            'amount' => [$partial ? 'sometimes' : 'required', 'numeric', 'min:0'],
            'status' => [$partial ? 'sometimes' : 'required', 'string', Rule::in(['Pending', 'Paid', 'Overdue', 'Cancelled'])],
            'issue_date' => [$partial ? 'sometimes' : 'required', 'date'],
            'due_date' => [$partial ? 'sometimes' : 'required', 'date'],
            'paid_date' => ['nullable', 'date'],
            'description' => ['nullable', 'string'],
        ]);
    }

    private function validateTimeEntry(Request $request, bool $partial = false): array
    {
        $userId = Auth::id();

        return $request->validate([
            'project_id' => ['nullable', 'integer', Rule::exists('work_projects', 'id')->where('user_id', $userId)],
            'start_time' => [$partial ? 'sometimes' : 'required', 'date'],
            'end_time' => ['nullable', 'date'],
            'description' => ['nullable', 'string'],
            'is_running' => [$partial ? 'sometimes' : 'required', 'boolean'],
        ]);
    }

    private function validateContract(Request $request, bool $partial = false): array
    {
        $userId = Auth::id();

        return $request->validate([
            'client_id' => ['nullable', 'integer', Rule::exists('work_clients', 'id')->where('user_id', $userId)],
            'title' => [$partial ? 'sometimes' : 'required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'status' => [$partial ? 'sometimes' : 'required', 'string', Rule::in(['Draft', 'Sent', 'Signed', 'Expired', 'Cancelled'])],
            'signed_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date'],
        ]);
    }

    private function validateMeetingNote(Request $request, bool $partial = false): array
    {
        $userId = Auth::id();

        return $request->validate([
            'client_id' => ['nullable', 'integer', Rule::exists('work_clients', 'id')->where('user_id', $userId)],
            'project_id' => ['nullable', 'integer', Rule::exists('work_projects', 'id')->where('user_id', $userId)],
            'title' => [$partial ? 'sometimes' : 'required', 'string', 'max:255'],
            'meeting_date' => [$partial ? 'sometimes' : 'required', 'date'],
            'content' => ['nullable', 'string'],
        ]);
    }

    private function buildRecentActivity(int $userId): array
    {
        $projectActivity = WorkProject::with('client')
            ->where('user_id', $userId)
            ->latest('updated_at')
            ->limit(3)
            ->get()
            ->map(fn ($project) => [
                'type' => 'project',
                'icon' => 'folder_open',
                'title' => $project->name,
                'meta' => $project->client?->name ?: 'No client assigned',
                'timestamp' => $project->updated_at,
            ]);

        $invoiceActivity = WorkInvoice::with('client')
            ->where('user_id', $userId)
            ->latest('updated_at')
            ->limit(3)
            ->get()
            ->map(fn ($invoice) => [
                'type' => 'invoice',
                'icon' => 'receipt_long',
                'title' => $invoice->invoice_number,
                'meta' => $invoice->client?->name ?: 'Invoice updated',
                'timestamp' => $invoice->updated_at,
            ]);

        $meetingActivity = WorkMeetingNote::with('client')
            ->where('user_id', $userId)
            ->latest('updated_at')
            ->limit(2)
            ->get()
            ->map(fn ($note) => [
                'type' => 'meeting',
                'icon' => 'event_note',
                'title' => $note->title,
                'meta' => $note->client?->name ?: 'General meeting',
                'timestamp' => $note->updated_at,
            ]);

        return collect()
            ->merge($projectActivity)
            ->merge($invoiceActivity)
            ->merge($meetingActivity)
            ->sortByDesc('timestamp')
            ->take(5)
            ->values()
            ->map(fn ($item) => [
                'type' => $item['type'],
                'icon' => $item['icon'],
                'title' => $item['title'],
                'meta' => $item['meta'],
                'date' => $item['timestamp']->toDateString(),
            ])
            ->all();
    }

    private function buildUpcomingFocus(int $userId): array
    {
        $invoiceFocus = WorkInvoice::with('client')
            ->where('user_id', $userId)
            ->whereIn('status', ['Pending', 'Overdue'])
            ->whereNotNull('due_date')
            ->orderBy('due_date')
            ->limit(3)
            ->get()
            ->map(fn ($invoice) => [
                'label' => $invoice->invoice_number,
                'detail' => $invoice->client?->name ?: 'Invoice',
                'date' => optional($invoice->due_date)->toDateString(),
            ]);

        $projectFocus = WorkProject::with('client')
            ->where('user_id', $userId)
            ->whereIn('status', ['Active', 'On Hold'])
            ->whereNotNull('deadline')
            ->orderBy('deadline')
            ->limit(3)
            ->get()
            ->map(fn ($project) => [
                'label' => $project->name,
                'detail' => $project->client?->name ?: 'Project',
                'date' => optional($project->deadline)->toDateString(),
            ]);

        return collect()
            ->merge($invoiceFocus)
            ->merge($projectFocus)
            ->sortBy('date')
            ->take(4)
            ->values()
            ->all();
    }
}
