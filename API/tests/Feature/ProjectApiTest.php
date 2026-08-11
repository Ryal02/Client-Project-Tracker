<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProjectApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        Sanctum::actingAs($this->user);
    }

    public function test_can_list_projects(): void
    {
        Project::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/projects');

        $response->assertOk()->assertJsonCount(3);
    }

    public function test_can_show_single_project(): void
    {
        $project = Project::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/projects/{$project->id}");

        $response->assertOk()
            ->assertJsonPath('id', $project->id)
            ->assertJsonPath('client_name', $project->client_name);
    }

    public function test_can_create_project(): void
    {
        $payload = [
            'client_name' => 'Acme Corp',
            'project_name' => 'Website Redesign',
            'description' => 'Full redesign of corporate website',
            'status' => 'Planning',
            'priority' => 'High',
            'start_date' => '2026-01-01',
            'due_date' => '2026-06-01',
        ];

        $response = $this->postJson('/api/projects', $payload);

        $response->assertCreated()
            ->assertJsonPath('client_name', 'Acme Corp')
            ->assertJsonPath('project_name', 'Website Redesign');

        $this->assertDatabaseHas('projects', [
            'client_name' => 'Acme Corp',
            'user_id' => $this->user->id,
        ]);
    }

    public function test_can_update_project(): void
    {
        $project = Project::factory()->create(['user_id' => $this->user->id]);

        $response = $this->putJson("/api/projects/{$project->id}", [
            'status' => 'In Progress',
        ]);

        $response->assertOk()->assertJsonPath('status', 'In Progress');
    }

    public function test_can_delete_project(): void
    {
        $project = Project::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson("/api/projects/{$project->id}");

        $response->assertOk();
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_validation_requires_client_name(): void
    {
        $response = $this->postJson('/api/projects', [
            'project_name' => 'Test',
            'status' => 'Planning',
            'priority' => 'Low',
            'start_date' => '2026-01-01',
            'due_date' => '2026-06-01',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['client_name']);
    }

    public function test_validation_requires_project_name(): void
    {
        $response = $this->postJson('/api/projects', [
            'client_name' => 'Acme',
            'status' => 'Planning',
            'priority' => 'Low',
            'start_date' => '2026-01-01',
            'due_date' => '2026-06-01',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['project_name']);
    }

    public function test_validation_rejects_invalid_status(): void
    {
        $response = $this->postJson('/api/projects', [
            'client_name' => 'Acme',
            'project_name' => 'Test',
            'status' => 'Invalid',
            'priority' => 'Low',
            'start_date' => '2026-01-01',
            'due_date' => '2026-06-01',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['status']);
    }

    public function test_validation_rejects_invalid_priority(): void
    {
        $response = $this->postJson('/api/projects', [
            'client_name' => 'Acme',
            'project_name' => 'Test',
            'status' => 'Planning',
            'priority' => 'Urgent',
            'start_date' => '2026-01-01',
            'due_date' => '2026-06-01',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['priority']);
    }

    public function test_validation_rejects_due_date_before_start_date(): void
    {
        $response = $this->postJson('/api/projects', [
            'client_name' => 'Acme',
            'project_name' => 'Test',
            'status' => 'Planning',
            'priority' => 'Low',
            'start_date' => '2026-06-01',
            'due_date' => '2026-01-01',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['due_date']);
    }

    public function test_can_search_projects(): void
    {
        Project::factory()->create([
            'user_id' => $this->user->id,
            'client_name' => 'Unique Client XYZ',
        ]);
        Project::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/projects?search=Unique+Client');

        $response->assertOk()->assertJsonCount(1);
    }

    public function test_can_filter_by_status(): void
    {
        Project::factory()->create(['user_id' => $this->user->id, 'status' => 'Completed']);
        Project::factory()->create(['user_id' => $this->user->id, 'status' => 'Planning']);

        $response = $this->getJson('/api/projects?status=Completed');

        $response->assertOk()->assertJsonCount(1);
    }

    public function test_can_filter_by_priority(): void
    {
        Project::factory()->create(['user_id' => $this->user->id, 'priority' => 'High']);
        Project::factory()->create(['user_id' => $this->user->id, 'priority' => 'Low']);

        $response = $this->getJson('/api/projects?priority=High');

        $response->assertOk()->assertJsonCount(1);
    }

    public function test_cannot_access_other_users_project(): void
    {
        $otherUser = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->getJson("/api/projects/{$project->id}");

        $response->assertNotFound();
    }

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->app['auth']->forgetGuards();

        $response = $this->getJson('/api/projects');

        $response->assertUnauthorized();
    }
}
