import React, { useState, useEffect, useCallback } from 'react';
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
  subscribeToSync
} from './utils/storage';

export default function App() {
  const [debates, setDebates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentDebateId, setCurrentDebateId] = useState(null);
  const [viewerRole, setViewerRole] = useState('spectator'); // 'host' | 'opponent' | 'spectator'
  
  // Active debate room states
  const [chatMessages, setChatMessages] = useState([]);
  const [activePoll, setActivePoll] = useState(null);

  // Modals & Focus States
  const [activeModal, setActiveModal] = useState(null); // 'create' | 'apply' | 'manage' | null
  const [focusedDebate, setFocusedDebate] = useState(null);
  
  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    setToasts((prev) => [...prev, { id: 'toast-' + Date.now() + '-' + Math.random(), ...toast }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial debates on mount
  useEffect(() => {
    setDebates(getDebates());
  }, []);

  // Sync state in real-time across tabs using BroadcastChannel
  useEffect(() => {
    const unsubscribe = subscribeToSync((event) => {
      const { type, payload } = event;

      if (type === 'DEBATES_UPDATED') {
        setDebates(payload);
      } else if (type === 'CHAT_UPDATED') {
        const { debateId, messages } = payload;
        if (debateId === currentDebateId) {
          setChatMessages(messages);
        }
      } else if (type === 'POLL_UPDATED') {
        const { debateId, poll } = payload;
        if (debateId === currentDebateId) {
          setActivePoll(poll);
        }
      }
    });

    return unsubscribe;
  }, [currentDebateId]);

  // Load chat and poll when entering a debate room
  useEffect(() => {
    if (currentDebateId) {
      setChatMessages(getChatMessages(currentDebateId));
      setActivePoll(getPoll(currentDebateId));
    }
  }, [currentDebateId]);

  const handleEnterDebate = (debateId, role = 'spectator') => {
    setViewerRole(role);
    setCurrentDebateId(debateId);
  };

  const currentDebate = debates.find((d) => d.id === currentDebateId);

  // DEBATE ACTIONS
  const handleCreateDebate = (debateData) => {
    const newDebate = {
      id: 'debate-' + Date.now(),
      ...debateData
    };

    if (debateData.type === 'live') {
      newDebate.timeRemaining = 120; // 2 minutes
      newDebate.activeSpeaker = 'creator';
      newDebate.spectators = Math.floor(Math.random() * 20) + 5;
    }

    const updatedDebates = [newDebate, ...debates];
    setDebates(updatedDebates);
    saveDebates(updatedDebates);

    addToast({
      type: 'success',
      title: 'Debate Stage Created',
      message: debateData.type === 'live' 
        ? 'Your live stage is open. Opponents can join now!' 
        : 'Your debate has been scheduled successfully.'
    });

    if (debateData.type === 'live') {
      handleEnterDebate(newDebate.id, 'host');
    }
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
      if (d.id === debateId) {
        // Immediate join for active wait stages
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

          // Initialize custom poll
          const initialPoll = {
            question: 'Which argument is more convincing?',
            options: [
              { label: `${d.creator.name} (${d.creator.stance})`, votes: 0 },
              { label: `${applicantData.name} (${applicantData.stance})`, votes: 0 },
              { label: 'Undecided', votes: 0 }
            ]
          };
          savePoll(debateId, initialPoll);

          addToast({
            type: 'success',
            title: 'Stage Joined!',
            message: 'You have entered the stage. The debate is now LIVE.'
          });

          // Redirect applicant to room
          setTimeout(() => handleEnterDebate(debateId, 'opponent'), 100);
          return updatedDebate;
        }

        // Scheduled applications
        return {
          ...d,
          applications: [...(d.applications || []), applicantData]
        };
      }
      return d;
    });

    setDebates(updated);
    saveDebates(updated);

    if (debateId !== currentDebateId) {
      addToast({
        type: 'info',
        title: 'Pitch Submitted',
        message: 'Your application has been sent to the host.'
      });
    }
  };

  const handleApproveApplicant = (debateId, applicant) => {
    const updated = debates.map((d) => {
      if (d.id === debateId) {
        const updatedDebate = {
          ...d,
          opponent: {
            name: applicant.name,
            avatar: applicant.avatar,
            stance: applicant.stance
          },
          type: 'live', // Turn scheduled to live now!
          status: 'active',
          timeRemaining: 120,
          activeSpeaker: 'creator',
          spectators: Math.floor(Math.random() * 50) + 40,
          applications: d.applications.filter((a) => a.id !== applicant.id)
        };

        // Initialize custom poll
        const initialPoll = {
          question: 'Which argument is more convincing?',
          options: [
            { label: `${d.creator.name} (${d.creator.stance})`, votes: 0 },
            { label: `${applicant.name} (${applicant.stance})`, votes: 0 },
            { label: 'Undecided', votes: 0 }
          ]
        };
        savePoll(debateId, initialPoll);

        return updatedDebate;
      }
      return d;
    });

    setDebates(updated);
    saveDebates(updated);
    setActiveModal(null);

    addToast({
      type: 'success',
      title: 'Opponent Approved',
      message: 'Opponent matches. Entering the live debate stage!'
    });

    // Enter room
    handleEnterDebate(debateId, 'host');
  };

  const handleRejectApplicant = (debateId, applicantId) => {
    const updated = debates.map((d) => {
      if (d.id === debateId) {
        return {
          ...d,
          applications: d.applications.filter((a) => a.id !== applicantId)
        };
      }
      return d;
    });

    setDebates(updated);
    saveDebates(updated);

    // Refresh focused applications in modal state
    const focused = updated.find((d) => d.id === debateId);
    setFocusedDebate(focused);

    addToast({
      type: 'warning',
      title: 'Application Declined',
      message: 'The application was removed.'
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
      title: 'Vote Cast',
      message: 'Your opinion has been recorded in the audience poll.'
    });
  };

  // DASHBOARD CALCULATED STATS
  const liveCount = debates.filter((d) => d.type === 'live' && d.status === 'active').length;
  const spectatorCount = debates.reduce((sum, d) => sum + (d.spectators || 0), 0);

  const filteredDebates = debates.filter(
    (d) => selectedCategory === 'all' || d.category === selectedCategory
  );

  const liveDebates = filteredDebates.filter((d) => d.type === 'live');
  const scheduledDebates = filteredDebates.filter((d) => d.type === 'scheduled');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Toast Alert System */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Global Navigation Header */}
      <Header
        currentDebate={currentDebate}
        onBackToDashboard={() => {
          setCurrentDebateId(null);
          setViewerRole('spectator');
        }}
        liveCount={liveCount}
        spectatorCount={spectatorCount}
      />

      {/* Main content body */}
      <main className="flex-1 flex flex-col bg-slate-950">
        {currentDebate ? (
          /* DEBATE LIVE ARENA STAGE STYLES */
          <div className="flex-1 flex flex-col md:flex-row items-stretch gap-6 p-6 max-w-7xl w-full mx-auto animate-slide-in">
            {/* Left side: Stage Feed & Timers */}
            <div className="flex-[2] flex flex-col">
              <DebateRoom
                debate={currentDebate}
                viewerRole={viewerRole}
                onUpdateDebate={handleUpdateDebate}
                addToast={addToast}
              />
            </div>

            {/* Right side: Audience interactive sidebar */}
            <div className="flex-1 flex flex-col gap-6 min-w-[280px]">
              <div className="flex-1">
                <PollPanel
                  debateId={currentDebate.id}
                  poll={activePoll}
                  onVote={handleVote}
                />
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
          /* MAIN WEB CARD DASHBOARD */
          <div className="max-w-6xl w-full mx-auto px-6 py-10 space-y-10 animate-slide-in">
            
            {/* HERO HEROICS BANNER */}
            <section className="relative rounded-3xl bg-slate-900/40 border border-white/5 p-8 md:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-purple-500/5 to-transparent -z-10" />
              <div className="text-left space-y-4 max-w-xl">
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                  🎙️ Clashing Ideas, Structured Minds
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                  Welcome to the <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Debate Arena</span>
                </h2>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                  Watch live intellectual clashes or host your own. Invite opponents, outline key nuances, and let the audience decide the winner in real-time polls.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => setActiveModal('create')}
                  className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/15 border border-white/10 active:scale-95 transition-all text-center"
                >
                  ⚡ Start Live Stage
                </button>
                <button
                  onClick={() => {
                    setActiveModal('create');
                    // auto trigger scheduled setup
                    setTimeout(() => {
                      const typeBtn = document.querySelector('button[type="button"]:nth-child(2)');
                      if (typeBtn) typeBtn.click();
                    }, 100);
                  }}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 rounded-xl font-bold text-xs active:scale-95 transition-all text-center"
                >
                  📅 Schedule Debate
                </button>
              </div>
            </section>

            {/* CATEGORY FILTER TABS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/3'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* LIVE DEBATES ROW */}
            <div className="space-y-4">
              <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest text-left flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                Live Arena Stage
              </h2>
              {liveDebates.length === 0 ? (
                <div className="py-12 border border-dashed border-white/5 rounded-3xl text-center text-xs text-slate-500 italic">
                  No live clashes in this category. Click "Start Live Stage" to create one!
                </div>
              ) : (
                <div className="dashboard-grid">
                  {liveDebates.map((d) => (
                    <DebateCard
                      key={d.id}
                      debate={d}
                      onEnterDebate={(id) => handleEnterDebate(id, 'spectator')}
                      onOpenApply={(id) => {
                        setFocusedDebate(d);
                        setActiveModal('apply');
                      }}
                      onOpenManageRequests={() => {}}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* SCHEDULED CLASHES LISTINGS */}
            <div className="space-y-4">
              <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest text-left flex items-center gap-2">
                📅 Scheduled Clashes
              </h2>
              {scheduledDebates.length === 0 ? (
                <div className="py-12 border border-dashed border-white/5 rounded-3xl text-center text-xs text-slate-500 italic">
                  No upcoming scheduled debates in this category.
                </div>
              ) : (
                <div className="dashboard-grid">
                  {scheduledDebates.map((d) => (
                    <DebateCard
                      key={d.id}
                      debate={d}
                      onEnterDebate={(id) => handleEnterDebate(id, 'spectator')}
                      onOpenApply={(id) => {
                        setFocusedDebate(d);
                        setActiveModal('apply');
                      }}
                      onOpenManageRequests={(id) => {
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

      {/* CREATE MODAL */}
      <CreateDebateModal
        isOpen={activeModal === 'create'}
        onClose={() => setActiveModal(null)}
        onCreate={handleCreateDebate}
      />

      {/* APPLY MODAL */}
      <ApplyModal
        isOpen={activeModal === 'apply'}
        debate={focusedDebate}
        onClose={() => {
          setActiveModal(null);
          setFocusedDebate(null);
        }}
        onSubmit={handleApplyToDebate}
      />

      {/* MANAGE REQUESTS MODAL */}
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
