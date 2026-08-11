<?php

namespace App\Http\Requests;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_name' => ['required', 'string', 'max:255'],
            'project_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', Rule::in(Project::STATUSES)],
            'priority' => ['required', Rule::in(Project::PRIORITIES)],
            'start_date' => ['required', 'date'],
            'due_date' => ['required', 'date', 'after_or_equal:start_date'],
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
}
