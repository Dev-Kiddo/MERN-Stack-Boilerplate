import React from 'react';
import { Search, Plus, X } from 'lucide-react';

interface FilterBarProps {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  priority: string;
  setPriority: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  categories: string[];
  onOpenCreateModal: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  category,
  setCategory,
  categories = [],
  onOpenCreateModal,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
      
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or description..."
          className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Selectors */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>

        {/* Category Filter */}
        {categories.length > 0 && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}

        {/* Add Task Button */}
        <button
          onClick={onOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

    </div>
  );
};
