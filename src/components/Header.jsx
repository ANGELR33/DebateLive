export default function Header({ currentDebate, onBackToDashboard, liveCount, spectatorCount, remoteSync }) {
  return (
    <header className="topbar">
      <button className="brand-lockup" onClick={onBackToDashboard} type="button">
        <span className="brand-mark">DL</span>
        <span className="brand-copy">
          <span className="brand-title">DebateLive</span>
          <span className="brand-subtitle">Sala de control de argumentos</span>
        </span>
      </button>

      <div className="topbar-right">
        <div className="signal-board" aria-label="Estado de la plataforma">
          <span className="signal-pill">
            <span className="signal-dot"></span>
            {remoteSync ? 'Nube activa' : 'Local'}
          </span>
          <span><strong>{liveCount}</strong> en vivo</span>
          <span><strong>{spectatorCount}</strong> mirando</span>
        </div>

        {currentDebate && (
          <button onClick={onBackToDashboard} className="room-exit" type="button">
            Salir de la sala
          </button>
        )}

        <div className="host-chip" aria-label="Usuario actual">
          <span className="host-avatar">YO</span>
          <span>
            <strong>Yo (Anfitrión)</strong>
            <small>Admin local</small>
          </span>
        </div>
      </div>
    </header>
  );
}
