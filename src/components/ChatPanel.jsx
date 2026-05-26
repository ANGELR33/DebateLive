import { useState, useEffect, useRef } from 'react';

const CROWD_NAMES = ['Oliver', 'Maya', 'Liam', 'Zoe', 'Noah', 'Ava', 'Ethan', 'Isabella', 'Mateo', 'Sofía'];
const CROWD_AVATARS = ['🧑‍🚀', '👩‍🚀', '🕵️‍♂️', '🕵️‍♀️', '🧑‍🎨', '👩‍💻', '👨‍💻', '🧙‍♂️', '🧙‍♀️', '🧑‍🍳'];
const CROWD_OPINIONS = [
  'Ese punto es bastante sólido.',
  'Estoy de acuerdo con la postura del anfitrión.',
  '¿Y qué pasa con los costos económicos?',
  'Esto se está poniendo intenso.',
  'No lo había pensado de esa manera.',
  'El oponente está planteando objeciones válidas.',
  'Ambos ponentes están argumentando muy bien.',
  'Sigo indeciso, espero que el próximo punto lo aclare.',
  'El trabajo remoto ahorra tiempo, pero el aislamiento pesa.',
  'Regular demasiado puede frenar la innovación.',
  'El arte con IA remezcla patrones; falta intención humana.'
];

export default function ChatPanel({ chatMessages, onSendMessage }) {
  const [inputText, setInputText] = useState('');
  const [userName, setUserName] = useState('Espectador');
  const [userAvatar, setUserAvatar] = useState('🙋‍♂️');
  const [simulateCrowd, setSimulateCrowd] = useState(true);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  useEffect(() => {
    let interval;
    if (simulateCrowd) {
      interval = setInterval(() => {
        const name = CROWD_NAMES[Math.floor(Math.random() * CROWD_NAMES.length)];
        const avatar = CROWD_AVATARS[Math.floor(Math.random() * CROWD_AVATARS.length)];
        const text = CROWD_OPINIONS[Math.floor(Math.random() * CROWD_OPINIONS.length)];

        onSendMessage({ sender: name, avatar, text });
      }, 25000);
    }
    return () => clearInterval(interval);
  }, [simulateCrowd, onSendMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage({
      sender: userName.trim(),
      avatar: userAvatar,
      text: inputText.trim()
    });

    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2">
          <span className="text-lg">💬</span>
          <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">
            Chat de espectadores
          </h3>
        </div>

        <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-500 font-bold hover:text-slate-300 transition-colors select-none">
          <input
            type="checkbox"
            checked={simulateCrowd}
            onChange={(e) => setSimulateCrowd(e.target.checked)}
            className="rounded border-white/10 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer"
          />
          <span>Simular público</span>
        </label>
      </div>

      <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[350px] md:max-h-[500px]">
        {chatMessages.length === 0 ? (
          <div className="text-center py-20 text-xs text-slate-500 italic">
            El chat está en silencio. Escribe el primer mensaje.
          </div>
        ) : (
          chatMessages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-2.5 animate-slide-in text-left">
              <span className="text-lg mt-0.5">{msg.avatar}</span>
              <div className="flex-1 bg-white/3 border border-white/5 px-3.5 py-2.5 rounded-2xl rounded-tl-none">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h5 className="text-[11px] font-black text-slate-300">{msg.sender}</h5>
                  <span className="text-[9px] text-slate-600">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{msg.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={chatBottomRef} />
      </div>

      <div className="p-4 border-t border-white/5 bg-slate-950/60 space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Apodo"
            className="w-24 bg-slate-900 border border-white/5 hover:border-white/10 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-300 font-bold focus:outline-none focus:border-indigo-500/50"
          />
          <div className="flex gap-0.5 overflow-x-auto max-w-[150px] bg-slate-900 border border-white/5 p-1 rounded-xl">
            {['🙋‍♂️', '🙋‍♀️', '🕵️‍♂️', '🧙‍♂️', '👽', '🤖'].map((av) => (
              <button
                key={av}
                type="button"
                onClick={() => setUserAvatar(av)}
                className={`text-xs p-0.5 hover:bg-white/10 rounded transition-all ${userAvatar === av ? 'bg-white/15 scale-110' : ''}`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Expresa tu postura..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-950/40 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-95 border border-white/10 disabled:border-transparent disabled:pointer-events-none cursor-pointer"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
