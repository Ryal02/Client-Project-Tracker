<?php

namespace Tests\Unit;

use App\Models\Project;
use PHPUnit\Framework\TestCase;

class ProjectModelTest extends TestCase
{
    public function test_status_constants_are_defined(): void
    {
        $this->assertSame(
            ['Planning', 'In Progress', 'On Hold', 'Completed'],
            Project::STATUSES
        );
    }

    public function test_priority_constants_are_defined(): void
    {
        $this->assertSame(
            ['Low', 'Medium', 'High'],
            Project::PRIORITIES
        );
    }
}
