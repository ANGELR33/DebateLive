import { useState } from 'react';

const AVATARS = ['🧑‍💼', '👩‍💼', '🧑‍💻', '👩‍💻', '🧑‍🔬', '👩‍🔬', '🎨', '🧠', '🔬', '🎙️', '⚖️', '🌍'];

export default function CreateDebateModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('technology');
  const [type, setType] = useState('live');
  const [scheduledFor, setScheduledFor] = useState('');
  const [creatorName] = useState('Yo (Anfitrión)');
  const [creatorAvatar, setCreatorAvatar] = useState('🎙️');
  const [creatorStance, setCreatorStance] = useState('');
  const [creatorDetails, setCreatorDetails] = useState('');
  const [nuances, setNuances] = useState([]);
  const [currentNuance, setCurrentNuance] = useState('');

  if (!isOpen) return null;

  const canCreate = title.trim() && creatorStance.trim() && nuances.length > 0 && (type === 'live' || scheduledFor);

  const addNuance = (e) => {
    e.preventDefault();
    const text = currentNuance.trim();
    if (text && !nuances.some((n) => n.text.toLowerCase() === text.toLowerCase())) {
      setNuances([...nuances, { text, completed: false }]);
      setCurrentNuance('');
    }
  };

  const removeNuance = (idx) => {
    setNuances(nuances.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canCreate) return;

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

    setTitle('');
    setCategory('technology');
    setType('live');
    setScheduledFor('');
    setCreatorStance('');
    setCreatorDetails('');
    setNuances([]);
  };

  return (
    <div className="modal-backdrop">
      <div className="debate-modal create-debate-modal">
        <button onClick={onClose} className="modal-close" type="button" aria-label="Cerrar">
          ×
        </button>

        <div className="modal-heading">
          <span className="deck-eyebrow">Nueva sala de debate</span>
          <h2>Prepara el escenario.</h2>
          <p>Define el tema, tu postura y los puntos exactos que la audiencia debe seguir.</p>
        </div>

        <form onSubmit={handleSubmit} className="create-form">
          <section className="form-block">
            <div className="form-block-title">
              <span>01</span>
              <h3>Configuración del debate</h3>
            </div>

            <div className="field-grid two">
              <label className="field">
                <span>Título del tema</span>
                <input
                  type="text"
                  required
                  placeholder="¿La IA reduce la creatividad humana?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>

              <label className="field">
                <span>Categoría</span>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="technology">Tecnología</option>
                  <option value="philosophy">Filosofía</option>
                  <option value="society">Sociedad</option>
                  <option value="science">Ciencia</option>
                  <option value="religion">Religión y ética</option>
                  <option value="business">Negocios y economía</option>
                </select>
              </label>
            </div>

            <div className="field-grid two compact">
              <div className="field">
                <span>Modo de sala</span>
                <div className="segmented-control">
                  <button
                    type="button"
                    onClick={() => setType('live')}
                    className={type === 'live' ? 'active' : ''}
                  >
                    En vivo ahora
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('scheduled')}
                    className={type === 'scheduled' ? 'active' : ''}
                  >
                    Programado
                  </button>
                </div>
              </div>

              {type === 'scheduled' && (
                <label className="field animate-slide-in">
                  <span>Fecha y hora</span>
                  <input
                    type="datetime-local"
                    required
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                  />
                </label>
              )}
            </div>
          </section>

          <section className="form-block">
            <div className="form-block-title">
              <span>02</span>
              <h3>Postura del anfitrión</h3>
            </div>

            <div className="host-stance-layout">
              <div className="field avatar-field">
                <span>Avatar</span>
                <div className="avatar-grid">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setCreatorAvatar(avatar)}
                      className={creatorAvatar === avatar ? 'selected' : ''}
                      aria-label={`Usar avatar ${avatar}`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field-stack">
                <label className="field">
                  <span>Título de la postura</span>
                  <input
                    type="text"
                    required
                    placeholder="Contra el dominio de la IA / A favor del arte humano"
                    value={creatorStance}
                    onChange={(e) => setCreatorStance(e.target.value)}
                  />
                </label>

                <label className="field">
                  <span>Argumento central <small>opcional</small></span>
                  <input
                    type="text"
                    placeholder="Resume la tesis que vas a defender."
                    value={creatorDetails}
                    onChange={(e) => setCreatorDetails(e.target.value)}
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="form-block">
            <div className="form-block-title">
              <span>03</span>
              <h3>Puntos de choque</h3>
            </div>

            <div className="nuance-builder">
              <label className="field">
                <span>Lista para la audiencia</span>
                <div className="nuance-input-row">
                  <input
                    type="text"
                    placeholder="Impacto económico en diseñadores humanos"
                    value={currentNuance}
                    onChange={(e) => setCurrentNuance(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addNuance(e)}
                  />
                  <button type="button" onClick={addNuance} disabled={!currentNuance.trim()}>
                    Agregar punto
                  </button>
                </div>
              </label>

              <div className="nuance-list">
                {nuances.length === 0 ? (
                  <p>Aún no hay puntos de discusión.</p>
                ) : (
                  nuances.map((nuance, idx) => (
                    <div key={idx} className="nuance-item">
                      <span>{idx + 1}</span>
                      <strong>{nuance.text}</strong>
                      <button type="button" onClick={() => removeNuance(idx)} aria-label="Eliminar punto">
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="secondary-action">
              Cancelar
            </button>
            <button type="submit" disabled={!canCreate} className="primary-action">
              Crear escenario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
