import React from 'react';
import { CheckCircle2, Circle, Clock, Trash2, Edit3, Tag, Calendar } from 'lucide-react';

export const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in-progress';

  // Priority Styling
  const priorityStyles = {
    high: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  };

  // Status Styling
  const statusStyles = {
    'completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'in-progress': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'pending': 'bg-slate-800/80 text-slate-400 border-slate-700/50',
  };

  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div
      className={`group relative p-5 rounded-2xl border transition-all duration-200 backdrop-blur-md shadow-md ${
        isCompleted
          ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:shadow-indigo-500/5'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Toggle Complete Checkbox */}
        <button
          onClick={() => onToggleStatus(task)}
          className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors flex-shrink-0"
          title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
          ) : isInProgress ? (
            <Clock className="w-5 h-5 text-amber-400" />
          ) : (
            <Circle className="w-5 h-5 hover:text-indigo-400" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {/* Priority Badge */}
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                priorityStyles[task.priority] || priorityStyles.medium
              }`}
            >
              {task.priority}
            </span>

            {/* Category */}
            {task.category && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/50">
                <Tag className="w-2.5 h-2.5 text-indigo-400" />
                {task.category}
              </span>
            )}

            {/* Date */}
            {formattedDate && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500 ml-auto">
                <Calendar className="w-2.5 h-2.5" />
                {formattedDate}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={`text-sm sm:text-base font-semibold transition-all ${
              isCompleted
                ? 'line-through text-slate-500'
                : 'text-slate-100 group-hover:text-white'
            }`}
          >
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Status selector & Actions Footer */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
            {/* Status Dropdown */}
            <select
              value={task.status}
              onChange={(e) => onToggleStatus(task, e.target.value)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium bg-slate-950 focus:outline-none cursor-pointer ${
                statusStyles[task.status] || statusStyles.pending
              }`}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors"
                title="Edit task"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
