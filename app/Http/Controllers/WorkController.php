<?php

namespace App\Http\Controllers;

use App\Models\WorkClient;
use App\Models\WorkProject;
use App\Models\WorkInvoice;
use App\Models\WorkTimeEntry;
use App\Models\WorkContract;
use App\Models\WorkMeetingNote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WorkController extends Controller
{
    // Dashboard
    public function dashboard()
    {
        $userId = Auth::id();
        $clients = WorkClient::where('user_id', $userId)->count();
        $activeProjects = WorkProject::where('user_id', $userId)->where('status', 'Active')->count();
        $pendingInvoices = WorkInvoice::where('user_id', $userId)->where('status', 'Pending')->count();
        $overdueInvoices = WorkInvoice::where('user_id', $userId)->where('status', 'Overdue')->count();

        $thisWeek = now()->startOfWeek();
        $timeThisWeek = WorkTimeEntry::where('user_id', $userId)
            ->where('start_time', '>=', $thisWeek)
            ->get()
            ->sum(function ($entry) {
                return $entry->start_time->diffInMinutes($entry->end_time ?? now());
            });
        $hoursThisWeek = round($timeThisWeek / 60, 1);

        $thisMonth = now()->startOfMonth();
        $incomeThisMonth = WorkInvoice::where('user_id', $userId)
            ->where('status', 'Paid')
            ->where('paid_date', '>=', $thisMonth)
            ->sum('amount');

        return inertia('Work/Dashboard', [
            'stats' => [
                'activeProjects' => $activeProjects,
                'pendingInvoices' => $pendingInvoices,
                'hoursThisWeek' => $hoursThisWeek,
                'incomeThisMonth' => $incomeThisMonth,
                'totalClients' => $clients,
                'overdueInvoices' => $overdueInvoices,
            ],
        ]);
    }

    // Clients
    public function clients()
    {
        $clients = WorkClient::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
        return inertia('Work/Clients', ['clients' => $clients]);
    }

    // Pipeline (Projects)
    public function pipeline()
    {
        $projects = WorkProject::with('client')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
        $clients = WorkClient::where('user_id', Auth::id())->get();
        return inertia('Work/Pipeline', ['projects' => $projects, 'clients' => $clients]);
    }

    // Time Tracking
    public function timeTracking()
    {
        $entries = WorkTimeEntry::with('project')
            ->where('user_id', Auth::id())
            ->orderBy('start_time', 'desc')
            ->limit(50)
            ->get();
        $projects = WorkProject::where('user_id', Auth::id())->get();
        return inertia('Work/TimeTracking', ['entries' => $entries, 'projects' => $projects]);
    }

    // Invoices
    public function invoices()
    {
        $invoices = WorkInvoice::with(['client', 'project'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
        $clients = WorkClient::where('user_id', Auth::id())->get();
        return inertia('Work/Invoices', ['invoices' => $invoices, 'clients' => $clients]);
    }

    // Income (derived from invoices)
    public function income()
    {
        $invoices = WorkInvoice::with('client')
            ->where('user_id', Auth::id())
            ->where('status', 'Paid')
            ->orderBy('paid_date', 'desc')
            ->get();
        return inertia('Work/Income', ['invoices' => $invoices]);
    }

    // Meeting Notes
    public function meetingNotes()
    {
        $notes = WorkMeetingNote::with(['client', 'project'])
            ->where('user_id', Auth::id())
            ->orderBy('meeting_date', 'desc')
            ->get();
        $clients = WorkClient::where('user_id', Auth::id())->get();
        return inertia('Work/MeetingNotes', ['notes' => $notes, 'clients' => $clients]);
    }

    // Contracts
    public function contracts()
    {
        $contracts = WorkContract::with('client')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
        $clients = WorkClient::where('user_id', Auth::id())->get();
        return inertia('Work/Contracts', ['contracts' => $contracts, 'clients' => $clients]);
    }

    // API: Clients CRUD
    public function apiClients(Request $request)
    {
        $userId = Auth::id();

        if ($request->isMethod('GET')) {
            return response()->json(WorkClient::where('user_id', $userId)->get());
        }

        if ($request->isMethod('POST')) {
            $client = WorkClient::create(array_merge($request->all(), ['user_id' => $userId]));
            return response()->json($client);
        }
    }

    public function apiClient(Request $request, $id)
    {
        $client = WorkClient::where('user_id', Auth::id())->findOrFail($id);

        if ($request->isMethod('PUT')) {
            $client->update($request->all());
            return response()->json($client);
        }

        if ($request->isMethod('DELETE')) {
            $client->delete();
            return response()->json(['success' => true]);
        }
    }

    // API: Projects CRUD
    public function apiProjects(Request $request)
    {
        $userId = Auth::id();

        if ($request->isMethod('GET')) {
            return response()->json(WorkProject::with('client')->where('user_id', $userId)->get());
        }

        if ($request->isMethod('POST')) {
            $project = WorkProject::create(array_merge($request->all(), ['user_id' => $userId]));
            return response()->json($project);
        }
    }

    public function apiProject(Request $request, $id)
    {
        $project = WorkProject::where('user_id', Auth::id())->findOrFail($id);

        if ($request->isMethod('PUT')) {
            $project->update($request->all());
            return response()->json($project);
        }

        if ($request->isMethod('DELETE')) {
            $project->delete();
            return response()->json(['success' => true]);
        }
    }

    // API: Invoices CRUD
    public function apiInvoices(Request $request)
    {
        $userId = Auth::id();

        if ($request->isMethod('GET')) {
            return response()->json(WorkInvoice::with(['client', 'project'])->where('user_id', $userId)->get());
        }

        if ($request->isMethod('POST')) {
            $invoice = WorkInvoice::create(array_merge($request->all(), ['user_id' => $userId]));
            return response()->json($invoice);
        }
    }

    public function apiInvoice(Request $request, $id)
    {
        $invoice = WorkInvoice::where('user_id', Auth::id())->findOrFail($id);

        if ($request->isMethod('PUT')) {
            $invoice->update($request->all());
            return response()->json($invoice);
        }

        if ($request->isMethod('DELETE')) {
            $invoice->delete();
            return response()->json(['success' => true]);
        }
    }

    // API: Time Entries CRUD
    public function apiTimeEntries(Request $request)
    {
        $userId = Auth::id();

        if ($request->isMethod('GET')) {
            return response()->json(WorkTimeEntry::with('project')->where('user_id', $userId)->get());
        }

        if ($request->isMethod('POST')) {
            $entry = WorkTimeEntry::create(array_merge($request->all(), ['user_id' => $userId]));
            return response()->json($entry);
        }
    }

    public function apiTimeEntry(Request $request, $id)
    {
        $entry = WorkTimeEntry::where('user_id', Auth::id())->findOrFail($id);

        if ($request->isMethod('PUT')) {
            $entry->update($request->all());
            return response()->json($entry);
        }

        if ($request->isMethod('DELETE')) {
            $entry->delete();
            return response()->json(['success' => true]);
        }
    }

    // API: Contracts CRUD
    public function apiContracts(Request $request)
    {
        $userId = Auth::id();

        if ($request->isMethod('GET')) {
            return response()->json(WorkContract::with('client')->where('user_id', $userId)->get());
        }

        if ($request->isMethod('POST')) {
            $contract = WorkContract::create(array_merge($request->all(), ['user_id' => $userId]));
            return response()->json($contract);
        }
    }

    public function apiContract(Request $request, $id)
    {
        $contract = WorkContract::where('user_id', Auth::id())->findOrFail($id);

        if ($request->isMethod('PUT')) {
            $contract->update($request->all());
            return response()->json($contract);
        }

        if ($request->isMethod('DELETE')) {
            $contract->delete();
            return response()->json(['success' => true]);
        }
    }

    // API: Meeting Notes CRUD
    public function apiMeetingNotes(Request $request)
    {
        $userId = Auth::id();

        if ($request->isMethod('GET')) {
            return response()->json(WorkMeetingNote::with(['client', 'project'])->where('user_id', $userId)->get());
        }

        if ($request->isMethod('POST')) {
            $note = WorkMeetingNote::create(array_merge($request->all(), ['user_id' => $userId]));
            return response()->json($note);
        }
    }

    public function apiMeetingNote(Request $request, $id)
    {
        $note = WorkMeetingNote::where('user_id', Auth::id())->findOrFail($id);

        if ($request->isMethod('PUT')) {
            $note->update($request->all());
            return response()->json($note);
        }

        if ($request->isMethod('DELETE')) {
            $note->delete();
            return response()->json(['success' => true]);
        }
    }
}