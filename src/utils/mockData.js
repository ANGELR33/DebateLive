export const CATEGORIES = [
  { id: 'all', name: 'Todas', icon: '🌍' },
  { id: 'technology', name: 'Tecnología', icon: '💻' },
  { id: 'philosophy', name: 'Filosofía', icon: '🧠' },
  { id: 'society', name: 'Sociedad', icon: '👥' },
  { id: 'science', name: 'Ciencia', icon: '🔬' },
  { id: 'religion', name: 'Religión y ética', icon: '📜' },
  { id: 'business', name: 'Negocios y economía', icon: '📈' }
];

export const INITIAL_DEBATES = [
  {
    id: 'debate-1',
    title: '¿El trabajo remoto es mejor que el trabajo en oficina a largo plazo?',
    category: 'business',
    type: 'live',
    status: 'active',
    creator: {
      name: 'Sarah Jenkins',
      avatar: '👩‍💼',
      stance: 'Pro-remoto'
    },
    opponent: {
      name: 'David Miller',
      avatar: '👨‍💼',
      stance: 'Pro-oficina'
    },
    spectators: 342,
    nuances: [
      { text: 'Impacto en salud mental y aislamiento', completed: true },
      { text: 'Cultura de empresa y colaboración espontánea', completed: true },
      { text: 'Ahorro de costos frente a infraestructura', completed: false },
      { text: 'Acceso a talento global y fricción horaria', completed: false }
    ],
    timeRemaining: 180,
    activeSpeaker: 'creator',
    createdAt: new Date().toISOString()
  },
  {
    id: 'debate-2',
    title: '¿Deben los gobiernos regular los algoritmos de redes sociales?',
    category: 'technology',
    type: 'scheduled',
    status: 'open',
    creator: {
      name: 'Dra. Evelyn Carter',
      avatar: '👩‍🔬',
      stance: 'A favor de regular',
      details: 'Enfoque en impactos psicológicos y bucles de adicción.'
    },
    opponent: null,
    spectators: 0,
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000 * 2).toISOString(),
    nuances: [
      { text: 'Libertad de expresión y temor a censura', completed: false },
      { text: 'Protección de niños y adolescentes', completed: false },
      { text: 'Transparencia corporativa y auditorías algorítmicas', completed: false }
    ],
    createdAt: new Date().toISOString(),
    applications: [
      {
        id: 'app-1',
        name: 'James Lee',
        avatar: '👨‍💻',
        stance: 'Contra la regulación',
        coverLetter: 'Soy ingeniero de software. Regular algoritmos puede abrir la puerta a censura estatal. Las empresas deberían autorregularse con algoritmos auditables.',
        status: 'pending'
      },
      {
        id: 'app-2',
        name: 'Sophia Martinez',
        avatar: '👩‍🎓',
        stance: 'Auditoría técnica, no control',
        coverLetter: 'Creo que el gobierno debería exigir auditabilidad, no prohibiciones amplias. Puedo representar una postura intermedia.',
        status: 'pending'
      }
    ]
  },
  {
    id: 'debate-3',
    title: '¿La inteligencia artificial superará a los artistas humanos antes de 2030?',
    category: 'technology',
    type: 'live',
    status: 'waiting',
    creator: {
      name: 'Alex Rivera',
      avatar: '🎨',
      stance: 'Contra el dominio de la IA',
      details: 'El arte requiere conciencia intencional y experiencia humana vivida.'
    },
    opponent: null,
    spectators: 12,
    nuances: [
      { text: 'Conexión emocional frente a reconocimiento de patrones', completed: false },
      { text: 'Derechos de autor y datos de entrenamiento', completed: false },
      { text: 'Supervivencia económica de artistas humanos', completed: false }
    ],
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_CHAT_MESSAGES = {
  'debate-1': [
    { id: 'c1', sender: 'Lucas', avatar: '🙋‍♂️', text: 'Sarah tiene un buen punto sobre el tiempo perdido en desplazamientos.', timestamp: Date.now() - 30000 },
    { id: 'c2', sender: 'Emily', avatar: '🙋‍♀️', text: 'Pero David tiene razón: las sesiones de pizarra son difíciles de reemplazar en línea.', timestamp: Date.now() - 25000 },
    { id: 'c3', sender: 'Marcus', avatar: '👨‍🚀', text: 'El modelo híbrido parece el punto medio lógico.', timestamp: Date.now() - 15000 },
    { id: 'c4', sender: 'Chloe', avatar: '👩‍🎨', text: '¿Ya hay encuesta abierta? Quiero ver qué opina la audiencia.', timestamp: Date.now() - 5000 }
  ]
};

export const INITIAL_POLLS = {
  'debate-1': {
    question: '¿Quién está construyendo el argumento más sólido ahora?',
    options: [
      { label: 'Sarah (Pro-remoto)', votes: 84 },
      { label: 'David (Pro-oficina)', votes: 71 },
      { label: 'Indeciso / empate', votes: 23 }
    ]
  },
  'debate-3': {
    question: '¿Crees que la IA puede ser realmente creativa?',
    options: [
      { label: 'Sí, crear también es generar', votes: 5 },
      { label: 'No, requiere conciencia', votes: 12 },
      { label: 'Indeciso', votes: 2 }
    ]
  }
};
