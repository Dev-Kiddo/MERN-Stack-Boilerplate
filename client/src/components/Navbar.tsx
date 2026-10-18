import React from 'react';
import { Server, Database, Sparkles, BookOpen, RefreshCw } from 'lucide-react';
import { HealthStatus } from '../types/task';

interface NavbarProps {
  health: HealthStatus | null;
  onRefresh: () => void;
  onSeed: () => void;
  onOpenGuide: () => void;
  seeding: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  health,
  onRefresh,
  onSeed,
  onOpenGuide,
  seeding,
}) => {
  const isServerUp = health?.status === 'ok';
  const isDbUp = Boolean(health?.database?.connected);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 text-lg">
                TS
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white m-0">
                MERN Practice Lab
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                TypeScript
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              MongoDB • Express • React • Node.js + Tailwind (Typed)
            </p>
          </div>
        </div>

        {/* Server & DB Connection Badges */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Server Badge */}
          <div
            title={isServerUp ? 'Express backend is online' : 'Express backend is offline. Run: npm run dev:server'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              isServerUp
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Server:</span>
            <span
              className="inline-block w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: isServerUp ? '#10b981' : '#f43f5e' }}
            />
            <span className="capitalize">{isServerUp ? 'Active' : 'Offline'}</span>
          </div>

          {/* Database Badge */}
          <div
            title={
              isDbUp
                ? `MongoDB connected: ${health?.database?.name || 'mern_practice'}`
                : 'MongoDB disconnected. Check server/.env MONGODB_URI'
            }
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              isDbUp
                ? 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden md:inline">MongoDB:</span>
            <span
              className="inline-block w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: isDbUp ? '#14b8a6' : '#f59e0b' }}
            />
            <span className="capitalize">{isDbUp ? 'Connected' : 'Disconnected'}</span>
          </div>

          {/* Seed Button */}
          <button
            onClick={onSeed}
            disabled={seeding || !isDbUp}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isDbUp
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600 shadow-sm'
                : 'bg-slate-900/50 text-slate-500 border-slate-800 cursor-not-allowed'
            }`}
            title="Populate starter tasks to practice with"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-400 ${seeding ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Seed Data</span>
          </button>

          {/* Practice Guide / Docs */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/50 transition-all"
            title="View API routes and practice challenges"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Practice Guide</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors"
            title="Refresh status & data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
