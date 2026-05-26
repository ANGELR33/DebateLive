import React from 'react';

export default function ManageRequestsModal({ isOpen, debate, onClose, onApprove, onReject }) {
  if (!isOpen || !debate) return null;

  const applications = debate.applications || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-all border border-0 border-white/5 cursor-pointer text-sm"
        >
          ✕
        </button>

        <h2 className="font-extrabold text-xl text-slate-100 mb-1 text-left">
          Debate Applications
        </h2>
        <p className="text-xs text-indigo-400 font-semibold tracking-wider uppercase mb-5 text-left">
          Review opposing stances and choose your opponent
        </p>

        {/* Topic Info */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 mb-6 text-left">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Debate Topic:</p>
          <h4 className="text-sm font-bold text-slate-200 mb-2">{debate.title}</h4>
          <p className="text-xs text-slate-400 leading-tight">
            Your Stance: <span className="text-indigo-400 font-bold">{debate.creator.stance}</span>
          </p>
        </div>

        {/* Applications List */}
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
          {applications.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-white/5 rounded-2xl text-xs text-slate-500">
              No applications submitted yet. Apply from another tab to test!
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="p-5 bg-slate-950 border border-white/5 rounded-2xl text-left space-y-3 hover:border-white/10 transition-all animate-slide-in"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{app.avatar}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{app.name}</h4>
                      <p className="text-[10px] text-rose-400 font-semibold">Stance: {app.stance}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onReject(debate.id, app.id)}
                      className="px-3 py-1.5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 border border-rose-500/10 hover:border-rose-500/30 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => onApprove(debate.id, app)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-[10px] shadow-lg active:scale-95 transition-all cursor-pointer border border-emerald-400/20"
                    >
                      ✓ Approve Stance
                    </button>
                  </div>
                </div>

                {app.coverLetter && (
                  <div className="p-3 bg-white/3 border border-white/5 rounded-xl text-slate-400 text-xs leading-relaxed italic">
                    "{app.coverLetter}"
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end border-t border-white/5 pt-4 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer border border-white/5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
