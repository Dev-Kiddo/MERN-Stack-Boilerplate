import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { FilterBar } from './components/FilterBar';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { ApiGuideModal } from './components/ApiGuideModal';
import { Task, TaskStats, HealthStatus, TaskFormData, TaskStatus } from './types/task';
import { 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  Inbox, 
  RefreshCw,
  Terminal,
  ExternalLink 
} from 'lucide-react';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [seeding, setSeeding] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  
  // Filters
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('all');
  const [priority, setPriority] = useState<string>('all');
  const [category, setCategory] = useState<string>('all');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Notifications / Toast
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Check health
  const checkHealth = useCallback(async () => {
    const data = await api.checkHealth();
    setHealth(data);
    return data;
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.getStats();
      if (res.success) setStats(res.data);
    } catch {
      // Handled gracefully
    }
  }, []);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getTasks({ search, status, priority, category });
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Error fetching tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, category]);

  // Initial load
  useEffect(() => {
    checkHealth();
    fetchStats();
    fetchTasks();
  }, [checkHealth, fetchStats, fetchTasks]);

  // Periodic health check
  useEffect(() => {
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  // Refresh all
  const handleRefresh = async () => {
    await checkHealth();
    await fetchStats();
    await fetchTasks();
    showToast('Workspace data refreshed', 'info');
  };

  // Seed initial data
  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await api.seedTasks();
      if (res.success) {
        showToast(res.message || 'Sample tasks loaded', 'success');
        await fetchTasks();
        await fetchStats();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to seed sample tasks', 'error');
    } finally {
      setSeeding(false);
    }
  };

  // Create or Update task
  const handleSaveTask = async (taskData: TaskFormData) => {
    setModalLoading(true);
    try {
      if (editingTask) {
        const res = await api.updateTask(editingTask._id, taskData);
        if (res.success) {
          showToast('Task updated successfully!', 'success');
          setIsTaskModalOpen(false);
          setEditingTask(null);
          await fetchTasks();
          await fetchStats();
        }
      } else {
        const res = await api.createTask(taskData);
        if (res.success) {
          showToast('New task created successfully!', 'success');
          setIsTaskModalOpen(false);
          await fetchTasks();
          await fetchStats();
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save task', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  // Toggle status
  const handleToggleStatus = async (task: Task, newStatus?: TaskStatus) => {
    try {
      const targetStatus: TaskStatus = newStatus || (task.status === 'completed' ? 'pending' : 'completed');
      
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: targetStatus } : t))
      );

      const res = await api.updateTask(task._id, { status: targetStatus });
      if (res.success) {
        fetchStats();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
      fetchTasks();
    }
  };

  // Delete task
  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      // Optimistic UI update
      setTasks((prev) => prev.filter((t) => t._id !== id));
      const res = await api.deleteTask(id);
      if (res.success) {
        showToast('Task deleted successfully', 'info');
        fetchStats();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete task', 'error');
      fetchTasks();
    }
  };

  // Extract unique categories
  const categories: string[] = Array.from(
    new Set(tasks.map((t) => t.category).filter(Boolean))
  );

  const isDbOffline = health && (!health.database || !health.database.connected);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs sm:text-sm font-semibold backdrop-blur-xl ${
              toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-800 shadow-rose-950/50'
                : toast.type === 'info'
                ? 'bg-indigo-950/90 text-indigo-200 border-indigo-800 shadow-indigo-950/50'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-800 shadow-emerald-950/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-ping" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        health={health}
        onRefresh={handleRefresh}
        onSeed={handleSeed}
        onOpenGuide={() => setIsGuideOpen(true)}
        seeding={seeding}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* MongoDB Warning Banner if Disconnected */}
        {isDbOffline && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg backdrop-blur-md">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-amber-200">
                  MongoDB is currently disconnected
                </h2>
                <p className="text-xs text-amber-300/80 mt-1 leading-relaxed">
                  The Express server is running, but cannot reach MongoDB at{' '}
                  <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-200 font-mono">
                    mongodb://127.0.0.1:27017/mern_practice
                  </code>
                  . Start your local MongoDB service, or paste your MongoDB Atlas cloud URI into{' '}
                  <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-200 font-mono">
                    server/.env
                  </code>
                  .
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-stretch md:self-auto">
              <button
                onClick={() => setIsGuideOpen(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>Setup Guide</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRefresh}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors whitespace-nowrap font-bold cursor-pointer"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Full-Stack Practice Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Connected to Express REST API & MongoDB Mongoose in TypeScript. Full type safety from database to browser.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-indigo-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Task</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} tasksCount={tasks.length} />

        {/* Filter & Controls Bar */}
        <FilterBar
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
          category={category}
          setCategory={setCategory}
          categories={categories}
          onOpenCreateModal={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
        />

        {/* Task Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
            <span>Showing {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
            {tasks.length > 0 && (
              <span className="text-slate-500">Click checkmark or status pill to toggle progress</span>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mb-3" />
              <p className="text-sm font-semibold text-slate-300">Loading tasks from MongoDB...</p>
              <p className="text-xs text-slate-500 mt-1">Querying /api/tasks</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-12 sm:p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80 flex flex-col items-center justify-center max-w-xl mx-auto shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                No tasks found
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
                {search || status !== 'all' || priority !== 'all' || category !== 'all'
                  ? 'No tasks matched your active filter criteria. Try resetting filters or search query.'
                  : isDbOffline
                  ? 'Connect MongoDB to persist and view tasks. You can also populate demo data once connected.'
                  : 'Your database is currently empty. Create your first task or click below to seed starter practice tasks.'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setIsTaskModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Task</span>
                </button>

                {!isDbOffline && (
                  <button
                    onClick={handleSeed}
                    disabled={seeding}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Seed Demo Tasks</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onEdit={(t) => {
                    setEditingTask(t);
                    setIsTaskModalOpen(true);
                  }}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} MERN TypeScript Practice Workspace. Built for full-stack learning.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>API Endpoints</span>
            </button>
            <span className="text-slate-700">•</span>
            <span>Node + Express TS</span>
            <span className="text-slate-700">•</span>
            <span>React 19 + Tailwind v4 TS</span>
          </div>
        </div>
      </footer>

      {/* Task Create/Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
        loading={modalLoading}
      />

      {/* API Guide Modal */}
      <ApiGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

    </div>
  );
}
