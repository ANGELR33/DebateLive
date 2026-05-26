export const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: '🌍' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'philosophy', name: 'Philosophy', icon: '🧠' },
  { id: 'society', name: 'Society', icon: '👥' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'religion', name: 'Religion & Ethics', icon: '📜' },
  { id: 'business', name: 'Business & Economy', icon: '📈' }
];

export const INITIAL_DEBATES = [
  {
    id: 'debate-1',
    title: 'Is Remote Work Superior to In-Office Work Long-Term?',
    category: 'business',
    type: 'live',
    status: 'active',
    creator: {
      name: 'Sarah Jenkins',
      avatar: '👩‍💼',
      stance: 'Pro-Remote'
    },
    opponent: {
      name: 'David Miller',
      avatar: '👨‍💼',
      stance: 'Pro-Office'
    },
    spectators: 342,
    nuances: [
      { text: 'Impact on mental health & isolation', completed: true },
      { text: 'Company culture & spontaneous collaboration', completed: true },
      { text: 'Cost savings vs infrastructure costs', completed: false },
      { text: 'Global talent access vs time-zone overhead', completed: false }
    ],
    timeRemaining: 180, // seconds
    activeSpeaker: 'creator', // 'creator' or 'opponent'
    createdAt: new Date().toISOString()
  },
  {
    id: 'debate-2',
    title: 'Should Social Media Algorithms Be Regulated by Government?',
    category: 'technology',
    type: 'scheduled',
    status: 'open', // open for applications
    creator: {
      name: 'Dr. Evelyn Carter',
      avatar: '👩‍🔬',
      stance: 'Pro-Regulation',
      details: 'Focusing on psychological impacts and feedback loops designed for addiction.'
    },
    opponent: null, // open
    spectators: 0,
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000 * 2).toISOString(), // 2 days from now
    nuances: [
      { text: 'Freedom of speech issues & censorship fears', completed: false },
      { text: 'Protecting children and teenagers', completed: false },
      { text: 'Corporate transparency & algorithm audits', completed: false }
    ],
    createdAt: new Date().toISOString(),
    applications: [
      {
        id: 'app-1',
        name: 'James Lee',
        avatar: '👨‍💻',
        stance: 'Anti-Regulation',
        coverLetter: 'I am a software engineer. Government regulation of algorithms is a slippery slope to state censorship. Tech companies should self-regulate through open-source algorithms.',
        status: 'pending'
      },
      {
        id: 'app-2',
        name: 'Sophia Martinez',
        avatar: '👩‍🎓',
        stance: 'Nuanced / Technical Auditing Only',
        coverLetter: 'I believe instead of outright bans or control, government should only mandate auditability. Happy to join and represent this middle-ground stance.',
        status: 'pending'
      }
    ]
  },
  {
    id: 'debate-3',
    title: 'Will Artificial Intelligence Outperform Human Creative Artists by 2030?',
    category: 'technology',
    type: 'live',
    status: 'waiting', // host waiting for opponent to join
    creator: {
      name: 'Alex Rivera',
      avatar: '🎨',
      stance: 'Anti-AI Dominance',
      details: 'Art requires intentional consciousness and lived human experiences.'
    },
    opponent: null,
    spectators: 12,
    nuances: [
      { text: 'Emotional connection vs pattern matching', completed: false },
      { text: 'Copyright and derivative training data issues', completed: false },
      { text: 'Economic survival of human artists', completed: false }
    ],
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_CHAT_MESSAGES = {
  'debate-1': [
    { id: 'c1', sender: 'Lucas', avatar: '🙋‍♂️', text: 'Sarah is making a great point about commute times.', timestamp: Date.now() - 30000 },
    { id: 'c2', sender: 'Emily', avatar: '🙋‍♀️', text: 'But David is right, whiteboard sessions are impossible to replace online.', timestamp: Date.now() - 25000 },
    { id: 'c3', sender: 'Marcus', avatar: '👨‍🚀', text: 'Hybrid is the obvious middle ground here.', timestamp: Date.now() - 15000 },
    { id: 'c4', sender: 'Chloe', avatar: '👩‍🎨', text: 'Is there a vote poll open yet? Want to see what others think.', timestamp: Date.now() - 5000 }
  ]
};

export const INITIAL_POLLS = {
  'debate-1': {
    question: 'Who is making the stronger case right now?',
    options: [
      { label: 'Sarah (Pro-Remote)', votes: 84 },
      { label: 'David (Pro-Office)', votes: 71 },
      { label: 'Undecided / Tie', votes: 23 }
    ]
  },
  'debate-3': {
    question: 'Do you believe AI can truly be creative?',
    options: [
      { label: 'Yes, creativity is just generation', votes: 5 },
      { label: 'No, it requires consciousness', votes: 12 },
      { label: 'Undecided', votes: 2 }
    ]
  }
};
