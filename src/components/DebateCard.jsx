export default function DebateCard({ debate, onEnterDebate, onOpenApply, onOpenManageRequests }) {
  const categoryLabels = {
    technology: 'Tecnología',
    philosophy: 'Filosofía',
    society: 'Sociedad',
    science: 'Ciencia',
    religion: 'Religión y ética',
    business: 'Negocios'
  };
  const isLive = debate.type === 'live' && debate.status === 'active';
  const isWaiting = debate.type === 'live' && debate.status === 'waiting';
  const isScheduled = debate.type === 'scheduled';
  const pendingApps = debate.applications?.filter((app) => app.status === 'pending') || [];
  const statusLabel = isLive ? 'En vivo' : isWaiting ? 'Turno abierto' : 'Programado';
  const scheduledTime = debate.scheduledFor
    ? `${new Date(debate.scheduledFor).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })} ${new Date(debate.scheduledFor).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`
    : null;

  return (
    <article className={`debate-docket ${isLive ? 'is-live' : ''} ${isWaiting ? 'is-waiting' : ''}`}>
      <div className="docket-topline">
        <span className="topic-chip">{categoryLabels[debate.category] || debate.category}</span>
        <span className="state-chip">{statusLabel}</span>
      </div>

      <h3 className="docket-title">{debate.title}</h3>

      <div className="argument-lane">
        <div className="speaker-card">
          <span className="speaker-avatar">{debate.creator.avatar}</span>
          <span>
            <strong>{debate.creator.name}</strong>
            <small>{debate.creator.stance}</small>
          </span>
        </div>
        <span className="versus-token">VS</span>
        <div className={`speaker-card ${debate.opponent ? '' : 'is-empty'}`}>
          {debate.opponent ? (
            <>
              <span className="speaker-avatar">{debate.opponent.avatar}</span>
              <span>
                <strong>{debate.opponent.name}</strong>
                <small>{debate.opponent.stance}</small>
              </span>
            </>
          ) : (
            <>
              <span className="speaker-avatar empty-seat">?</span>
              <span>
                <strong>Turno abierto</strong>
                <small>Esperando oponente</small>
              </span>
            </>
          )}
        </div>
      </div>

      <div className="clash-list">
        <span className="micro-label">Puntos de choque</span>
        {debate.nuances.slice(0, 3).map((nuance, idx) => (
          <div key={idx} className="clash-row">
            <span className={nuance.completed ? 'clash-check is-done' : 'clash-check'}></span>
            <span>{nuance.text}</span>
          </div>
        ))}
        {debate.nuances.length > 3 && (
          <p className="clash-more">+{debate.nuances.length - 3} puntos más</p>
        )}
      </div>

      <div className="docket-footer">
        {isLive && (
          <button onClick={() => onEnterDebate(debate.id)} className="docket-primary" type="button">
            Ver debate
            <span>{debate.spectators} mirando</span>
          </button>
        )}

        {isWaiting && (
          <div className="split-actions">
            <button onClick={() => onEnterDebate(debate.id)} className="docket-secondary" type="button">
              Espectar <span>{debate.spectators}</span>
            </button>
            <button onClick={() => onOpenApply(debate.id)} className="docket-primary amber" type="button">
              Unirse
            </button>
          </div>
        )}

        {isScheduled && (
          <div className="scheduled-actions">
            <div className="schedule-line">
              <span>Hora</span>
              <strong>{scheduledTime}</strong>
            </div>
            <div className="split-actions">
              <button onClick={() => onOpenManageRequests(debate.id)} className="docket-secondary" type="button">
                Postulaciones {pendingApps.length > 0 && <span>{pendingApps.length}</span>}
              </button>
              {!debate.opponent ? (
                <button onClick={() => onOpenApply(debate.id)} className="docket-primary" type="button">
                  Postularse
                </button>
              ) : (
                <button disabled className="docket-secondary is-disabled" type="button">
                  Emparejado
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
