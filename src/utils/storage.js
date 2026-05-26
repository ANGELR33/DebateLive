import { INITIAL_DEBATES, INITIAL_CHAT_MESSAGES, INITIAL_POLLS } from './mockData';

const DEBATES_KEY = 'debate_live_es_debates';
const CHAT_KEY_PREFIX = 'debate_live_es_chat_';
const POLL_KEY_PREFIX = 'debate_live_es_poll_';
const REMOTE_VERSION_KEY = 'debate_live_es_remote_version';
const CHANNEL_NAME = 'debate_live_es_sync';

const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const firebaseProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const remoteEnabled = Boolean(firebaseApiKey && firebaseProjectId);
const remoteDocUrl = remoteEnabled
  ? `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/debateLive/state?key=${firebaseApiKey}`
  : null;

let broadcastChannel = null;
let remoteSyncStarted = false;
let remoteWriteTimer = null;
const subscribers = new Set();

if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  broadcastChannel.onmessage = (event) => {
    subscribers.forEach((callback) => callback(event.data));
  };
}

export const subscribeToSync = (callback) => {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
};

export const isRemoteSyncEnabled = () => remoteEnabled;

const broadcast = (type, payload) => {
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type, payload });
  }
  subscribers.forEach((callback) => callback({ type, payload }));
};

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getStoredJson = (key, fallback) => safeParse(localStorage.getItem(key), fallback);

const getAllChats = () => {
  const chats = { ...INITIAL_CHAT_MESSAGES };
  Object.keys(localStorage)
    .filter((key) => key.startsWith(CHAT_KEY_PREFIX))
    .forEach((key) => {
      chats[key.replace(CHAT_KEY_PREFIX, '')] = getStoredJson(key, []);
    });
  return chats;
};

const getAllPolls = () => {
  const polls = { ...INITIAL_POLLS };
  Object.keys(localStorage)
    .filter((key) => key.startsWith(POLL_KEY_PREFIX))
    .forEach((key) => {
      polls[key.replace(POLL_KEY_PREFIX, '')] = getStoredJson(key, null);
    });
  return polls;
};

const getLocalState = () => ({
  debates: getDebates(),
  chats: getAllChats(),
  polls: getAllPolls(),
  updatedAt: Number(localStorage.getItem(REMOTE_VERSION_KEY)) || Date.now()
});

const saveLocalState = (state) => {
  if (state.debates) {
    localStorage.setItem(DEBATES_KEY, JSON.stringify(state.debates));
    broadcast('DEBATES_UPDATED', state.debates);
  }

  if (state.chats) {
    Object.entries(state.chats).forEach(([debateId, messages]) => {
      localStorage.setItem(CHAT_KEY_PREFIX + debateId, JSON.stringify(messages));
      broadcast('CHAT_UPDATED', { debateId, messages });
    });
  }

  if (state.polls) {
    Object.entries(state.polls).forEach(([debateId, poll]) => {
      localStorage.setItem(POLL_KEY_PREFIX + debateId, JSON.stringify(poll));
      broadcast('POLL_UPDATED', { debateId, poll });
    });
  }

  if (state.updatedAt) {
    localStorage.setItem(REMOTE_VERSION_KEY, String(state.updatedAt));
  }
};

const toFirestoreFields = (state) => ({
  fields: {
    debates: { stringValue: JSON.stringify(state.debates) },
    chats: { stringValue: JSON.stringify(state.chats) },
    polls: { stringValue: JSON.stringify(state.polls) },
    updatedAt: { integerValue: String(state.updatedAt) }
  }
});

const fromFirestoreDocument = (doc) => {
  const fields = doc.fields || {};
  return {
    debates: safeParse(fields.debates?.stringValue, INITIAL_DEBATES),
    chats: safeParse(fields.chats?.stringValue, INITIAL_CHAT_MESSAGES),
    polls: safeParse(fields.polls?.stringValue, INITIAL_POLLS),
    updatedAt: Number(fields.updatedAt?.integerValue || fields.updatedAt?.doubleValue || 0)
  };
};

