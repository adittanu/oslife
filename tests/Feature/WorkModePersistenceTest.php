<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\WorkClient;
use App\Models\WorkInvoice;
use App\Models\WorkMeetingNote;
use App\Models\WorkProject;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WorkModePersistenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_project_creation_returns_loaded_client_relation(): void
    {
        $user = User::factory()->create();
        $client = WorkClient::query()->create([
            'user_id' => $user->id,
            'name' => 'Acme Studio',
            'company' => 'Acme',
            'status' => 'Active',
        ]);

        $response = $this->actingAs($user)->postJson('/api/work/projects', [
            'client_id' => $client->id,
            'name' => 'Website Refresh',
            'description' => 'Landing page overhaul',
            'status' => 'Active',
            'budget' => 2500,
            'deadline' => '2026-03-20',
        ]);

        $response->assertOk()
            ->assertJsonPath('name', 'Website Refresh')
            ->assertJsonPath('client.id', $client->id)
            ->assertJsonPath('client.name', 'Acme Studio');
    }

    public function test_invoice_creation_can_persist_project_relation(): void
    {
        $user = User::factory()->create();
        $client = WorkClient::query()->create([
            'user_id' => $user->id,
            'name' => 'Bright Co',
            'company' => 'Bright',
            'status' => 'Active',
        ]);
        $project = WorkProject::query()->create([
            'user_id' => $user->id,
            'client_id' => $client->id,
            'name' => 'Quarterly Retainer',
            'status' => 'Active',
        ]);

        $response = $this->actingAs($user)->postJson('/api/work/invoices', [
            'client_id' => $client->id,
            'project_id' => $project->id,
            'invoice_number' => 'INV-2001',
            'amount' => 1800,
            'status' => 'Pending',
            'issue_date' => '2026-03-10',
            'due_date' => '2026-03-17',
            'description' => 'Retainer payment',
        ]);

        $response->assertOk()
            ->assertJsonPath('invoice_number', 'INV-2001')
            ->assertJsonPath('client.name', 'Bright Co')
            ->assertJsonPath('project.name', 'Quarterly Retainer');

        $this->assertDatabaseHas('work_invoices', [
            'user_id' => $user->id,
            'project_id' => $project->id,
            'invoice_number' => 'INV-2001',
        ]);
    }

    public function test_meeting_notes_can_store_linked_project(): void
    {
        $user = User::factory()->create();
        $client = WorkClient::query()->create([
            'user_id' => $user->id,
            'name' => 'Northwind',
            'company' => 'Northwind',
            'status' => 'Active',
        ]);
        $project = WorkProject::query()->create([
            'user_id' => $user->id,
            'client_id' => $client->id,
            'name' => 'SEO Sprint',
            'status' => 'Active',
        ]);

        $response = $this->actingAs($user)->postJson('/api/work/meeting-notes', [
            'client_id' => $client->id,
            'project_id' => $project->id,
            'title' => 'Kickoff Call',
            'meeting_date' => '2026-03-10',
            'content' => 'Aligning on launch timeline.',
        ]);

        $response->assertOk()
            ->assertJsonPath('title', 'Kickoff Call')
            ->assertJsonPath('project.name', 'SEO Sprint');

        $this->assertDatabaseHas('work_meeting_notes', [
            'user_id' => $user->id,
            'project_id' => $project->id,
            'title' => 'Kickoff Call',
        ]);
    }

    public function test_dashboard_surfaces_recent_work_activity(): void
    {
        $user = User::factory()->create();
        $client = WorkClient::query()->create([
            'user_id' => $user->id,
            'name' => 'Studio Nine',
            'company' => 'Studio Nine',
            'status' => 'Active',
        ]);
        $project = WorkProject::query()->create([
            'user_id' => $user->id,
            'client_id' => $client->id,
            'name' => 'Brand Sprint',
            'status' => 'Active',
            'deadline' => '2026-03-15',
        ]);
        WorkInvoice::query()->create([
            'user_id' => $user->id,
            'client_id' => $client->id,
            'project_id' => $project->id,
            'invoice_number' => 'INV-9001',
            'amount' => 950,
            'status' => 'Pending',
            'issue_date' => '2026-03-10',
            'due_date' => '2026-03-14',
        ]);
        WorkMeetingNote::query()->create([
            'user_id' => $user->id,
            'client_id' => $client->id,
            'project_id' => $project->id,
            'title' => 'Scope Review',
            'meeting_date' => '2026-03-10',
            'content' => 'Need clearer milestones.',
        ]);

        $this->actingAs($user)
            ->get('/work/dashboard')
            ->assertOk()
            ->assertSee('Brand Sprint')
            ->assertSee('INV-9001')
            ->assertSee('Scope Review');
    }
}
