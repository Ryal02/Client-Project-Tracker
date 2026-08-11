<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@agency.com',
            'password' => Hash::make('password'),
        ]);

        Project::factory()->count(12)->create(['user_id' => $user->id]);
    }
}
