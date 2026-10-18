import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Code2, Database, Rocket, Lightbulb } from 'lucide-react';

interface ApiGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiGuideModal: React.FC<ApiGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/health',
      desc: 'Check server uptime and MongoDB connection state',
      curl: 'curl http://localhost:5000/api/health',
    },
    {
      method: 'GET',
      path: '/api/tasks',
      desc: 'List tasks with optional ?search=, ?status=, and ?priority= query params',
      curl: 'curl "http://localhost:5000/api/tasks?status=in-progress"',
    },
    {
      method: 'POST',
      path: '/api/tasks',
      desc: 'Create a new task with title, category, priority, status',
      curl: `curl -X POST http://localhost:5000/api/tasks -H "Content-Type: application/json" -d '{"title":"Build Auth Module","priority":"high","category":"Backend"}'`,
    },
    {
      method: 'PUT',
      path: '/api/tasks/:id',
      desc: 'Update existing task fields or status',
      curl: `curl -X PUT http://localhost:5000/api/tasks/<TASK_ID> -H "Content-Type: application/json" -d '{"status":"completed"}'`,
    },
    {
      method: 'DELETE',
      path: '/api/tasks/:id',
      desc: 'Permanently remove a task from MongoDB',
      curl: 'curl -X DELETE http://localhost:5000/api/tasks/<TASK_ID>',
    },
    {
      method: 'GET',
      path: '/api/tasks/stats',
      desc: 'Retrieve aggregated counts for dashboard cards',
      curl: 'curl http://localhost:5000/api/tasks/stats',
    },
    {
      method: 'POST',
      path: '/api/tasks/seed',
      desc: 'Seed database with pre-configured sample practice tasks',
      curl: 'curl -X POST http://localhost:5000/api/tasks/seed',
    },
  ];

  const practiceChallenges = [
    {
      title: 'Level 1: Add Task Due Dates & Notifications',
      description: 'Add a date picker in React, save dueDate in MongoDB, and display a badge when a task is overdue.',
      skills: 'Schema update, Date manipulation, Tailwind conditional classes',
    },
    {
      title: 'Level 2: Implement User Authentication (JWT)',
      description: 'Create a User model, hash passwords with bcrypt, sign JWT tokens on login, and protect the /api/tasks routes.',
      skills: 'Express Auth Middleware, bcrypt, jsonwebtoken, React Auth Context',
    },
    {
      title: 'Level 3: Pagination & Infinite Scrolling',
      description: 'Modify GET /api/tasks to support ?page=1&limit=5 query parameters using Mongoose .skip() and .limit().',
      skills: 'Backend pagination, React query params & state management',
    },
    {
      title: 'Level 4: Real-time Updates with Socket.io',
      description: 'Connect Socket.io to broadcast task creation, edits, and deletions instantly across multiple browser tabs.',
      skills: 'WebSockets, Event listeners, Real-time state synchronization',
    },
  ];

  const methodColors: Record<string, string> = {
    GET: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    POST: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    PUT: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    DELETE: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30">
              <Rocket className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                MERN Practice Guide & API Documentation (TypeScript)
              </h2>
              <p className="text-xs text-slate-400">
                Architecture overview, REST endpoints, and hands-on skill-building challenges
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Architecture Overview */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
              <Code2 className="w-4 h-4 text-cyan-400" />
              1. Full-Stack Data Flow (TypeScript)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold text-cyan-400">1. React 19 + TS</span>
                <p className="text-[11px] text-slate-400 mt-1">Typed React components call api.ts via Vite proxy</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold text-indigo-400">2. Express TS Router</span>
                <p className="text-[11px] text-slate-400 mt-1">Typed Express handlers at /api/tasks & middleware</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold text-purple-400">3. Typed Controller</span>
                <p className="text-[11px] text-slate-400 mt-1">Validates payload against ITask interface</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold text-emerald-400">4. MongoDB Engine</span>
                <p className="text-[11px] text-slate-400 mt-1">Mongoose persists BSON documents & returns typed data</p>
              </div>
            </div>
          </div>

          {/* Endpoints Reference */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-indigo-400" />
              2. Backend REST API Endpoints
            </h3>
            <div className="space-y-3">
              {endpoints.map((ep, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                          methodColors[ep.method]
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="text-sm font-mono font-semibold text-slate-200">
                        {ep.path}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{ep.desc}</p>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-center">
                    <button
                      onClick={() => handleCopy(ep.curl, i)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
                    >
                      {copiedIndex === i ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied cURL</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy cURL</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Database Setup Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-teal-400" />
              3. MongoDB Connection Setup
            </h3>
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-slate-300 space-y-2">
              <p>
                <strong>Option A (Local MongoDB):</strong> Ensure MongoDB Community Server is installed and running on your system. By default, it connects to <code className="bg-slate-950 px-1.5 py-0.5 rounded text-teal-300">mongodb://127.0.0.1:27017/mern_practice</code>.
              </p>
              <p>
                <strong>Option B (Free Cloud MongoDB Atlas):</strong> Create a free cluster on mongodb.com, click "Connect", get your connection string, and paste it into <code className="bg-slate-950 px-1.5 py-0.5 rounded text-teal-300">server/.env</code> as <code className="bg-slate-950 px-1.5 py-0.5 rounded text-teal-300">MONGODB_URI=mongodb+srv://...</code>.
              </p>
            </div>
          </div>

          {/* Full-Stack Practice Challenges */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              4. Skill-Building Practice Challenges
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {practiceChallenges.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-indigo-300 mb-1.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Skills: </span>
                    {item.skills}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md cursor-pointer"
          >
            Got it, Let's Code!
          </button>
        </div>

      </div>
    </div>
  );
};
