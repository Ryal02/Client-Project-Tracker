<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct(
        private readonly ProjectService $projectService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $projects = $this->projectService->listForUser(
            $request->user()->id,
            $request->only(['search', 'status', 'priority', 'sort_by', 'sort_dir']),
        );

        return response()->json($projects);
    }

    public function show(Request $request, int $project): JsonResponse
    {
        $result = $this->projectService->getForUser(
            $project,
            $request->user()->id,
        );

        return response()->json($result);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = $this->projectService->createForUser(
            $request->user()->id,
            $request->validated(),
        );

        return response()->json($project, 201);
    }

    public function update(UpdateProjectRequest $request, int $project): JsonResponse
    {
        $result = $this->projectService->updateForUser(
            $project,
            $request->user()->id,
            $request->validated(),
        );

        return response()->json($result);
    }

    public function destroy(Request $request, int $project): JsonResponse
    {
        $this->projectService->deleteForUser(
            $project,
            $request->user()->id,
        );

        return response()->json(['message' => 'Project deleted successfully.']);
    }
}
