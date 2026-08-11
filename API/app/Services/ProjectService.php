<?php

namespace App\Services;

use App\Models\Project;
use App\Repositories\ProjectRepository;
use Illuminate\Database\Eloquent\Collection;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ProjectService
{
    public function __construct(
        private readonly ProjectRepository $projectRepository,
    ) {}

    public function listForUser(int $userId, array $filters = []): Collection
    {
        return $this->projectRepository->findForUser($userId, $filters);
    }

    public function getForUser(int $projectId, int $userId): Project
    {
        $project = $this->projectRepository->findByIdForUser($projectId, $userId);

        if (! $project) {
            throw new NotFoundHttpException('Project not found.');
        }

        return $project;
    }

    public function createForUser(int $userId, array $data): Project
    {
        return $this->projectRepository->create([
            ...$data,
            'user_id' => $userId,
        ]);
    }

    public function updateForUser(int $projectId, int $userId, array $data): Project
    {
        $project = $this->getForUser($projectId, $userId);

        return $this->projectRepository->update($project, $data);
    }

    public function deleteForUser(int $projectId, int $userId): void
    {
        $project = $this->getForUser($projectId, $userId);

        $this->projectRepository->delete($project);
    }
}