const fetchRemoteState = async () => {
  if (!remoteEnabled) return null;
  const response = await fetch(remoteDocUrl);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Firestore read failed: ${response.status}`);
  return fromFirestoreDocument(await response.json());
};

const writeRemoteState = async (state) => {
  if (!remoteEnabled) return;
  const response = await fetch(remoteDocUrl, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toFirestoreFields(state))
  });
  if (!response.ok) throw new Error(`Firestore write failed: ${response.status}`);
};

const queueRemoteWrite = () => {
  if (!remoteEnabled) return;
  clearTimeout(remoteWriteTimer);
  remoteWriteTimer = setTimeout(() => {
    const state = {
      ...getLocalState(),
      updatedAt: Date.now()
    };
    localStorage.setItem(REMOTE_VERSION_KEY, String(state.updatedAt));
    writeRemoteState(state).catch((error) => {
      console.warn('No se pudo sincronizar con Firestore', error);
    });
  }, 350);
};

export const startRemoteSync = () => {
  if (!remoteEnabled || remoteSyncStarted) return false;
  remoteSyncStarted = true;

  const syncOnce = async () => {
    try {
      const remoteState = await fetchRemoteState();
      if (!remoteState) {
        await writeRemoteState({
          ...getLocalState(),
          updatedAt: Date.now()
        });
        return;
      }

      const localVersion = Number(localStorage.getItem(REMOTE_VERSION_KEY)) || 0;
      if (remoteState.updatedAt > localVersion) {
        saveLocalState(remoteState);
      }
    } catch (error) {
      console.warn('No se pudo leer Firestore', error);
    }
  };

  syncOnce();
  window.setInterval(syncOnce, 2500);
  return true;
};

export const getDebates = () => {
  const data = localStorage.getItem(DEBATES_KEY);
  if (!data) {
    localStorage.setItem(DEBATES_KEY, JSON.stringify(INITIAL_DEBATES));
    return INITIAL_DEBATES;
  }
  return safeParse(data, INITIAL_DEBATES);
};

export const saveDebates = (debates) => {
  localStorage.setItem(DEBATES_KEY, JSON.stringify(debates));
  broadcast('DEBATES_UPDATED', debates);
  queueRemoteWrite();
};

export const getChatMessages = (debateId) => {
  const data = localStorage.getItem(CHAT_KEY_PREFIX + debateId);
  if (!data) {
    const initial = INITIAL_CHAT_MESSAGES[debateId] || [];
    localStorage.setItem(CHAT_KEY_PREFIX + debateId, JSON.stringify(initial));
    return initial;
  }
  return safeParse(data, []);
};

export const addChatMessage = (debateId, message) => {
  const messages = getChatMessages(debateId);
  const newMessage = {
    id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    ...message,
    timestamp: Date.now()
  };
  messages.push(newMessage);
  localStorage.setItem(CHAT_KEY_PREFIX + debateId, JSON.stringify(messages));
  broadcast('CHAT_UPDATED', { debateId, messages });
  queueRemoteWrite();
  return newMessage;
};

export const getPoll = (debateId) => {
  const data = localStorage.getItem(POLL_KEY_PREFIX + debateId);
  if (!data) {
    const initial = INITIAL_POLLS[debateId] || {
      question: '¿Quién está construyendo el argumento más sólido ahora?',
      options: [
        { label: 'Postura A', votes: 0 },
        { label: 'Postura B', votes: 0 },
        { label: 'Indeciso', votes: 0 }
      ]
    };
    localStorage.setItem(POLL_KEY_PREFIX + debateId, JSON.stringify(initial));
    return initial;
  }
  return safeParse(data, null);
};

export const votePoll = (debateId, optionIndex) => {
  const poll = getPoll(debateId);
  if (poll && poll.options[optionIndex] !== undefined) {
    poll.options[optionIndex].votes += 1;
    localStorage.setItem(POLL_KEY_PREFIX + debateId, JSON.stringify(poll));
    broadcast('POLL_UPDATED', { debateId, poll });
    queueRemoteWrite();
  }
  return poll;
};

export const savePoll = (debateId, poll) => {
  localStorage.setItem(POLL_KEY_PREFIX + debateId, JSON.stringify(poll));
  broadcast('POLL_UPDATED', { debateId, poll });
  queueRemoteWrite();
};
