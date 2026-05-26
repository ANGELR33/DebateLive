import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import DebateCard from './components/DebateCard';
import CreateDebateModal from './components/CreateDebateModal';
import ApplyModal from './components/ApplyModal';
import ManageRequestsModal from './components/ManageRequestsModal';
import DebateRoom from './components/DebateRoom';
import ChatPanel from './components/ChatPanel';
import PollPanel from './components/PollPanel';
import Toast from './components/Toast';
import { CATEGORIES } from './utils/mockData';
import {
  getDebates,
  saveDebates,
  getChatMessages,
  addChatMessage,
  getPoll,
  votePoll,
  savePoll,
  subscribeToSync,
  startRemoteSync,
  isRemoteSyncEnabled
} from './utils/storage';

export default function App() {
  const [debates, setDebates] = useState(() => getDebates());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentDebateId, setCurrentDebateId] = useState(null);
  const [viewerRole, setViewerRole] = useState('spectator');
  const [chatMessages, setChatMessages] = useState([]);
  const [activePoll, setActivePoll] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [focusedDebate, setFocusedDebate] = useState(null);
  const [toasts, setToasts] = useState([]);
  const remoteSync = isRemoteSyncEnabled();

  const addToast = useCallback((toast) => {
    setToasts((prev) => [...prev, { id: 'toast-' + Date.now() + '-' + Math.random(), ...toast }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    startRemoteSync();

    const unsubscribe = subscribeToSync((event) => {
      const { type, payload } = event;

      if (type === 'DEBATES_UPDATED') {
        setDebates(payload);
      } else if (type === 'CHAT_UPDATED') {
        const { debateId, messages } = payload;
        if (debateId === currentDebateId) setChatMessages(messages);
      } else if (type === 'POLL_UPDATED') {
        const { debateId, poll } = payload;
        if (debateId === currentDebateId) setActivePoll(poll);
      }
    });

    return unsubscribe;
  }, [currentDebateId]);

  useEffect(() => {
    if (currentDebateId) {
      queueMicrotask(() => {
        setChatMessages(getChatMessages(currentDebateId));
        setActivePoll(getPoll(currentDebateId));
      });
    }
  }, [currentDebateId]);

  const handleEnterDebate = (debateId, role = 'spectator') => {
    setViewerRole(role);
    setCurrentDebateId(debateId);
  };

  const currentDebate = debates.find((d) => d.id === currentDebateId);

  const handleCreateDebate = (debateData) => {
    const newDebate = {
      id: 'debate-' + Date.now(),
      ...debateData
    };

    if (debateData.type === 'live') {
      newDebate.timeRemaining = 120;
      newDebate.activeSpeaker = 'creator';
      newDebate.spectators = Math.floor(Math.random() * 20) + 5;
    }

    const updatedDebates = [newDebate, ...debates];
    setDebates(updatedDebates);
    saveDebates(updatedDebates);

    addToast({
      type: 'success',
      title: 'Escenario creado',
      message: debateData.type === 'live'
        ? 'Tu sala en vivo está abierta. Los oponentes ya pueden entrar.'
        : 'Tu debate fue programado correctamente.'
    });

    if (debateData.type === 'live') handleEnterDebate(newDebate.id, 'host');
  };

  const handleUpdateDebate = useCallback((updatedDebate) => {
    setDebates((prev) => {
      const updated = prev.map((d) => (d.id === updatedDebate.id ? updatedDebate : d));
      saveDebates(updated);
      return updated;
    });
  }, []);

  const handleApplyToDebate = (debateId, applicantData) => {
    const updated = debates.map((d) => {
      if (d.id !== debateId) return d;

      if (d.type === 'live' && d.status === 'waiting') {
        const updatedDebate = {
          ...d,
          opponent: {
            name: applicantData.name,
            avatar: applicantData.avatar,
            stance: applicantData.stance
          },
          status: 'active',
          timeRemaining: 120,
          activeSpeaker: 'creator',
          spectators: d.spectators + 15
        };

        savePoll(debateId, {
          question: '¿Qué argumento convence más?',
          options: [
            { label: `${d.creator.name} (${d.creator.stance})`, votes: 0 },
            { label: `${applicantData.name} (${applicantData.stance})`, votes: 0 },
            { label: 'Indeciso', votes: 0 }
          ]
        });

        addToast({
          type: 'success',
          title: 'Entraste al escenario',
          message: 'Ya estás en la sala. El debate está EN VIVO.'
        });

        setTimeout(() => handleEnterDebate(debateId, 'opponent'), 100);
        return updatedDebate;
      }

      return {
        ...d,
        applications: [...(d.applications || []), applicantData]
      };
    });

    setDebates(updated);
    saveDebates(updated);

    if (debateId !== currentDebateId) {
      addToast({
        type: 'info',
        title: 'Postulación enviada',
        message: 'Tu solicitud fue enviada al anfitrión.'
      });
    }
  };

  const handleApproveApplicant = (debateId, applicant) => {
    const updated = debates.map((d) => {
      if (d.id !== debateId) return d;

      const updatedDebate = {
        ...d,
        opponent: {
          name: applicant.name,
          avatar: applicant.avatar,
          stance: applicant.stance
        },
        type: 'live',
        status: 'active',
        timeRemaining: 120,
        activeSpeaker: 'creator',
        spectators: Math.floor(Math.random() * 50) + 40,
        applications: d.applications.filter((a) => a.id !== applicant.id)
      };

      savePoll(debateId, {
        question: '¿Qué argumento convence más?',
        options: [
          { label: `${d.creator.name} (${d.creator.stance})`, votes: 0 },
          { label: `${applicant.name} (${applicant.stance})`, votes: 0 },
          { label: 'Indeciso', votes: 0 }
        ]
      });

      return updatedDebate;
    });

    setDebates(updated);
    saveDebates(updated);
    setActiveModal(null);

    addToast({
      type: 'success',
      title: 'Oponente aprobado',
      message: 'El oponente fue elegido. Entrando al debate en vivo.'
    });

    handleEnterDebate(debateId, 'host');
  };

  const handleRejectApplicant = (debateId, applicantId) => {
    const updated = debates.map((d) => {
      if (d.id !== debateId) return d;
      return {
        ...d,
        applications: d.applications.filter((a) => a.id !== applicantId)
      };
    });

    setDebates(updated);
    saveDebates(updated);
    setFocusedDebate(updated.find((d) => d.id === debateId));

    addToast({
      type: 'warning',
      title: 'Solicitud rechazada',
      message: 'La postulación fue eliminada.'
    });
  };

  const handleSendMessage = useCallback((msg) => {
    if (!currentDebateId) return;
    addChatMessage(currentDebateId, msg);
  }, [currentDebateId]);

  const handleVote = (debateId, optionIndex) => {
    const updatedPoll = votePoll(debateId, optionIndex);
    setActivePoll(updatedPoll);
    addToast({
      type: 'success',
      title: 'Voto registrado',
      message: 'Tu opinión quedó registrada en la encuesta.'
    });
  };

  const liveCount = debates.filter((d) => d.type === 'live' && d.status === 'active').length;
  const spectatorCount = debates.reduce((sum, d) => sum + (d.spectators || 0), 0);
  const openSeatCount = debates.filter((d) => d.type === 'live' && d.status === 'waiting').length;
  const applicationCount = debates.reduce(
    (sum, d) => sum + (d.applications?.filter((app) => app.status === 'pending').length || 0),
    0
  );
  const nextScheduledDebate = debates
    .filter((d) => d.type === 'scheduled' && d.scheduledFor)
    .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor))[0];

  const filteredDebates = debates.filter(
    (d) => selectedCategory === 'all' || d.category === selectedCategory
  );

  const liveDebates = filteredDebates.filter((d) => d.type === 'live');
  const scheduledDebates = filteredDebates.filter((d) => d.type === 'scheduled');

  return (
    <div className="flex flex-col min-h-screen">
      <Toast toasts={toasts} removeToast={removeToast} />

      <Header
        currentDebate={currentDebate}
        onBackToDashboard={() => {
          setCurrentDebateId(null);
          setViewerRole('spectator');
        }}
        liveCount={liveCount}
        spectatorCount={spectatorCount}
        remoteSync={remoteSync}
      />

      <main className="flex-1 flex flex-col app-canvas">
        {currentDebate ? (
          <div className="live-layout flex-1 flex flex-col md:flex-row items-stretch gap-6 p-6 max-w-7xl w-full mx-auto animate-slide-in">
            <div className="flex-[2] flex flex-col">
              <DebateRoom
                debate={currentDebate}
                viewerRole={viewerRole}
                onUpdateDebate={handleUpdateDebate}
                addToast={addToast}
              />
            </div>

            <div className="flex-1 flex flex-col gap-6 min-w-[280px]">
              <div className="flex-1">
                <PollPanel debateId={currentDebate.id} poll={activePoll} onVote={handleVote} />
              </div>
              <div className="flex-[2]">
                <ChatPanel
                  debateId={currentDebate.id}
                  chatMessages={chatMessages}
                  onSendMessage={handleSendMessage}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard-shell max-w-6xl w-full mx-auto px-6 py-10 space-y-10 animate-slide-in">
            <section className="control-deck">
              <div className="control-copy">
                <span className="deck-eyebrow">Consola de moderación</span>
                <h2>Debates en vivo, turnos abiertos y pulso de audiencia en una sola cola.</h2>
                <p>
                  Abre una sala, programa un encuentro o entra al siguiente escenario activo. La interfaz mantiene visible el tema, el estado de los ponentes y la siguiente acción.
                </p>
              </div>

              <div className="deck-actions">
                <button onClick={() => setActiveModal('create')} className="primary-action">
                  Iniciar sala en vivo
                </button>
                <button
                  onClick={() => {
                    setActiveModal('create');
                    setTimeout(() => {
                      const typeBtn = document.querySelector('button[type="button"]:nth-child(2)');
                      if (typeBtn) typeBtn.click();
                    }, 100);
                  }}
                  className="secondary-action"
                >
                  Programar debate
                </button>
              </div>
            </section>

            <section className="ops-strip" aria-label="Resumen de actividad de debates">
              <div className="ops-item is-live">
                <span className="ops-value">{liveCount}</span>
                <span className="ops-label">Salas en vivo</span>
              </div>
              <div className="ops-item">
                <span className="ops-value">{openSeatCount}</span>
                <span className="ops-label">Turnos abiertos</span>
              </div>
              <div className="ops-item">
                <span className="ops-value">{applicationCount}</span>
                <span className="ops-label">Postulaciones pendientes</span>
              </div>
              <div className="ops-item is-wide">
                <span className="ops-value">
                  {nextScheduledDebate ? new Date(nextScheduledDebate.scheduledFor).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }) : '--'}
                </span>
                <span className="ops-label">{nextScheduledDebate ? nextScheduledDebate.title : 'Sin debates programados'}</span>
              </div>
            </section>

            <div className="category-rail">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`category-pill ${selectedCategory === cat.id ? 'is-active' : ''}`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            <div className="debate-section">
              <h2 className="section-kicker">
                <span className="status-dot live-dot"></span>
                Escenario en vivo
              </h2>
              {liveDebates.length === 0 ? (
                <div className="empty-panel">
                  No hay debates en vivo en esta categoría. Inicia una sala cuando estés listo para moderar.
                </div>
              ) : (
                <div className="dashboard-grid">
                  {liveDebates.map((d) => (
                    <DebateCard
                      key={d.id}
                      debate={d}
                      onEnterDebate={(id) => handleEnterDebate(id, 'spectator')}
                      onOpenApply={() => {
                        setFocusedDebate(d);
                        setActiveModal('apply');
                      }}
                      onOpenManageRequests={() => {}}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="debate-section">
              <h2 className="section-kicker">
                <span className="status-dot scheduled-dot"></span>
                Agenda programada
              </h2>
              {scheduledDebates.length === 0 ? (
                <div className="empty-panel">No hay debates próximos en esta categoría.</div>
              ) : (
                <div className="dashboard-grid">
                  {scheduledDebates.map((d) => (
                    <DebateCard
                      key={d.id}
                      debate={d}
                      onEnterDebate={(id) => handleEnterDebate(id, 'spectator')}
                      onOpenApply={() => {
                        setFocusedDebate(d);
                        setActiveModal('apply');
                      }}
                      onOpenManageRequests={() => {
                        setFocusedDebate(d);
                        setActiveModal('manage');
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <CreateDebateModal
        isOpen={activeModal === 'create'}
        onClose={() => setActiveModal(null)}
        onCreate={handleCreateDebate}
      />

      <ApplyModal
        isOpen={activeModal === 'apply'}
        debate={focusedDebate}
        onClose={() => {
          setActiveModal(null);
          setFocusedDebate(null);
        }}
        onSubmit={handleApplyToDebate}
      />

      <ManageRequestsModal
        isOpen={activeModal === 'manage'}
        debate={focusedDebate}
        onClose={() => {
          setActiveModal(null);
          setFocusedDebate(null);
        }}
        onApprove={handleApproveApplicant}
        onReject={handleRejectApplicant}
      />
    </div>
  );
}
