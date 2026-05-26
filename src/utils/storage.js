import { INITIAL_DEBATES, INITIAL_CHAT_MESSAGES, INITIAL_POLLS } from './mockData';

const DEBATES_KEY = 'debate_arena_debates';
const CHAT_KEY_PREFIX = 'debate_arena_chat_';
const POLL_KEY_PREFIX = 'debate_arena_poll_';
const CHANNEL_NAME = 'debate_arena_sync';

let broadcastChannel = null;
const subscribers = new Set();

// Initialize Broadcast Channel safely
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  broadcastChannel.onmessage = (event) => {
    // Notify all subscribers of the sync event
    subscribers.forEach((callback) => callback(event.data));
  };
}

// Subscribe to state changes from other tabs
export const subscribeToSync = (callback) => {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
};

// Helper to broadcast changes
const broadcast = (type, payload) => {
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type, payload });
  }
};

// DEBATES FUNCTIONS
export const getDebates = () => {
  const data = localStorage.getItem(DEBATES_KEY);
  if (!data) {
    localStorage.setItem(DEBATES_KEY, JSON.stringify(INITIAL_DEBATES));
    return INITIAL_DEBATES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_DEBATES;
  }
};

export const saveDebates = (debates) => {
  localStorage.setItem(DEBATES_KEY, JSON.stringify(debates));
  broadcast('DEBATES_UPDATED', debates);
};

// CHAT FUNCTIONS
export const getChatMessages = (debateId) => {
  const data = localStorage.getItem(CHAT_KEY_PREFIX + debateId);
  if (!data) {
    const initial = INITIAL_CHAT_MESSAGES[debateId] || [];
    localStorage.setItem(CHAT_KEY_PREFIX + debateId, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
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
  return newMessage;
};

// POLL FUNCTIONS
export const getPoll = (debateId) => {
  const data = localStorage.getItem(POLL_KEY_PREFIX + debateId);
  if (!data) {
    const initial = INITIAL_POLLS[debateId] || {
      question: 'Who is making the stronger case right now?',
      options: [
        { label: 'Stance A', votes: 0 },
        { label: 'Stance B', votes: 0 },
        { label: 'Undecided', votes: 0 }
      ]
    };
    localStorage.setItem(POLL_KEY_PREFIX + debateId, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
};

export const votePoll = (debateId, optionIndex) => {
  const poll = getPoll(debateId);
  if (poll && poll.options[optionIndex] !== undefined) {
    poll.options[optionIndex].votes += 1;
    localStorage.setItem(POLL_KEY_PREFIX + debateId, JSON.stringify(poll));
    broadcast('POLL_UPDATED', { debateId, poll });
  }
  return poll;
};

export const savePoll = (debateId, poll) => {
  localStorage.setItem(POLL_KEY_PREFIX + debateId, JSON.stringify(poll));
  broadcast('POLL_UPDATED', { debateId, poll });
};
