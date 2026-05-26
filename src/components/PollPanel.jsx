import { useState } from 'react';

export default function PollPanel({ debateId, poll, onVote }) {
  const [votedIdx, setVotedIdx] = useState(null);

  if (!poll) {
    return (
      <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl text-center text-xs text-slate-500 italic shadow-xl">
        No hay encuestas activas para este debate.
      </div>
    );
  }

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  const getPercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const handleVoteSubmit = (idx) => {
    setVotedIdx(idx);
    onVote(debateId, idx);
  };

  // Simula votos dinámicos de la audiencia.
  const handleSimulateVote = () => {
    const randomIdx = Math.floor(Math.random() * poll.options.length);
    onVote(debateId, randomIdx);
  };

  const hasVoted = votedIdx !== null;

  return (
    <div className="bg-slate-900/40 border border-white/5 p-5 rounded-3xl shadow-xl flex flex-col justify-between text-left h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">
              Encuesta de audiencia
            </h3>
          </div>
          
          <button
            onClick={handleSimulateVote}
            className="text-[10px] text-slate-500 hover:text-slate-300 font-bold bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg border border-transparent hover:border-white/5 transition-all cursor-pointer select-none"
          >
            Simular voto
          </button>
        </div>

        {/* Question */}
        <h4 className="text-xs font-extrabold text-slate-300 mb-4 leading-normal">
          {poll.question}
        </h4>

        {/* Options List */}
        <div className="space-y-3">
          {poll.options.map((option, idx) => {
            const percent = getPercentage(option.votes);
            
            return (
              <div key={idx} className="relative">
                {hasVoted ? (
                  /* Voted Results State */
                  <div className="p-3.5 bg-slate-950 border border-white/5 rounded-2xl relative overflow-hidden flex items-center justify-between gap-4 animate-slide-in">
                    {/* Fill Bar behind text */}
                    <div
                      className="absolute inset-y-0 left-0 bg-indigo-500/10 transition-all duration-1000 ease-out"
                      style={{ width: `${percent}%` }}
                    />
                    
                    <span className="text-xs text-slate-300 font-bold z-10 flex items-center gap-1.5 leading-snug">
                      {votedIdx === idx && <span className="text-indigo-400">✓</span>}
                      {option.label}
                    </span>
                    <span className="text-xs font-black text-indigo-400 z-10 font-mono">
                      {percent}% <span className="text-[10px] text-slate-600 font-bold">({option.votes})</span>
                    </span>
                  </div>
                ) : (
                  /* Active Voting Button */
                  <button
                    onClick={() => handleVoteSubmit(idx)}
                    className="w-full text-left p-3.5 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/30 text-xs text-slate-300 font-bold rounded-2xl transition-all active:scale-99 cursor-pointer flex items-center justify-between"
                  >
                    <span>{option.label}</span>
                    <span className="text-[10px] text-slate-600 font-bold">Votar →</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info footer */}
      <div className="border-t border-white/5 pt-4 mt-5 flex items-center justify-between text-[10px] text-slate-500">
        <span>Estado: <span className="text-indigo-400 font-semibold uppercase">Recolectando votos</span></span>
        <span className="font-bold">{totalVotes} votos</span>
      </div>
    </div>
  );
}
