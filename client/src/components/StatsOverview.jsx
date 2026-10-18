import React from 'react';
import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';

export const StatsOverview = ({ stats, tasksCount }) => {
  const total = stats?.total ?? tasksCount;
  const completed = stats?.completed ?? 0;
  const inProgress = stats?.inProgress ?? 0;
  const pending = stats?.pending ?? 0;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const cards = [
    {
      title: 'Total Tasks',
      value: total,
      label: 'Managed in MongoDB',
      icon: ListTodo,
      color: 'from-blue-500/20 to-indigo-500/10 text-indigo-400 border-indigo-500/30',
      iconColor: 'text-indigo-400',
    },
    {
      title: 'In Progress',
      value: inProgress,
      label: 'Currently working on',
      icon: Clock,
      color: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30',
      iconColor: 'text-amber-400',
    },
    {
      title: 'Completed',
      value: completed,
      label: `${completionRate}% Completion rate`,
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Pending',
      value: pending,
      label: 'Awaiting action',
      icon: AlertCircle,
      color: 'from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/30',
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-4">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} border backdrop-blur-md transition-all hover:scale-[1.02] duration-200 shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.title}
                </span>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <Icon className={`w-4 h-4 ${card.iconColor}`} />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {card.value}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400 truncate">
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      {total > 0 && (
        <div className="p-3 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="flex justify-between items-center text-xs font-medium mb-1.5">
            <span className="text-slate-300">Overall Completion Progress</span>
            <span className="text-emerald-400 font-bold">{completionRate}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
