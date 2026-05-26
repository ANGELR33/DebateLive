import { useState } from 'react';

const AVATARS = ['🙋‍♂️', '🙋‍♀️', '👨‍💻', '👩‍💻', '👨‍💼', '👩‍💼', '🎨', '🧠', '🔬', '🎙️', '⚖️', '🌍'];

export default function ApplyModal({ isOpen, debate, onClose, onSubmit }) {
  const [name, setName] = useState('Oponente invitado');
  const [avatar, setAvatar] = useState('🧠');
  const [stance, setStance] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  if (!isOpen || !debate) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !stance.trim()) return;

    const applicantData = {
      id: 'app-' + Date.now(),
      name: name.trim(),
      avatar,
      stance: stance.trim(),
      coverLetter: coverLetter.trim(),
      status: 'pending'
    };

    onSubmit(debate.id, applicantData);
    onClose();

    setName('Oponente invitado');
    setAvatar('🧠');
    setStance('');
    setCoverLetter('');
  };

  const isLiveWaiting = debate.type === 'live' && debate.status === 'waiting';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-all border border-0 border-white/5 cursor-pointer text-sm"
        >
          ✕
        </button>

        <h2 className="font-extrabold text-xl text-slate-100 mb-1 text-left">
          {isLiveWaiting ? 'Entrar al escenario' : 'Postularse como oponente'}
        </h2>
        <p className="text-xs text-indigo-400 font-semibold tracking-wider uppercase mb-5 text-left">
          {isLiveWaiting ? 'Debate en vivo frente a la audiencia' : 'Presenta tu postura al creador del debate'}
        </p>

        {/* Topic details */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 mb-6 text-left">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Tema del debate:</p>
          <h4 className="text-sm font-bold text-slate-200 mb-3">{debate.title}</h4>

          <div className="flex items-center gap-2 border-t border-white/5 pt-3">
            <span className="text-lg">{debate.creator.avatar}</span>
            <div>
              <p className="text-[9px] text-slate-500 leading-none">Creador: {debate.creator.name}</p>
              <p className="text-xs font-bold text-indigo-400 mt-0.5">Postura: {debate.creator.stance}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-slate-300">Avatar</label>
              <div className="grid grid-cols-4 gap-1 p-2 bg-slate-950 border border-white/10 rounded-xl max-h-[105px] overflow-y-auto">
                {AVATARS.map(av => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setAvatar(av)}
                    className={`text-lg p-1 hover:bg-white/10 rounded-lg transition-all ${
                      avatar === av ? 'bg-white/15 scale-110 border border-indigo-500/40' : 'border border-transparent'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2 space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Tu nombre visible *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Tu postura opuesta *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Arte con IA / Herramienta para creadores"
                  value={stance}
                  onChange={(e) => setStance(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-xs font-bold text-slate-300">
              {isLiveWaiting ? 'Preséntate (opcional)' : '¿Por qué deberían debatir contigo? *'}
            </label>
            <textarea
              required={!isLiveWaiting}
              rows={3}
              placeholder={
                isLiveWaiting
                  ? 'Escribe una presentación breve antes de entrar...'
                  : 'Resume tu experiencia y los argumentos que quieres presentar...'
              }
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600 resize-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-white/5 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white font-bold text-xs rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !stance.trim() || (!isLiveWaiting && !coverLetter.trim())}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-indigo-900/40 disabled:to-purple-900/40 disabled:text-slate-500 text-white font-extrabold text-xs rounded-xl border border-white/15 disabled:border-transparent transition-all shadow-lg active:scale-95 disabled:pointer-events-none"
            >
              {isLiveWaiting ? 'Entrar en vivo' : 'Enviar postulación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
