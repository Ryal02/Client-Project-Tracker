<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Project::query()->where('user_id', $request->user()->id);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('client_name', 'like', "%{$search}%")
                    ->orWhere('project_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($priority = $request->query('priority')) {
            $query->where('priority', $priority);
        }

        $sortBy = $request->query('sort_by', 'created_at');
        $sortDir = strtolower($request->query('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $allowedSorts = ['client_name', 'project_name', 'status', 'priority', 'start_date', 'due_date', 'created_at'];
        if (! in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'created_at';
        }

        $projects = $query->orderBy($sortBy, $sortDir)->get();

        return response()->json($projects);
    }

    public function show(Request $request, Project $project): JsonResponse
    {
        $this->authorizeProject($request, $project);

        return response()->json($project);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = Project::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return response()->json($project, 201);
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $this->authorizeProject($request, $project);

        $project->update($request->validated());

        return response()->json($project->fresh());
    }

    public function destroy(Request $request, Project $project): JsonResponse
    {
        $this->authorizeProject($request, $project);

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully.']);
    }

    private function authorizeProject(Request $request, Project $project): void
    {
        if ($project->user_id !== $request->user()->id) {
            abort(404);
        }
    }
}
