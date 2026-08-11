import { useState } from 'react';
import type { Project, ProjectFormData } from '../types/project';
import { PRIORITIES, STATUSES } from '../types/project';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
}

const emptyForm: ProjectFormData = {
  client_name: '',
  project_name: '',
  description: '',
  status: 'Planning',
  priority: 'Medium',
  start_date: '',
  due_date: '',
};

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const [form, setForm] = useState<ProjectFormData>(
    project
      ? {
          client_name: project.client_name,
          project_name: project.project_name,
          description: project.description || '',
          status: project.status,
          priority: project.priority,
          start_date: project.start_date.split('T')[0],
          due_date: project.due_date.split('T')[0],
        }
      : emptyForm,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      await onSubmit(form);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errors' in err) {
        const apiErrors = (err as { errors: Record<string, string[]> }).errors;
        const flat: Record<string, string> = {};
        for (const [key, messages] of Object.entries(apiErrors)) {
          flat[key] = messages[0];
        }
        setErrors(flat);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name: keyof ProjectFormData, label: string, type = 'text') => (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={form[name]}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={form[name]}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      )}
      {errors[name] && <p className="mt-1 text-xs text-rose-600">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {field('client_name', 'Client Name *')}
        {field('project_name', 'Project Name *')}
      </div>

      {field('description', 'Description', 'textarea')}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-slate-700">
            Status *
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.status && <p className="mt-1 text-xs text-rose-600">{errors.status}</p>}
        </div>

        <div>
          <label htmlFor="priority" className="mb-1.5 block text-sm font-medium text-slate-700">
            Priority *
          </label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errors.priority && <p className="mt-1 text-xs text-rose-600">{errors.priority}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {field('start_date', 'Start Date *', 'date')}
        {field('due_date', 'Due Date *', 'date')}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}
