import React from 'react';

export default function DebateCard({ debate, onEnterDebate, onOpenApply, onOpenManageRequests }) {
  const categoryIcons = {
    technology: '💻',
    philosophy: '🧠',
    society: '👥',
    science: '🔬',
    religion: '📜',
    business: '📈'
  };

  const isLive = debate.type === 'live' && debate.status === 'active';
  const isWaiting = debate.type === 'live' && debate.status === 'waiting';
  const isScheduled = debate.type === 'scheduled';

  // Count pending applications
  const pendingApps = debate.applications?.filter(app => app.status === 'pending') || [];

  return (
    <div className="relative group rounded-2xl bg-slate-900/40 border border-white/5 p-6 hover:bg-slate-900/60 hover:border-white/10 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:to-pink-500/5 transition-all duration-500 -z-10" />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-4">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-800/40 px-3 py-1 rounded-full border border-white/5 uppercase tracking-wide">
            <span>{categoryIcons[debate.category] || '💬'}</span>
            <span className="text-[10px]">{debate.category}</span>
          </span>

          {isLive && (
            <span className="flex items-center gap-1.5 text-[10px] font-black text-rose-400 bg-rose-950/40 px-3 py-1 rounded-full border border-rose-500/20 uppercase tracking-widest animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
              Live Now
            </span>
          )}

          {isWaiting && (
            <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-400 bg-amber-950/40 px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping"></span>
              Open Stage
            </span>
          )}

          {isScheduled && (
            <span className="flex items-center gap-1.5 text-[10px] font-black text-purple-400 bg-purple-950/40 px-3 py-1 rounded-full border border-purple-500/20 uppercase tracking-widest">
              📅 Scheduled
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-base text-slate-100 mb-4 line-clamp-2 group-hover:text-white transition-colors leading-relaxed">
          {debate.title}
        </h3>

        {/* Nuances Preview */}
        <div className="space-y-1.5 mb-6">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">Points of Clash:</p>
          {debate.nuances.slice(0, 3).map((nuance, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
              <span className="text-indigo-400 mt-0.5">•</span>
              <span className="line-clamp-1 leading-snug">{nuance.text}</span>
            </div>
          ))}
          {debate.nuances.length > 3 && (
            <p className="text-[10px] text-slate-500 pl-3">+{debate.nuances.length - 3} more points</p>
          )}
        </div>
      </div>

      {/* Footer Participants & Action */}
      <div className="border-t border-white/5 pt-4 mt-auto">
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Creator */}
          <div className="flex items-center gap-2">
            <span className="text-xl">{debate.creator.avatar}</span>
            <div className="text-left">
              <h5 className="text-[11px] font-bold text-slate-300 leading-tight">{debate.creator.name}</h5>
              <p className="text-[9px] text-indigo-400 font-medium truncate max-w-[80px]" title={debate.creator.stance}>
                {debate.creator.stance}
              </p>
            </div>
          </div>

          {/* VS */}
          <div className="text-[10px] font-black text-slate-600 bg-slate-950/80 w-6 h-6 rounded-full flex items-center justify-center border border-white/5 shadow-inner">
            VS
          </div>

          {/* Opponent Spot */}
          <div className="flex items-center gap-2">
            {debate.opponent ? (
              <>
                <span className="text-xl">{debate.opponent.avatar}</span>
                <div className="text-left">
                  <h5 className="text-[11px] font-bold text-slate-300 leading-tight">{debate.opponent.name}</h5>
                  <p className="text-[9px] text-rose-400 font-medium truncate max-w-[80px]" title={debate.opponent.stance}>
                    {debate.opponent.stance}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-500 italic text-[11px]">
                <span className="w-5 h-5 rounded-full bg-slate-950 border border-dashed border-slate-700 flex items-center justify-center text-xs">
                  👤
                </span>
                <span>Open Seat</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isLive && (
          <button
            onClick={() => onEnterDebate(debate.id)}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/10 active:scale-98 transition-all flex items-center justify-center gap-1.5 border border-white/10"
          >
            📺 Watch Debate ({debate.spectators} watching)
          </button>
        )}

        {isWaiting && (
          <div className="flex gap-2">
            <button
              onClick={() => onEnterDebate(debate.id)}
              className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all border border-white/5"
            >
              Spectate ({debate.spectators})
            </button>
            <button
              onClick={() => onOpenApply(debate.id)}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-98 border border-amber-400/25"
            >
              🎤 Join Stage
            </button>
          </div>
        )}

        {isScheduled && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span>Time:</span>
              <span className="font-semibold text-slate-300">
                {new Date(debate.scheduledFor).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                {new Date(debate.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onOpenManageRequests(debate.id)}
                className="relative flex-1 py-2 px-3 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all border border-white/5 flex items-center justify-center gap-1.5"
              >
                <span>Applications</span>
                {pendingApps.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-indigo-500 text-white rounded-full text-[9px] font-black leading-none">
                    {pendingApps.length}
                  </span>
                )}
              </button>

              {!debate.opponent ? (
                <button
                  onClick={() => onOpenApply(debate.id)}
                  className="flex-1 py-2 px-3 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 hover:text-white font-bold text-xs rounded-xl border border-indigo-500/20 hover:border-indigo-500/30 transition-all active:scale-98"
                >
                  Apply to Debate
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 py-2 px-3 bg-emerald-950/20 text-emerald-400/80 font-bold text-xs rounded-xl border border-emerald-500/10 cursor-not-allowed"
                >
                  Matched ✓
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
