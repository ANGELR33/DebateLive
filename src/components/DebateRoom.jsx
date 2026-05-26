import { useEffect } from 'react';

export default function DebateRoom({ debate, viewerRole, onUpdateDebate, addToast }) {
  const playBeep = (freq = 587.33, duration = 0.15) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const audioCtx = new AudioContext();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';

      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('La API de audio falló', e);
    }
  };

  useEffect(() => {
    let timer;
    if (debate.status === 'active') {
      timer = setInterval(() => {
        const newTime = Math.max(0, debate.timeRemaining - 1);

        if (newTime <= 10 && newTime > 0 && newTime !== debate.timeRemaining) {
          playBeep(newTime <= 3 ? 698.46 : 587.33, newTime <= 3 ? 0.25 : 0.15);
        }

        if (newTime === 0) {
          playBeep(293.66, 0.4);
          const nextSpeaker = debate.activeSpeaker === 'creator' ? 'opponent' : 'creator';
          onUpdateDebate({
            ...debate,
            timeRemaining: 120,
            activeSpeaker: nextSpeaker
          });
          addToast({
            type: 'info',
            title: 'Turno agotado',
            message: `El micrófono pasó a ${nextSpeaker === 'creator' ? debate.creator.name : debate.opponent.name}.`
          });
        } else {
          onUpdateDebate({
            ...debate,
            timeRemaining: newTime
          });
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [debate, onUpdateDebate, addToast]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getViewerName = () => {
    if (viewerRole === 'host') return debate.creator.name;
    if (viewerRole === 'opponent') return debate.opponent?.name || 'Retador';
    return 'Espectador';
  };

  const viewerName = getViewerName();
  const isActive = debate.status === 'active';
  const isWaitingLive = debate.type === 'live' && debate.status === 'waiting';
  const turnTime = debate.timeRemaining || 120;

  const handleToggleSpeaker = () => {
    const nextSpeaker = debate.activeSpeaker === 'creator' ? 'opponent' : 'creator';
    playBeep(880, 0.1);
    onUpdateDebate({
      ...debate,
      activeSpeaker: nextSpeaker,
      timeRemaining: 120
    });
    addToast({
      type: 'info',
      title: 'Cambio de turno',
      message: `El micrófono pasó a ${nextSpeaker === 'creator' ? debate.creator.name : debate.opponent.name}.`
    });
  };

  const handleToggleNuance = (idx) => {
    const updatedNuances = [...debate.nuances];
    updatedNuances[idx].completed = !updatedNuances[idx].completed;
    onUpdateDebate({
      ...debate,
      nuances: updatedNuances
    });
  };

  return (
    <div className="flex-1 flex flex-col gap-6 p-6">
      {isActive || isWaitingLive ? (
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900/40 p-4 flex-1 h-[400px] md:h-full min-h-[380px] shadow-2xl flex flex-col justify-stretch">
          {isWaitingLive && (
            <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-2xl border border-amber-500/20 bg-amber-950/30 px-4 py-3 text-left">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-300">Sala previa en vivo</p>
                <p className="text-xs font-semibold text-slate-300">
                  El anfitrión ya puede transmitir mientras se espera un oponente.
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Turno abierto
              </span>
            </div>
          )}
          <iframe
            src={`https://meet.jit.si/debate-arena-${debate.id}#userInfo.displayName="${viewerName}"&config.prejoinPageEnabled=false&config.startWithAudioMuted=true&config.startWithVideoMuted=false`}
            allow="camera; microphone; display-capture; autoplay"
            className="w-full h-full border-0 rounded-2xl bg-slate-950"
            title="Escenario de debate en vivo"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch flex-1">
          <div className="relative rounded-3xl overflow-hidden border-2 transition-all duration-300 flex flex-col justify-between p-6 border-indigo-500 bg-indigo-950/20 shadow-2xl shadow-indigo-500/10">
            <div className="absolute top-4 left-4 bg-indigo-500 text-slate-950 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 shadow-md">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-950 animate-pulse"></span>
              Anfitrión
            </div>

            <div className="h-[240px] md:h-full min-h-[220px] rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center relative overflow-hidden group shadow-inner">
              <div className="flex flex-col items-center gap-4 animate-float">
                <span className="text-6xl filter drop-shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  {debate.creator.avatar}
                </span>
                <div className="text-center">
                  <h4 className="text-sm font-extrabold text-slate-200">{debate.creator.name}</h4>
                  <p className="text-[10px] text-indigo-400 font-bold bg-indigo-950/50 px-2 py-0.5 rounded-md border border-indigo-500/10 mt-1 uppercase">
                    {debate.creator.stance}
                  </p>
                </div>
                <div className="flex items-center gap-1 h-6 mt-2">
                  <span className="w-1 bg-indigo-500 rounded-full animate-audio-wave h-4 delay-75"></span>
                  <span className="w-1 bg-indigo-500 rounded-full animate-audio-wave h-6 delay-150"></span>
                  <span className="w-1 bg-indigo-500 rounded-full animate-audio-wave h-3 delay-0"></span>
                  <span className="w-1 bg-indigo-500 rounded-full animate-audio-wave h-5 delay-200"></span>
                  <span className="w-1 bg-indigo-500 rounded-full animate-audio-wave h-2 delay-100"></span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-slate-900/40 transition-all duration-300 flex flex-col justify-between p-6">
            <div className="h-[240px] md:h-full min-h-[220px] rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center relative overflow-hidden group shadow-inner">
              <div className="text-center p-6 flex flex-col items-center gap-3">
                <span className="text-5xl text-slate-700 animate-pulse">👤</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-500 italic">Turno abierto</h4>
                  <p className="text-xs text-slate-600 mt-1 max-w-[200px]">
                    Esperando que un oponente entre al escenario. Postúlate desde otra pestaña para unirte.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-900/60 backdrop-blur border border-white/5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 text-left">
          <span className="text-2xl">⏳</span>
          <div>
            <h5 className="text-[10px] text-slate-500 uppercase tracking-widest font-black leading-none">Cuenta regresiva:</h5>
            <p className="text-2xl font-black text-slate-100 mt-1 font-mono tracking-tight">
              {formatTime(turnTime)}
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-6 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              turnTime <= 10
                ? 'bg-rose-500 animate-pulse'
                : turnTime <= 30
                  ? 'bg-amber-500'
                  : 'bg-indigo-500'
            }`}
            style={{ width: `${(turnTime / 120) * 100}%` }}
          />
        </div>

        {debate.status === 'active' ? (
          <button
            onClick={handleToggleSpeaker}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs rounded-xl shadow-lg border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Pasar micrófono
          </button>
        ) : (
          <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider bg-amber-950/30 px-4 py-2.5 rounded-xl border border-amber-500/20">
            Esperando oponente para iniciar la cuenta del debate...
          </div>
        )}
      </div>

      <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl shadow-xl">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-3 mb-4 text-left">
          Puntos de choque del debate
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {debate.nuances.map((nuance, idx) => (
            <div
              key={idx}
              onClick={() => handleToggleNuance(idx)}
              className={`p-4 border rounded-2xl cursor-pointer transition-all flex items-start gap-3 text-left ${
                nuance.completed
                  ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                  : 'bg-slate-950/50 border-white/5 hover:border-white/10 text-slate-400'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs font-bold select-none ${
                  nuance.completed
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/10'
                    : 'border-white/10 bg-transparent text-transparent'
                }`}
              >
                ✓
              </div>
              <div className="flex-1">
                <h5 className={`text-xs font-bold leading-tight ${nuance.completed ? 'text-emerald-300' : 'text-slate-300'}`}>
                  {nuance.text}
                </h5>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">
                  {nuance.completed ? 'Completado' : 'En debate'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
