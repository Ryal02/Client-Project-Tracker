<?php

namespace App\Http\Requests;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_name' => ['sometimes', 'required', 'string', 'max:255'],
            'project_name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'required', Rule::in(Project::STATUSES)],
            'priority' => ['sometimes', 'required', Rule::in(Project::PRIORITIES)],
            'start_date' => ['sometimes', 'required', 'date'],
            'due_date' => ['sometimes', 'required', 'date', 'after_or_equal:start_date'],
        ];
    }

    public function messages(): array
    {
        return [
            'client_name.required' => 'Client name is required.',
            'project_name.required' => 'Project name is required.',
            'status.in' => 'Status must be one of: '.implode(', ', Project::STATUSES).'.',
            'priority.in' => 'Priority must be one of: '.implode(', ', Project::PRIORITIES).'.',
            'due_date.after_or_equal' => 'Due date cannot be earlier than start date.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('start_date') && ! $this->has('due_date')) {
            return;
        }

        if ($this->has('due_date') && ! $this->has('start_date')) {
            $project = $this->route('project');
            if ($project instanceof Project) {
                $this->merge(['start_date' => $project->start_date->format('Y-m-d')]);
            }
        }
    }
}
