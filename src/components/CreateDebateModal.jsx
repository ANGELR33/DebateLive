import React, { useState } from 'react';

const AVATARS = ['🙋‍♂️', '🙋‍♀️', '👨‍💻', '👩‍💻', '👨‍💼', '👩‍💼', '🎨', '🧠', '🔬', '🎙️', '⚖️', '🌍'];

export default function CreateDebateModal({ isOpen, onClose, onCreate }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('technology');
  const [type, setType] = useState('live'); // 'live' or 'scheduled'
  const [scheduledFor, setScheduledFor] = useState('');
  const [creatorName, setCreatorName] = useState('Me (Host)');
  const [creatorAvatar, setCreatorAvatar] = useState('🎙️');
  const [creatorStance, setCreatorStance] = useState('');
  const [creatorDetails, setCreatorDetails] = useState('');
  const [nuances, setNuances] = useState([]);
  const [currentNuance, setCurrentNuance] = useState('');

  const addNuance = (e) => {
    e.preventDefault();
    if (currentNuance.trim() && !nuances.some(n => n.text.toLowerCase() === currentNuance.trim().toLowerCase())) {
      setNuances([...nuances, { text: currentNuance.trim(), completed: false }]);
      setCurrentNuance('');
    }
  };

  const removeNuance = (idx) => {
    setNuances(nuances.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !creatorStance.trim()) return;
    if (type === 'scheduled' && !scheduledFor) return;
    if (nuances.length === 0) return;

    const debateData = {
      title: title.trim(),
      category,
      type,
      status: type === 'live' ? 'waiting' : 'open',
      creator: {
        name: creatorName.trim(),
        avatar: creatorAvatar,
        stance: creatorStance.trim(),
        details: creatorDetails.trim()
      },
      opponent: null,
      spectators: 0,
      nuances,
      createdAt: new Date().toISOString()
    };

    if (type === 'scheduled') {
      debateData.scheduledFor = new Date(scheduledFor).toISOString();
      debateData.applications = [];
    }

    onCreate(debateData);
    onClose();

    // Reset Form
    setTitle('');
    setCategory('technology');
    setType('live');
    setScheduledFor('');
    setCreatorStance('');
    setCreatorDetails('');
    setNuances([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-all border border-0 border-white/5 cursor-pointer text-sm"
        >
          ✕
        </button>

        <h2 className="font-extrabold text-xl md:text-2xl text-slate-100 mb-2">
          Host a New Debate
        </h2>
        <p className="text-xs text-indigo-400 font-semibold tracking-wider uppercase mb-6">
          Set the stage for intellectual clash
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Topic */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
              1. Debate Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-300">Debate Topic Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Does AI suppress human creativity?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-300">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
                >
                  <option value="technology">Technology</option>
                  <option value="philosophy">Philosophy</option>
                  <option value="society">Society</option>
                  <option value="science">Science</option>
                  <option value="religion">Religion & Ethics</option>
                  <option value="business">Business & Economy</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-300">Debate Type *</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setType('live')}
                    className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                      type === 'live'
                        ? 'bg-indigo-600 border-indigo-400 text-white'
                        : 'bg-slate-950 border-white/10 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    ⚡ Go Live Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('scheduled')}
                    className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                      type === 'scheduled'
                        ? 'bg-purple-600 border-purple-400 text-white'
                        : 'bg-slate-950 border-white/10 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    📅 Schedule
                  </button>
                </div>
              </div>

              {type === 'scheduled' && (
                <div className="space-y-2 text-left animate-slide-in">
                  <label className="text-xs font-bold text-slate-300">Schedule Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Creator Stance */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
              2. Your Stance as Creator
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-300">Avatar</label>
                <div className="grid grid-cols-6 gap-1 p-2 bg-slate-950 border border-white/10 rounded-xl max-h-[105px] overflow-y-auto">
                  {AVATARS.map(avatar => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setCreatorAvatar(avatar)}
                      className={`text-lg p-1 hover:bg-white/10 rounded-lg transition-all ${
                        creatorAvatar === avatar ? 'bg-white/15 scale-110 border border-indigo-500/40' : 'border border-transparent'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-slate-300">Your Position/Stance Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anti-AI Dominance / Pro-Human Art"
                    value={creatorStance}
                    onChange={(e) => setCreatorStance(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-slate-300">Quick Stance Context (Optional)</label>
                  <input
                    type="text"
                    placeholder="Briefly state your core argument..."
                    value={creatorDetails}
                    onChange={(e) => setCreatorDetails(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Nuances List Builder */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
              3. Specific Points to Discuss (At least 1)
            </h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Add sub-topics or specific questions that must be addressed during this debate.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Economic impact on working human designers"
                value={currentNuance}
                onChange={(e) => setCurrentNuance(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addNuance(e)}
                className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={addNuance}
                className="px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl border border-white/10 shadow-lg active:scale-95 transition-all"
              >
                + Add Point
              </button>
            </div>

            {/* Added Nuances Display */}
            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
              {nuances.length === 0 ? (
                <div className="text-center py-4 border border-dashed border-white/5 rounded-xl text-xs text-slate-500">
                  No discussion points added yet.
                </div>
              ) : (
                nuances.map((nuance, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-950 border border-white/5 rounded-xl animate-slide-in text-left"
                  >
                    <span className="text-xs text-slate-300 flex-1">
                      <span className="text-indigo-400 font-bold mr-2">{idx + 1}.</span>
                      {nuance.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeNuance(idx)}
                      className="text-xs text-rose-400 hover:text-rose-300 bg-transparent border-0 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 border-t border-white/5 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white font-bold text-xs rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !creatorStance.trim() || nuances.length === 0 || (type === 'scheduled' && !scheduledFor)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-indigo-900/40 disabled:to-purple-900/40 disabled:text-slate-500 text-white font-extrabold text-xs rounded-xl border border-white/15 disabled:border-transparent transition-all shadow-lg active:scale-95 disabled:pointer-events-none"
            >
              Create Debate Stage
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
