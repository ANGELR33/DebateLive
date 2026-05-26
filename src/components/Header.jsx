import React from 'react';

export default function Header({ currentDebate, onBackToDashboard, liveCount, spectatorCount }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 cursor-pointer" onClick={onBackToDashboard}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-black text-xl tracking-tighter shadow-lg shadow-indigo-500/20">
          ⚡
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
            DEBATE ARENA
          </h1>
          <p className="text-[10px] text-indigo-400 font-semibold tracking-widest uppercase">
            Live Clash Platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Real-time Status Indicator */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400 bg-slate-900/60 border border-white/5 rounded-full px-4 py-1.5 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px]">Sync Active</span>
          </div>

          <div className="h-3 w-px bg-white/10" />

          <div className="flex items-center gap-1.5">
            <span className="text-indigo-400 font-bold">{liveCount}</span>
            <span>Live Clashes</span>
          </div>

          <div className="h-3 w-px bg-white/10" />

          <div className="flex items-center gap-1.5">
            <span className="text-purple-400 font-bold">{spectatorCount}</span>
            <span>Watching</span>
          </div>
        </div>

        {/* Conditional Navigation */}
        {currentDebate && (
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all shadow-lg active:scale-95"
          >
            ← Leave Room
          </button>
        )}

        <div className="flex items-center gap-2 border-l border-white/10 pl-4">
          <div className="w-8 h-8 rounded-full bg-indigo-900/60 border border-indigo-500/30 flex items-center justify-center text-sm shadow">
            👑
          </div>
          <div className="hidden sm:block text-left">
            <h4 className="text-xs font-bold text-slate-200">Me (Host)</h4>
            <p className="text-[9px] text-slate-500">Local Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
