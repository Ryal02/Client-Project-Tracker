<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-3 months', '+1 month');
        $dueDate = fake()->dateTimeBetween($startDate, '+6 months');

        return [
            'user_id' => User::factory(),
            'client_name' => fake()->company(),
            'project_name' => fake()->catchPhrase(),
            'description' => fake()->optional()->paragraph(),
            'status' => fake()->randomElement(Project::STATUSES),
            'priority' => fake()->randomElement(Project::PRIORITIES),
            'start_date' => $startDate->format('Y-m-d'),
            'due_date' => $dueDate->format('Y-m-d'),
        ];
    }
}
