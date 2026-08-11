<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('client_name');
            $table->string('project_name');
            $table->text('description')->nullable();
            $table->enum('status', ['Planning', 'In Progress', 'On Hold', 'Completed'])->default('Planning');
            $table->enum('priority', ['Low', 'Medium', 'High'])->default('Medium');
            $table->date('start_date');
            $table->date('due_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
