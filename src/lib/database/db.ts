import {
  User,
  Subject,
  Document,
  DocumentPage,
  DocumentChunk,
  Topic,
  Summary,
  Flashcard,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  PYQDocument,
  PYQQuestion,
  StudyPlan,
  StudyTask,
  UserProgress,
} from './schema';

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'studyforge-store.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

class MemoryDatabase {
  users: Map<string, User> = new Map();
  subjects: Map<string, Subject> = new Map();
  documents: Map<string, Document> = new Map();
  documentPages: Map<string, DocumentPage[]> = new Map();
  documentChunks: Map<string, DocumentChunk[]> = new Map();
  topics: Map<string, Topic[]> = new Map();
  summaries: Map<string, Summary> = new Map();
  flashcards: Map<string, Flashcard[]> = new Map();
  quizzes: Map<string, Quiz> = new Map();
  quizQuestions: Map<string, QuizQuestion[]> = new Map();
  quizAttempts: Map<string, QuizAttempt[]> = new Map();
  pyqDocuments: Map<string, PYQDocument[]> = new Map();
  pyqQuestions: Map<string, PYQQuestion[]> = new Map();
  studyPlans: Map<string, StudyPlan> = new Map();
  studyTasks: Map<string, StudyTask[]> = new Map();
  userProgress: Map<string, UserProgress> = new Map();

  constructor() {
    const loaded = this.load();
    if (!loaded || this.documents.size === 0) {
      this.seed();
      this.persist();
    }
  }

  private ensureDirs() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }
    } catch (e) {
      console.error('Failed to create storage directories:', e);
    }
  }

  persist() {
    this.ensureDirs();
    try {
      const payload = {
        users: Array.from(this.users.entries()),
        subjects: Array.from(this.subjects.entries()),
        documents: Array.from(this.documents.entries()),
        documentPages: Array.from(this.documentPages.entries()),
        documentChunks: Array.from(this.documentChunks.entries()),
        topics: Array.from(this.topics.entries()),
        summaries: Array.from(this.summaries.entries()),
        flashcards: Array.from(this.flashcards.entries()),
        quizzes: Array.from(this.quizzes.entries()),
        quizQuestions: Array.from(this.quizQuestions.entries()),
        quizAttempts: Array.from(this.quizAttempts.entries()),
        pyqDocuments: Array.from(this.pyqDocuments.entries()),
        pyqQuestions: Array.from(this.pyqQuestions.entries()),
        studyPlans: Array.from(this.studyPlans.entries()),
        studyTasks: Array.from(this.studyTasks.entries()),
        userProgress: Array.from(this.userProgress.entries()),
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist database to disk:', e);
    }
  }

  load(): boolean {
    this.ensureDirs();
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const data = JSON.parse(raw);
        this.users = new Map(data.users || []);
        this.subjects = new Map(data.subjects || []);
        this.documents = new Map(data.documents || []);
        this.documentPages = new Map(data.documentPages || []);
        this.documentChunks = new Map(data.documentChunks || []);
        this.topics = new Map(data.topics || []);
        this.summaries = new Map(data.summaries || []);
        this.flashcards = new Map(data.flashcards || []);
        this.quizzes = new Map(data.quizzes || []);
        this.quizQuestions = new Map(data.quizQuestions || []);
        this.quizAttempts = new Map(data.quizAttempts || []);
        this.pyqDocuments = new Map(data.pyqDocuments || []);
        this.pyqQuestions = new Map(data.pyqQuestions || []);
        this.studyPlans = new Map(data.studyPlans || []);
        this.studyTasks = new Map(data.studyTasks || []);
        this.userProgress = new Map(data.userProgress || []);
        return true;
      }
    } catch (e) {
      console.error('Failed to load database from disk:', e);
    }
    return false;
  }

  seed() {
    const defaultUser: User = {
      id: 'user-ashutosh',
      name: 'Ashutosh',
      email: 'ashutosh@university.edu',
      studyField: 'Computer Science & Engineering',
      dailyGoalHours: 3.5,
      examDate: '2026-12-15',
      createdAt: new Date().toISOString(),
    };
    this.users.set(defaultUser.id, defaultUser);

    const subjects: Subject[] = [
      { id: 'subj-1', userId: defaultUser.id, name: 'Engineering Physics', code: 'PHY101', color: '#c3a47b', createdAt: new Date().toISOString() },
      { id: 'subj-2', userId: defaultUser.id, name: 'Data Structures', code: 'CS201', color: '#89946f', createdAt: new Date().toISOString() },
      { id: 'subj-3', userId: defaultUser.id, name: 'Mathematics III', code: 'MTH301', color: '#a96346', createdAt: new Date().toISOString() },
      { id: 'subj-4', userId: defaultUser.id, name: 'Digital Electronics', code: 'EC202', color: '#5f684f', createdAt: new Date().toISOString() },
    ];
    subjects.forEach((s) => this.subjects.set(s.id, s));

    // 1. Engineering Physics Document
    const physicsDoc: Document = {
      id: 'engineering-physics',
      userId: defaultUser.id,
      subjectId: 'subj-1',
      title: 'Engineering Physics — Semiconductor Devices & Optics',
      fileName: 'Engineering_Physics_Module_1_and_2.pdf',
      fileSize: 4820190,
      pageCount: 28,
      status: 'ready',
      createdAt: '2026-09-24T09:00:00Z',
      updatedAt: '2026-09-29T14:30:00Z',
    };
    this.documents.set(physicsDoc.id, physicsDoc);

    const physicsPages: DocumentPage[] = [
      {
        id: 'p-page-1',
        documentId: physicsDoc.id,
        pageNumber: 1,
        text: 'Module 1: Semiconductor Physics. Band Theory of Solids: Formation of energy bands, valence band, conduction band, and forbidden energy gap. Intrinsic semiconductors: Carrier concentration, Fermi level position at T = 0K and T > 0K. Extrinsic semiconductors: N-type and P-type doping, donor and acceptor energy states.',
        hasImages: true,
      },
      {
        id: 'p-page-2',
        documentId: physicsDoc.id,
        pageNumber: 2,
        text: 'Carrier Transport Phenomena: Drift velocity, mobility, conductivity, and Einstein relation (D/μ = kT/q). Continuity equation and Hall Effect. The Hall coefficient R_H = 1/(n*q) is used to determine semiconductor type and carrier density.',
        hasImages: true,
      },
      {
        id: 'p-page-3',
        documentId: physicsDoc.id,
        pageNumber: 3,
        text: 'PN Junction Diode: Formation of depletion region, built-in barrier potential V_bi = (kT/q) * ln(N_A * N_D / n_i^2). Forward bias: narrowing of depletion layer, exponential diffusion current. Reverse bias: widening of depletion layer, reverse saturation current I_0. Diode equation: I = I_0 * (exp(qV / ηkT) - 1).',
        hasImages: true,
      },
      {
        id: 'p-page-4',
        documentId: physicsDoc.id,
        pageNumber: 4,
        text: 'Breakdown Mechanisms in PN Junctions: 1. Zener Breakdown: Occurs in heavily doped junctions with narrow depletion region (< 10 nm) under moderate reverse voltage (< 6V). High electric field causes direct tunneling of electrons from valence to conduction band. 2. Avalanche Breakdown: Occurs in lightly doped junctions with wider depletion region under higher reverse voltages (> 6V). High kinetic energy causes impact ionization.',
        hasImages: true,
      },
      {
        id: 'p-page-5',
        documentId: physicsDoc.id,
        pageNumber: 5,
        text: 'Optoelectronic Devices: Light Emitting Diode (LED) converts electrical energy to light via radiative spontaneous recombination in direct bandgap semiconductors (e.g. GaAs, GaP). Photodiode operates in reverse bias where incident photons generate electron-hole pairs, causing proportional photocurrent I_p = R * P_opt.',
        hasImages: true,
      },
      {
        id: 'p-page-6',
        documentId: physicsDoc.id,
        pageNumber: 6,
        text: 'Module 2: Laser Physics. Absorption, Spontaneous Emission, Stimulated Emission. Einstein A and B coefficients. Population Inversion and Pumping methods. Ruby laser (3-level solid-state) and Helium-Neon laser (4-level gas laser, 632.8 nm red output). Optical resonators and coherence length.',
        hasImages: true,
      },
    ];
    this.documentPages.set(physicsDoc.id, physicsPages);

    // Chunks for RAG
    const physicsChunks: DocumentChunk[] = physicsPages.map((page, idx) => ({
      id: `chunk-phys-${idx + 1}`,
      documentId: physicsDoc.id,
      pageNumber: page.pageNumber,
      chunkIndex: idx,
      text: page.text,
      keywords: ['semiconductor', 'pn junction', 'zener diode', 'fermi level', 'laser', 'hall effect'],
    }));
    this.documentChunks.set(physicsDoc.id, physicsChunks);

    // Summary
    const physicsSummary: Summary = {
      id: 'sum-phys-1',
      documentId: physicsDoc.id,
      quickSummary:
        'A comprehensive study document on solid-state semiconductor physics and lasers. Covers band theory, Fermi-Dirac statistics, PN junction operation under forward and reverse bias, detailed comparison of Zener vs. Avalanche breakdown mechanisms, optoelectronic devices (LEDs, Photodiodes), and stimulated emission in Ruby and He-Ne lasers.',
      detailedSummary: [
        {
          chapter: '1. Band Theory & Carrier Dynamics',
          content: 'Discusses valence and conduction bands, intrinsic vs extrinsic semiconductors, carrier concentration, drift/diffusion currents, and the Hall effect for experimental identification of charge carriers.',
          keyPoints: [
            'Fermi level in intrinsic semiconductors lies midway between conduction and valence bands.',
            'Hall coefficient R_H = 1 / (n*q) is negative for electrons (N-type) and positive for holes (P-type).',
            'Einstein relation equates diffusivity and mobility: D / μ = kT / q.',
          ],
        },
        {
          chapter: '2. PN Junction & Breakdown Phenomena',
          content: 'Explains depletion layer dynamics, contact potential derivation, Shockley diode equation, and a deep contrast between Zener breakdown (field emission) and Avalanche breakdown (impact ionization).',
          keyPoints: [
            'Built-in potential depends logarithmically on doping densities N_A and N_D.',
            'Zener breakdown has a negative temperature coefficient and operates under 6V.',
            'Avalanche breakdown has a positive temperature coefficient and operates above 6V.',
          ],
        },
        {
          chapter: '3. Optoelectronics & Lasers',
          content: 'Covers direct vs indirect bandgaps in LEDs, photodiode quantum efficiency, Einstein coefficients, population inversion condition, and He-Ne gas laser operation.',
          keyPoints: [
            'Direct bandgap materials are necessary for efficient radiative LED emission.',
            'He-Ne laser emits monochromatic light at 632.8 nm using a four-level energy scheme.',
          ],
        },
      ],
      keyConcepts: [
        {
          title: 'PN Junction Depletion Region',
          explanation: 'Space charge layer formed by diffusion of majority carriers across the metallurgical junction, leaving uncompensated donor and acceptor ions that create an opposing electric field.',
          importance: 'high',
        },
        {
          title: 'Zener vs Avalanche Breakdown',
          explanation: 'Zener occurs via quantum mechanical tunneling in heavily doped diodes; Avalanche occurs via carrier multiplication through impact ionization in lightly doped diodes.',
          importance: 'high',
        },
        {
          title: 'Population Inversion',
          explanation: 'A non-equilibrium state where the population of higher energy state exceeds lower energy state (N2 > N1), mandatory for laser amplification.',
          importance: 'medium',
        },
      ],
      formulas: [
        {
          formula: 'V_bi = (kT / q) * ln((N_A * N_D) / (n_i^2))',
          description: 'Built-in barrier potential across an abrupt PN junction',
          variables: ['k = Boltzmann constant', 'T = absolute temperature', 'q = electronic charge', 'N_A, N_D = acceptor/donor concentrations', 'n_i = intrinsic carrier concentration'],
        },
        {
          formula: 'I = I_0 * (exp(qV / (η * k * T)) - 1)',
          description: 'Shockley Ideal Diode Equation',
          variables: ['I_0 = reverse saturation current', 'V = applied voltage', 'η = ideality factor (1 for Ge, 2 for Si)'],
        },
        {
          formula: 'R_H = 1 / (n * q) = V_H * w / (I * B)',
          description: 'Hall Coefficient and Hall Voltage relation',
          variables: ['V_H = Hall voltage', 'B = magnetic flux density', 'w = sample width', 'I = current'],
        },
      ],
      definitions: [
        { term: 'Fermi Level', definition: 'The highest energy state occupied by electrons in a crystal at absolute zero temperature (0 K).' },
        { term: 'Direct Bandgap', definition: 'A band structure where the conduction band minimum and valence band maximum align at the same crystal momentum (k-vector).' },
        { term: 'Stimulated Emission', definition: 'The process whereby an incident photon induces an excited atom to decay to a lower state, releasing an identical, coherent photon.' },
      ],
      lastMinuteRevision: [
        'Zener breakdown happens at < 6V, heavily doped, direct tunneling, negative temp coefficient.',
        'Avalanche breakdown happens at > 6V, lightly doped, impact ionization, positive temp coefficient.',
        'Built-in potential V_bi increases when doping (N_A, N_D) increases.',
        'Hall Effect: negative R_H implies N-type; positive R_H implies P-type.',
        'He-Ne laser wavelength is 632.8 nm (Red) using He:Ne ratio of 10:1.',
      ],
      createdAt: new Date().toISOString(),
    };
    this.summaries.set(physicsDoc.id, physicsSummary);

    // Topics with exam weight
    const physicsTopics: Topic[] = [
      {
        id: 'top-phys-1',
        documentId: physicsDoc.id,
        name: 'PN Junction & Depletion Region',
        documentImportance: 95,
        examFrequency: 100,
        weightagePercentage: 28,
        examYears: [2023, 2024, 2025],
        status: 'studying',
        keyNotes: 'Repeated 10-mark question every semester. Always prepare the V-I characteristics and built-in potential derivation.',
      },
      {
        id: 'top-phys-2',
        documentId: physicsDoc.id,
        name: 'Zener Diode & Voltage Regulator',
        documentImportance: 90,
        examFrequency: 75,
        weightagePercentage: 22,
        examYears: [2023, 2025],
        status: 'to_study',
        keyNotes: 'Frequently asked as 5-mark comparison with Avalanche breakdown and circuit diagram as shunt regulator.',
      },
      {
        id: 'top-phys-3',
        documentId: physicsDoc.id,
        name: 'Hall Effect & Applications',
        documentImportance: 75,
        examFrequency: 67,
        weightagePercentage: 18,
        examYears: [2023, 2024],
        status: 'to_study',
        keyNotes: 'Derivation of Hall voltage V_H and Hall coefficient R_H is high yield for numerical questions.',
      },
      {
        id: 'top-phys-4',
        documentId: physicsDoc.id,
        name: 'He-Ne & Ruby Laser Systems',
        documentImportance: 65,
        examFrequency: 50,
        weightagePercentage: 15,
        examYears: [2024, 2025],
        status: 'to_study',
        keyNotes: 'Energy level diagram of He-Ne laser and role of Helium atoms in resonant excitation transfer.',
      },
      {
        id: 'top-phys-5',
        documentId: physicsDoc.id,
        name: 'Photodiode & LED Principles',
        documentImportance: 60,
        examFrequency: 45,
        weightagePercentage: 17,
        examYears: [2023, 2025],
        status: 'mastered',
        keyNotes: 'Focus on direct vs indirect bandgap semiconductors and V-I quadrant of photodiode (3rd quadrant).',
      },
    ];
    this.topics.set(physicsDoc.id, physicsTopics);

    // Flashcards
    const physicsCards: Flashcard[] = [
      {
        id: 'fc-1',
        documentId: physicsDoc.id,
        front: 'What is a PN Junction and how is the depletion layer formed?',
        back: 'A PN junction is formed by joining P-type and N-type semiconductor regions. Electrons from N-side diffuse into P-side and holes from P-side diffuse into N-side. Near the junction, immobile uncompensated ions (positive donor ions in N-region, negative acceptor ions in P-region) remain, creating an electric field that opposes further diffusion.',
        category: 'Semiconductors',
        difficulty: 'medium',
        reviewStatus: 'learning',
        timesReviewed: 4,
        lastReviewedAt: '2026-09-29T10:00:00Z',
      },
      {
        id: 'fc-2',
        documentId: physicsDoc.id,
        front: 'What is the primary difference between Zener Breakdown and Avalanche Breakdown?',
        back: 'Zener breakdown occurs in heavily doped diodes with thin depletion region (<10nm) at lower reverse voltages (<6V) due to quantum mechanical direct field tunneling. Avalanche breakdown occurs in lightly doped diodes with thick depletion region at higher voltages (>6V) via carrier impact ionization.',
        category: 'Breakdown',
        difficulty: 'hard',
        reviewStatus: 'review',
        timesReviewed: 6,
        lastReviewedAt: '2026-09-29T11:15:00Z',
      },
      {
        id: 'fc-3',
        documentId: physicsDoc.id,
        front: 'Write the formula for the Built-in Barrier Potential (V_bi).',
        back: 'V_bi = (k * T / q) * ln((N_A * N_D) / (n_i^2))\nAt room temperature (300K), kT/q ≈ 0.0259 V (Thermal Voltage V_t).',
        category: 'Formulas',
        difficulty: 'easy',
        reviewStatus: 'mastered',
        timesReviewed: 8,
        lastReviewedAt: '2026-09-28T16:00:00Z',
      },
      {
        id: 'fc-4',
        documentId: physicsDoc.id,
        front: 'What physical property does the sign of the Hall Coefficient (R_H) reveal?',
        back: 'The sign of R_H identifies the majority charge carrier type: Negative R_H = N-type (conduction dominated by electrons). Positive R_H = P-type (conduction dominated by holes).',
        category: 'Transport',
        difficulty: 'easy',
        reviewStatus: 'mastered',
        timesReviewed: 5,
        lastReviewedAt: '2026-09-27T14:00:00Z',
      },
      {
        id: 'fc-5',
        documentId: physicsDoc.id,
        front: 'Why is Helium gas added to Neon in a He-Ne laser?',
        back: 'Helium atoms are easily excited to metastable states (20.61 eV) by electrical discharge. They collide with Neon atoms, transferring energy via resonant excitation collisions because Neon has matching upper laser levels (20.66 eV), thereby achieving population inversion in Neon.',
        category: 'Lasers',
        difficulty: 'medium',
        reviewStatus: 'learning',
        timesReviewed: 3,
        lastReviewedAt: '2026-09-28T09:30:00Z',
      },
    ];
    this.flashcards.set(physicsDoc.id, physicsCards);

    // Quiz
    const physicsQuiz: Quiz = {
      id: 'quiz-phys-1',
      documentId: physicsDoc.id,
      title: 'Engineering Physics: Semiconductors & Optics Mastery',
      totalQuestions: 5,
      difficulty: 'medium',
      createdAt: new Date().toISOString(),
    };
    this.quizzes.set(physicsQuiz.id, physicsQuiz);

    const physicsQuestions: QuizQuestion[] = [
      {
        id: 'q-1',
        quizId: physicsQuiz.id,
        question: 'Under which reverse voltage condition does Zener breakdown predominantly occur?',
        type: 'mcq',
        options: ['Less than 6 Volts', 'Greater than 100 Volts', 'Between 20 and 50 Volts', 'Only at positive bias'],
        correctAnswer: 'Less than 6 Volts',
        explanation: 'Zener breakdown occurs in heavily doped PN junctions with narrow depletion widths at voltages below approximately 6V where direct electric field tunneling dominates.',
        sourcePage: 4,
        topicName: 'Zener Diode & Voltage Regulator',
        difficulty: 'medium',
      },
      {
        id: 'q-2',
        quizId: physicsQuiz.id,
        question: 'The built-in potential barrier V_bi of a PN junction increases when:',
        type: 'mcq',
        options: ['Doping concentration (N_A, N_D) increases', 'Temperature increases indefinitely', 'Doping concentration decreases', 'Reverse bias is removed'],
        correctAnswer: 'Doping concentration (N_A, N_D) increases',
        explanation: 'V_bi = (kT/q) * ln(N_A*N_D / n_i^2). Increasing N_A and N_D increases the numerator inside the logarithm, thereby increasing V_bi.',
        sourcePage: 3,
        topicName: 'PN Junction & Depletion Region',
        difficulty: 'easy',
      },
      {
        id: 'q-3',
        quizId: physicsQuiz.id,
        question: 'True or False: Direct bandgap semiconductors like GaAs are preferred over indirect bandgap silicon for LED manufacturing because momentum conservation allows efficient radiative recombination.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'In direct bandgap materials, the conduction band minimum and valence band maximum have identical crystal momentum, allowing direct photon emission without phonon participation.',
        sourcePage: 5,
        topicName: 'Photodiode & LED Principles',
        difficulty: 'easy',
      },
      {
        id: 'q-4',
        quizId: physicsQuiz.id,
        question: 'What is the Hall coefficient R_H for a sample with electron density n = 10^16 cm^-3?',
        type: 'mcq',
        options: ['-625 cm^3/C', '-0.0625 cm^3/C', '+1600 cm^3/C', '0 cm^3/C'],
        correctAnswer: '-625 cm^3/C',
        explanation: 'R_H = -1 / (n * q) = -1 / (10^16 * 1.6 x 10^-19) = -1 / (1.6 x 10^-3) = -625 cm^3/C.',
        sourcePage: 2,
        topicName: 'Hall Effect & Applications',
        difficulty: 'hard',
      },
      {
        id: 'q-5',
        quizId: physicsQuiz.id,
        question: 'What is the laser output wavelength emitted by a standard He-Ne gas laser?',
        type: 'mcq',
        options: ['632.8 nm (Red)', '1064 nm (Infrared)', '405 nm (Violet)', '532 nm (Green)'],
        correctAnswer: '632.8 nm (Red)',
        explanation: 'The characteristic visible red transition in a He-Ne laser is from Neon 3s2 to 2p4 state at 632.8 nm.',
        sourcePage: 6,
        topicName: 'He-Ne & Ruby Laser Systems',
        difficulty: 'medium',
      },
    ];
    this.quizQuestions.set(physicsQuiz.id, physicsQuestions);

    // PYQ Data
    const pyqs: PYQDocument[] = [
      { id: 'pyq-2023', documentId: physicsDoc.id, year: 2023, examName: 'End Semester University Exam 2023', totalMarks: 100, uploadedAt: '2026-09-20T10:00:00Z' },
      { id: 'pyq-2024', documentId: physicsDoc.id, year: 2024, examName: 'End Semester University Exam 2024', totalMarks: 100, uploadedAt: '2026-09-21T10:00:00Z' },
      { id: 'pyq-2025', documentId: physicsDoc.id, year: 2025, examName: 'End Semester University Exam 2025', totalMarks: 100, uploadedAt: '2026-09-22T10:00:00Z' },
    ];
    this.pyqDocuments.set(physicsDoc.id, pyqs);

    // Additional seed documents
    const dsaDoc: Document = {
      id: 'data-structures',
      userId: defaultUser.id,
      subjectId: 'subj-2',
      title: 'Data Structures & Algorithms — Advanced Concepts',
      fileName: 'DSA_Comprehensive_Exam_Guide.pdf',
      fileSize: 6124500,
      pageCount: 36,
      status: 'ready',
      createdAt: '2026-09-22T11:00:00Z',
      updatedAt: '2026-09-28T18:00:00Z',
    };
    this.documents.set(dsaDoc.id, dsaDoc);

    const dsaPages: DocumentPage[] = [
      {
        id: 'dsa-page-1',
        documentId: dsaDoc.id,
        pageNumber: 1,
        text: 'Module 1: Advanced Graph Algorithms. Single-Source Shortest Paths: Dijkstra\'s Algorithm uses a priority queue / min-heap with time complexity O((V + E) log V). It requires non-negative edge weights. Bellman-Ford Algorithm computes single-source shortest paths in O(V * E) time, handling negative edge weights and detecting negative weight cycles if any distance can still be relaxed after V - 1 iterations. All-Pairs Shortest Path: Floyd-Warshall uses dynamic programming with recurrence dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]) in O(V^3) time.',
        hasImages: true,
      },
      {
        id: 'dsa-page-2',
        documentId: dsaDoc.id,
        pageNumber: 2,
        text: 'Module 2: Dynamic Programming Paradigms. Two key properties: 1. Optimal Substructure (an optimal solution contains optimal solutions to subproblems), 2. Overlapping Subproblems (subproblems are revisited multiple times). In the 0/1 Knapsack Problem: given weights w[i] and values v[i], dp[i][w] = max(dp[i-1][w], dp[i-1][w - w[i]] + v[i]). Space complexity can be optimized from O(N * W) to O(W) by iterating capacity backwards. Longest Common Subsequence (LCS) has O(M * N) complexity.',
        hasImages: true,
      },
      {
        id: 'dsa-page-3',
        documentId: dsaDoc.id,
        pageNumber: 3,
        text: 'Module 3: Self-Balancing Binary Search Trees. AVL Trees: Enforces balance factor BF = height(left) - height(right) in {-1, 0, 1}. Four rotation cases restore balance in O(1) time: Left-Left (Right Rotation), Right-Right (Left Rotation), Left-Right (LR double rotation), and Right-Left (RL double rotation). Maximum AVL height is strictly bounded by 1.44 * log2(N + 2). Red-Black Trees maintain black-height invariants and require at most 2 rotations per insertion.',
        hasImages: true,
      },
      {
        id: 'dsa-page-4',
        documentId: dsaDoc.id,
        pageNumber: 4,
        text: 'Module 4: Heaps & Priority Queues. Binary Max-Heap: Complete binary tree satisfying A[parent(i)] >= A[i]. Bottom-up heap construction (heapify) on an array of size N runs in linear time O(N), not O(N log N), because sum_{h=0}^{log N} (h / 2^h) converges to 2. Extract-Max and Insert operations take O(log N). Priority queues are central to greedy algorithms like Prim\'s Minimum Spanning Tree (MST) and Huffman Coding.',
        hasImages: true,
      },
      {
        id: 'dsa-page-5',
        documentId: dsaDoc.id,
        pageNumber: 5,
        text: 'Module 5: String Matching & Disjoint Set Union (DSU). Knuth-Morris-Pratt (KMP) Algorithm: Avoids backtracking by precomputing the Longest Proper Prefix which is also a Suffix (LPS array or π-table) in O(M) time, giving total matching time O(N + M). Disjoint Set Union (Union-Find): With Union by Rank and Path Compression heuristics, any sequence of M operations on N elements runs in O(M * α(N)) time, where α is the extremely slow-growing inverse Ackermann function.',
        hasImages: true,
      },
    ];
    this.documentPages.set(dsaDoc.id, dsaPages);

    const dsaChunks: DocumentChunk[] = dsaPages.map((page, idx) => ({
      id: `chunk-dsa-${idx + 1}`,
      documentId: dsaDoc.id,
      pageNumber: page.pageNumber,
      chunkIndex: idx,
      text: page.text,
      keywords: ['graph', 'dijkstra', 'bellman-ford', 'knapsack', 'avl tree', 'heap', 'kmp'],
    }));
    this.documentChunks.set(dsaDoc.id, dsaChunks);

    const dsaSummary: Summary = {
      id: 'sum-dsa-1',
      documentId: dsaDoc.id,
      quickSummary:
        'Advanced algorithmic foundations covering graph shortest path algorithms (Dijkstra, Bellman-Ford, Floyd-Warshall), dynamic programming invariants (0/1 Knapsack, LCS), self-balancing AVL search trees, linear-time heap construction, and KMP pattern matching.',
      detailedSummary: [
        {
          chapter: '1. Graph Shortest Paths & Negative Cycles',
          content: 'Examines single-source and all-pairs shortest path algorithms, comparing time complexities, edge weight restrictions, and negative cycle detection techniques.',
          keyPoints: [
            'Dijkstra runs in O((V + E) log V) with min-heaps but fails with negative edge weights.',
            'Bellman-Ford operates in O(V * E) and detects negative cycles on the V-th relaxation step.',
            'Floyd-Warshall all-pairs DP recurrence: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).',
          ],
        },
        {
          chapter: '2. Dynamic Programming & Space Optimization',
          content: 'Details optimal substructure, 0/1 Knapsack state transitions, 1D space reduction, and 2D grid dynamic programming.',
          keyPoints: [
            '0/1 Knapsack state: dp[i][w] = max(dp[i-1][w], dp[i-1][w - w[i]] + v[i]).',
            'Space optimization from O(N * W) to O(W) requires iterating capacity backwards.',
            'LCS table construction runs in O(M * N) time and space.',
          ],
        },
        {
          chapter: '3. Balanced Trees, Heaps & String Search',
          content: 'Explains AVL single and double rotations, linear-time O(N) heap build proof, and KMP prefix table.',
          keyPoints: [
            'AVL balance factor must remain in {-1, 0, +1}; LR rotation requires left-then-right rotation.',
            'Building a binary heap from unsorted array runs in O(N) time.',
            'KMP matching achieves O(N + M) runtime using the LPS π-table.',
          ],
        },
      ],
      keyConcepts: [
        {
          title: 'Bellman-Ford Negative Cycle Detection',
          explanation: 'If a shortest path distance can still be decreased after V - 1 relaxation iterations, the graph contains a negative weight cycle reachable from the source.',
          importance: 'high',
        },
        {
          title: '0/1 Knapsack Optimal Substructure',
          explanation: 'The optimal choice for item i depends strictly on whether including it yields greater value than excluding it given remaining capacity.',
          importance: 'high',
        },
        {
          title: 'AVL Tree Rotations',
          explanation: 'Constant-time pointer adjustments (LL, RR, LR, RL) that restore binary search tree height balance without violating order invariant.',
          importance: 'high',
        },
      ],
      formulas: [
        {
          formula: 'dp[i][w] = max(dp[i-1][w], dp[i-1][w - w_i] + v_i)',
          description: '0/1 Knapsack Recurrence Relation',
          variables: ['dp[i][w] = maximum value using first i items with capacity w', 'w_i = weight of item i', 'v_i = value of item i'],
        },
        {
          formula: 'T(V, E) = O((V + E) * log(V))',
          description: 'Dijkstra Time Complexity with Min-Heap',
          variables: ['V = Number of vertices', 'E = Number of edges'],
        },
        {
          formula: 'Height(AVL) <= 1.44 * log_2(N + 2) - 0.328',
          description: 'Upper bound on AVL Tree Height',
          variables: ['N = Number of nodes in the AVL tree'],
        },
      ],
      definitions: [
        { term: 'Optimal Substructure', definition: 'A problem exhibits optimal substructure if an optimal solution to the problem contains within it optimal solutions to subproblems.' },
        { term: 'Amortized Analysis', definition: 'A method for analyzing a sequence of operations that guarantees the average performance of each operation in the worst case.' },
        { term: 'Balance Factor', definition: 'The height of the left subtree minus the height of the right subtree for any given node in a binary search tree.' },
      ],
      lastMinuteRevision: [
        'Dijkstra does not work with negative edge weights; use Bellman-Ford instead.',
        'Bellman-Ford relaxes all edges V - 1 times; a further relaxation indicates a negative cycle.',
        '0/1 Knapsack space optimization to 1D array requires iterating capacity w backwards from W down to w_i.',
        'Building a heap of N elements takes O(N) time, while heapsort takes O(N log N).',
        'KMP avoids re-checking matched characters using the LPS table in O(N + M) total time.',
      ],
      createdAt: new Date().toISOString(),
    };
    this.summaries.set(dsaDoc.id, dsaSummary);

    const dsaTopics: Topic[] = [
      {
        id: 'top-dsa-1',
        documentId: dsaDoc.id,
        name: 'Graph Shortest Paths & Negative Cycles',
        documentImportance: 95,
        examFrequency: 100,
        weightagePercentage: 26,
        examYears: [2023, 2024, 2025],
        status: 'studying',
        keyNotes: 'Frequently asked 10-mark question: trace Dijkstra step-by-step or prove Bellman-Ford negative cycle detection.',
      },
      {
        id: 'top-dsa-2',
        documentId: dsaDoc.id,
        name: '0/1 Knapsack & Dynamic Programming',
        documentImportance: 90,
        examFrequency: 80,
        weightagePercentage: 24,
        examYears: [2023, 2024],
        status: 'to_study',
        keyNotes: 'Always write both the state recurrence formula and the 2D DP table for 5 items.',
      },
      {
        id: 'top-dsa-3',
        documentId: dsaDoc.id,
        name: 'AVL Trees & Balance Rotations',
        documentImportance: 85,
        examFrequency: 75,
        weightagePercentage: 20,
        examYears: [2024, 2025],
        status: 'to_study',
        keyNotes: 'Constructing an AVL tree by inserting 7-8 keys and drawing LL/LR rotations.',
      },
      {
        id: 'top-dsa-4',
        documentId: dsaDoc.id,
        name: 'Heap Construction & Priority Queues',
        documentImportance: 70,
        examFrequency: 60,
        weightagePercentage: 15,
        examYears: [2023, 2025],
        status: 'to_study',
        keyNotes: 'Derivation of the O(N) linear time bound for bottom-up Build-Heap.',
      },
      {
        id: 'top-dsa-5',
        documentId: dsaDoc.id,
        name: 'KMP String Matching & LPS Table',
        documentImportance: 65,
        examFrequency: 50,
        weightagePercentage: 15,
        examYears: [2024],
        status: 'mastered',
        keyNotes: 'Calculating the π-table (LPS array) for pattern strings.',
      },
    ];
    this.topics.set(dsaDoc.id, dsaTopics);

    const dsaCards: Flashcard[] = [
      {
        id: 'fc-dsa-1',
        documentId: dsaDoc.id,
        front: 'Why does Dijkstra\'s Algorithm fail in graphs with negative edge weights?',
        back: 'Dijkstra greedily assumes that once a vertex is marked visited (extracted from min-heap), its shortest distance is finalized. A negative edge encountered later could produce a shorter path to an already visited vertex, violating the greedy invariant. Bellman-Ford should be used instead.',
        category: 'Graphs',
        difficulty: 'medium',
        reviewStatus: 'learning',
        timesReviewed: 5,
        lastReviewedAt: '2026-09-28T10:00:00Z',
      },
      {
        id: 'fc-dsa-2',
        documentId: dsaDoc.id,
        front: 'What is the time complexity of building a Binary Heap from an unsorted array of size N?',
        back: 'O(N) linear time. Although it seems like N * O(log N), nodes near the bottom have smaller heights. The mathematical summation sum_{h=0}^{log N} (N / 2^(h+1)) * O(h) converges to O(N).',
        category: 'Heaps',
        difficulty: 'hard',
        reviewStatus: 'review',
        timesReviewed: 4,
        lastReviewedAt: '2026-09-27T11:00:00Z',
      },
      {
        id: 'fc-dsa-3',
        documentId: dsaDoc.id,
        front: 'In 0/1 Knapsack, why must the 1D DP array be traversed backwards (from W down to w_i)?',
        back: 'Traversing backwards ensures that values from the current item i do not overwrite and reuse entries from the SAME item, guaranteeing each item is included at most once (0/1 constraint). Forward traversal solves the Unbounded Knapsack problem.',
        category: 'Dynamic Programming',
        difficulty: 'hard',
        reviewStatus: 'learning',
        timesReviewed: 3,
        lastReviewedAt: '2026-09-28T14:30:00Z',
      },
      {
        id: 'fc-dsa-4',
        documentId: dsaDoc.id,
        front: 'What four balance rotation cases exist in an AVL Tree?',
        back: '1. Left-Left (LL): Solved by a single Right Rotation.\n2. Right-Right (RR): Solved by a single Left Rotation.\n3. Left-Right (LR): Left rotation on left child, then right rotation on root.\n4. Right-Left (RL): Right rotation on right child, then left rotation on root.',
        category: 'Trees',
        difficulty: 'easy',
        reviewStatus: 'mastered',
        timesReviewed: 7,
        lastReviewedAt: '2026-09-26T09:00:00Z',
      },
      {
        id: 'fc-dsa-5',
        documentId: dsaDoc.id,
        front: 'What is the π-table (LPS array) in the KMP Algorithm?',
        back: 'The LPS (Longest Proper Prefix which is also a Suffix) array stores the length of the longest proper prefix of pattern[0..i] that is also a suffix of pattern[0..i]. It enables the search pointer to jump forward without re-examining already matched characters.',
        category: 'Strings',
        difficulty: 'medium',
        reviewStatus: 'learning',
        timesReviewed: 2,
        lastReviewedAt: '2026-09-28T16:00:00Z',
      },
    ];
    this.flashcards.set(dsaDoc.id, dsaCards);

    const dsaQuiz: Quiz = {
      id: 'quiz-dsa-1',
      documentId: dsaDoc.id,
      title: 'Data Structures & Algorithms: Graphs & DP Mastery',
      totalQuestions: 5,
      difficulty: 'hard',
      createdAt: new Date().toISOString(),
    };
    this.quizzes.set(dsaQuiz.id, dsaQuiz);

    const dsaQuestions: QuizQuestion[] = [
      {
        id: 'q-dsa-1',
        quizId: dsaQuiz.id,
        question: 'How does Bellman-Ford algorithm detect a negative weight cycle in a graph with V vertices?',
        type: 'mcq',
        options: [
          'If any edge distance can still be relaxed on the V-th iteration',
          'If the priority queue becomes empty before visiting all vertices',
          'If the graph has more edges than vertices',
          'If the source vertex distance becomes 0'
        ],
        correctAnswer: 'If any edge distance can still be relaxed on the V-th iteration',
        explanation: 'In a graph without negative cycles, shortest paths have at most V - 1 edges. If an edge can still be relaxed on iteration V, a negative cycle must exist.',
        sourcePage: 1,
        topicName: 'Graph Shortest Paths & Negative Cycles',
        difficulty: 'medium',
      },
      {
        id: 'q-dsa-2',
        quizId: dsaQuiz.id,
        question: 'What is the tight asymptotic time complexity of building a binary heap of N elements using the bottom-up Heapify approach?',
        type: 'mcq',
        options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(log N)'],
        correctAnswer: 'O(N)',
        explanation: 'Due to the sum of geometric series h/2^h converging to a constant, the bottom-up Build-Heap algorithm runs in strictly O(N) time.',
        sourcePage: 4,
        topicName: 'Heap Construction & Priority Queues',
        difficulty: 'hard',
      },
      {
        id: 'q-dsa-3',
        quizId: dsaQuiz.id,
        question: 'True or False: In 0/1 Knapsack with capacity W and items N, optimizing space to a single 1D array requires iterating the capacity index in descending order from W down to w_i.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Iterating backwards prevents overwriting subproblem solutions from the same item, ensuring each item is used at most once.',
        sourcePage: 2,
        topicName: '0/1 Knapsack & Dynamic Programming',
        difficulty: 'medium',
      },
      {
        id: 'q-dsa-4',
        quizId: dsaQuiz.id,
        question: 'Which sequence of rotations balances an AVL node that is Left-Heavy due to an insertion into the right subtree of its left child?',
        type: 'mcq',
        options: ['Left Rotation on left child, then Right Rotation on root (LR)', 'Single Right Rotation (LL)', 'Single Left Rotation (RR)', 'Right Rotation on right child, then Left Rotation on root (RL)'],
        correctAnswer: 'Left Rotation on left child, then Right Rotation on root (LR)',
        explanation: 'A Left-Right (LR) imbalance requires a Left rotation on the left child followed by a Right rotation on the parent node.',
        sourcePage: 3,
        topicName: 'AVL Trees & Balance Rotations',
        difficulty: 'medium',
      },
      {
        id: 'q-dsa-5',
        quizId: dsaQuiz.id,
        question: 'What is the overall worst-case pattern matching time of the KMP algorithm for text of length N and pattern of length M?',
        type: 'mcq',
        options: ['O(N + M)', 'O(N * M)', 'O(N log M)', 'O(M^2)'],
        correctAnswer: 'O(N + M)',
        explanation: 'Precomputing the LPS table takes O(M) time and scanning the text takes O(N) time, giving O(N + M) total time.',
        sourcePage: 5,
        topicName: 'KMP String Matching & LPS Table',
        difficulty: 'easy',
      },
    ];
    this.quizQuestions.set(dsaQuiz.id, dsaQuestions);

    const dsaPyqs: PYQDocument[] = [
      { id: 'pyq-dsa-2023', documentId: dsaDoc.id, year: 2023, examName: 'End Semester University Exam 2023', totalMarks: 100, uploadedAt: '2026-09-20T10:00:00Z' },
      { id: 'pyq-dsa-2024', documentId: dsaDoc.id, year: 2024, examName: 'End Semester University Exam 2024', totalMarks: 100, uploadedAt: '2026-09-21T10:00:00Z' },
      { id: 'pyq-dsa-2025', documentId: dsaDoc.id, year: 2025, examName: 'End Semester University Exam 2025', totalMarks: 100, uploadedAt: '2026-09-22T10:00:00Z' },
    ];
    this.pyqDocuments.set(dsaDoc.id, dsaPyqs);

    const mathDoc: Document = {
      id: 'mathematics-iii',
      userId: defaultUser.id,
      subjectId: 'subj-3',
      title: 'Applied Mathematics III — Transforms & PDEs',
      fileName: 'Mathematics_III_Semester_Notes.pdf',
      fileSize: 5210980,
      pageCount: 42,
      status: 'ready',
      createdAt: '2026-09-20T14:00:00Z',
      updatedAt: '2026-09-27T12:00:00Z',
    };
    this.documents.set(mathDoc.id, mathDoc);

    const mathPages: DocumentPage[] = [
      {
        id: 'math-page-1',
        documentId: mathDoc.id,
        pageNumber: 1,
        text: 'Module 1: Laplace Transforms & Applications. Definition: L{f(t)} = F(s) = \\int_0^\\infty e^{-st} f(t) dt for s > 0. Linearity and First Shifting Property: L{e^{at} f(t)} = F(s - a). Second Shifting Property (Heaviside unit step function): L{f(t - a) u(t - a)} = e^{-as} F(s). Transforms of derivatives: L{f\'(t)} = s F(s) - f(0) and L{f\'\'(t)} = s^2 F(s) - s f(0) - f\'(0). Convolution Theorem: L{(f * g)(t)} = F(s) * G(s). Used for solving linear differential equations with initial boundary conditions.',
        hasImages: true,
      },
      {
        id: 'math-page-2',
        documentId: mathDoc.id,
        pageNumber: 2,
        text: 'Module 2: Fourier Series & Transforms. Fourier series expansion of periodic function f(x) of period 2L: f(x) = a_0/2 + \\sum_{n=1}^\\infty [a_n cos(nπx/L) + b_n sin(nπx/L)]. Euler\'s formulas for Fourier coefficients: a_0 = (1/L) \\int_{-L}^L f(x) dx, a_n = (1/L) \\int_{-L}^L f(x) cos(nπx/L) dx, b_n = (1/L) \\int_{-L}^L f(x) sin(nπx/L) dx. Dirichlet conditions: f(x) must be bounded, piecewise continuous, with a finite number of maxima and minima.',
        hasImages: true,
      },
      {
        id: 'math-page-3',
        documentId: mathDoc.id,
        pageNumber: 3,
        text: 'Module 3: Partial Differential Equations (PDEs). Classification of second-order PDEs: B^2 - 4AC < 0 (Elliptic, e.g. Laplace equation ∇^2 u = 0), B^2 - 4AC = 0 (Parabolic, e.g. Heat equation ∂u/∂t = c^2 ∂^2u/∂x^2), B^2 - 4AC > 0 (Hyperbolic, e.g. One-dimensional Wave equation ∂^2u/∂t^2 = c^2 ∂^2u/∂x^2). Method of Separation of Variables: u(x, t) = X(x) * T(t) leads to ordinary differential equations with boundary eigenvalues.',
        hasImages: true,
      },
      {
        id: 'math-page-4',
        documentId: mathDoc.id,
        pageNumber: 4,
        text: 'Module 4: Complex Variables & Analytic Functions. A complex function f(z) = u(x, y) + i v(x, y) is analytic if it satisfies the Cauchy-Riemann Equations: ∂u/∂x = ∂v/∂y and ∂u/∂y = -∂v/∂x, with continuous partial derivatives. Harmonic functions: ∇^2 u = 0 and ∇^2 v = 0. Cauchy Integral Theorem: ∮_C f(z) dz = 0 for any closed contour in a simply connected domain. Residue Theorem: ∮_C f(z) dz = 2πi * \\sum Res(f, z_k).',
        hasImages: true,
      },
    ];
    this.documentPages.set(mathDoc.id, mathPages);

    const mathChunks: DocumentChunk[] = mathPages.map((page, idx) => ({
      id: `chunk-math-${idx + 1}`,
      documentId: mathDoc.id,
      pageNumber: page.pageNumber,
      chunkIndex: idx,
      text: page.text,
      keywords: ['laplace', 'fourier', 'pde', 'cauchy-riemann', 'heat equation', 'wave equation'],
    }));
    this.documentChunks.set(mathDoc.id, mathChunks);

    const mathSummary: Summary = {
      id: 'sum-math-1',
      documentId: mathDoc.id,
      quickSummary:
        'Applied engineering mathematics covering integral transforms (Laplace and Fourier), separation of variables for partial differential equations (wave, heat, Laplace equations), and complex variable calculus with Cauchy-Riemann equations and contour integration.',
      detailedSummary: [
        {
          chapter: '1. Laplace Transforms & ODE Initial Value Problems',
          content: 'Covers shifting theorems, derivative rules, Dirac delta distributions, and convolution for solving initial value differential equations.',
          keyPoints: [
            'L{f\'(t)} = s F(s) - f(0) converts differential equations into algebraic equations.',
            'Convolution theorem L{f * g} = F(s) * G(s) simplifies inverse transforms.',
          ],
        },
        {
          chapter: '2. Fourier Series & Boundary Value Problems',
          content: 'Details periodic function expansion, Dirichlet conditions, half-range cosine and sine expansions, and Parseval identity.',
          keyPoints: [
            'Even functions produce purely cosine series (b_n = 0); odd functions produce sine series (a_n = 0).',
            'Dirichlet conditions guarantee convergence to average value at jump discontinuities.',
          ],
        },
        {
          chapter: '3. PDEs & Complex Analysis',
          content: 'Classification of second-order PDEs and complex variable analyticity via Cauchy-Riemann equations.',
          keyPoints: [
            '1D Wave equation is hyperbolic (B^2 - 4AC > 0); Heat equation is parabolic.',
            'Cauchy-Riemann equations: u_x = v_y, u_y = -v_x.',
            'Residue theorem enables evaluating real definite integrals from -inf to +inf.',
          ],
        },
      ],
      keyConcepts: [
        {
          title: 'Cauchy-Riemann Equations',
          explanation: 'Necessary and sufficient conditions for differentiability of a complex function f(z) = u + iv.',
          importance: 'high',
        },
        {
          title: 'Separation of Variables in PDEs',
          explanation: 'Expressing u(x, t) = X(x)T(t) converts a partial differential equation into coupled ordinary differential equations with boundary condition eigenvalues.',
          importance: 'high',
        },
      ],
      formulas: [
        {
          formula: 'L\\{f\'\'(t)\\} = s^2 F(s) - s f(0) - f\'(0)',
          description: 'Laplace Transform of Second Derivative',
          variables: ['s = Complex frequency parameter', 'F(s) = Laplace transform of f(t)'],
        },
        {
          formula: '\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y}, \\quad \\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}',
          description: 'Cauchy-Riemann Equations',
          variables: ['u = Real part of f(z)', 'v = Imaginary part of f(z)'],
        },
      ],
      definitions: [
        { term: 'Analytic Function', definition: 'A complex function that is complex-differentiable at every point in an open neighborhood.' },
        { term: 'Harmonic Function', definition: 'A twice continuously differentiable function that satisfies Laplace\'s equation ∇^2 u = 0.' },
      ],
      lastMinuteRevision: [
        'Laplace: L{sin(at)} = a / (s^2 + a^2), L{cos(at)} = s / (s^2 + a^2).',
        'Fourier: Even function -> b_n = 0; Odd function -> a_0 = 0, a_n = 0.',
        'Wave equation: u_tt = c^2 u_xx (Hyperbolic); Heat equation: u_t = c^2 u_xx (Parabolic).',
        'Cauchy-Riemann equations: u_x = v_y, u_y = -v_x.',
      ],
      createdAt: new Date().toISOString(),
    };
    this.summaries.set(mathDoc.id, mathSummary);

    const mathTopics: Topic[] = [
      { id: 'top-math-1', documentId: mathDoc.id, name: 'Laplace Transforms & Differential Equations', documentImportance: 95, examFrequency: 100, weightagePercentage: 28, examYears: [2023, 2024, 2025], status: 'studying', keyNotes: '100% guaranteed 10-mark question: solve y\'\' + ay\' + by = f(t) with initial values.' },
      { id: 'top-math-2', documentId: mathDoc.id, name: 'Fourier Series & Half-Range Expansions', documentImportance: 90, examFrequency: 85, weightagePercentage: 24, examYears: [2023, 2024, 2025], status: 'to_study', keyNotes: 'Half-range cosine series of f(x) = x^2 and deduction of π^2 / 6.' },
      { id: 'top-math-3', documentId: mathDoc.id, name: 'Cauchy-Riemann Equations & Harmonic Conjugates', documentImportance: 85, examFrequency: 75, weightagePercentage: 22, examYears: [2023, 2025], status: 'to_study', keyNotes: 'Given u(x, y), find harmonic conjugate v(x, y) and write f(z) in terms of z using Milne-Thomson.' },
      { id: 'top-math-4', documentId: mathDoc.id, name: '1D Wave & Heat Equations (PDEs)', documentImportance: 80, examFrequency: 70, weightagePercentage: 26, examYears: [2024, 2025], status: 'to_study', keyNotes: 'Vibrating string with fixed ends u(0, t) = u(L, t) = 0.' },
    ];
    this.topics.set(mathDoc.id, mathTopics);

    const mathCards: Flashcard[] = [
      { id: 'fc-math-1', documentId: mathDoc.id, front: 'State the Cauchy-Riemann equations in Cartesian coordinates.', back: '∂u/∂x = ∂v/∂y  and  ∂u/∂y = -∂v/∂x. If these equations hold and partial derivatives are continuous, f(z) = u + iv is analytic.', category: 'Complex Analysis', difficulty: 'easy', reviewStatus: 'mastered', timesReviewed: 6, lastReviewedAt: '2026-09-28T12:00:00Z' },
      { id: 'fc-math-2', documentId: mathDoc.id, front: 'What is the Convolution Theorem for Laplace transforms?', back: 'L{(f * g)(t)} = L{f(t)} * L{g(t)} = F(s) * G(s), where (f * g)(t) = \\int_0^t f(\\tau) g(t - \\tau) d\\tau.', category: 'Transforms', difficulty: 'medium', reviewStatus: 'learning', timesReviewed: 3, lastReviewedAt: '2026-09-27T10:00:00Z' },
      { id: 'fc-math-3', documentId: mathDoc.id, front: 'How are second order linear PDEs classified using B^2 - 4AC?', back: 'B^2 - 4AC < 0: Elliptic (Laplace Eq).\nB^2 - 4AC = 0: Parabolic (Heat Eq).\nB^2 - 4AC > 0: Hyperbolic (Wave Eq).', category: 'PDEs', difficulty: 'easy', reviewStatus: 'mastered', timesReviewed: 5, lastReviewedAt: '2026-09-29T08:00:00Z' },
    ];
    this.flashcards.set(mathDoc.id, mathCards);

    const mathQuiz: Quiz = { id: 'quiz-math-1', documentId: mathDoc.id, title: 'Mathematics III: Transforms & Complex Variables', totalQuestions: 3, difficulty: 'medium', createdAt: new Date().toISOString() };
    this.quizzes.set(mathQuiz.id, mathQuiz);

    const mathQuestions: QuizQuestion[] = [
      { id: 'q-math-1', quizId: mathQuiz.id, question: 'Which PDE represents the one-dimensional heat conduction equation?', type: 'mcq', options: ['∂u/∂t = c^2 ∂^2u/∂x^2', '∂^2u/∂t^2 = c^2 ∂^2u/∂x^2', '∂^2u/∂x^2 + ∂^2u/∂y^2 = 0', '∂u/∂t + c ∂u/∂x = 0'], correctAnswer: '∂u/∂t = c^2 ∂^2u/∂x^2', explanation: 'The 1D heat equation is a parabolic PDE relating the first time derivative with the second spatial derivative.', sourcePage: 3, topicName: '1D Wave & Heat Equations (PDEs)', difficulty: 'easy' },
      { id: 'q-math-2', quizId: mathQuiz.id, question: 'If f(z) = u + iv is analytic, then both u and v satisfy which equation?', type: 'mcq', options: ['Laplace Equation (∇^2 = 0)', 'Wave Equation', 'Helmholtz Equation', 'Euler Equation'], correctAnswer: 'Laplace Equation (∇^2 = 0)', explanation: 'The real and imaginary parts of an analytic function are harmonic conjugates and satisfy Laplace\'s equation ∇^2 u = 0 and ∇^2 v = 0.', sourcePage: 4, topicName: 'Cauchy-Riemann Equations & Harmonic Conjugates', difficulty: 'medium' },
      { id: 'q-math-3', quizId: mathQuiz.id, question: 'What is the Laplace transform L{e^{3t} sin(2t)}?', type: 'mcq', options: ['2 / ((s - 3)^2 + 4)', '2 / (s^2 + 4)', '(s - 3) / ((s - 3)^2 + 4)', '3 / ((s - 2)^2 + 9)'], correctAnswer: '2 / ((s - 3)^2 + 4)', explanation: 'Using the first shifting theorem L{e^{at} f(t)} = F(s - a), since L{sin(2t)} = 2/(s^2+4), the result is 2/((s-3)^2+4).', sourcePage: 1, topicName: 'Laplace Transforms & Differential Equations', difficulty: 'easy' },
    ];
    this.quizQuestions.set(mathQuiz.id, mathQuestions);

    const mathPyqs: PYQDocument[] = [
      { id: 'pyq-math-2023', documentId: mathDoc.id, year: 2023, examName: 'End Semester University Exam 2023', totalMarks: 100, uploadedAt: '2026-09-20T10:00:00Z' },
      { id: 'pyq-math-2024', documentId: mathDoc.id, year: 2024, examName: 'End Semester University Exam 2024', totalMarks: 100, uploadedAt: '2026-09-21T10:00:00Z' },
      { id: 'pyq-math-2025', documentId: mathDoc.id, year: 2025, examName: 'End Semester University Exam 2025', totalMarks: 100, uploadedAt: '2026-09-22T10:00:00Z' },
    ];
    this.pyqDocuments.set(mathDoc.id, mathPyqs);

    const deDoc: Document = {
      id: 'digital-electronics',
      userId: defaultUser.id,
      subjectId: 'subj-4',
      title: 'Digital Electronics — Logic & Sequential Circuits',
      fileName: 'Digital_Circuits_Lecture_Notes.pdf',
      fileSize: 3980100,
      pageCount: 24,
      status: 'ready',
      createdAt: '2026-09-18T10:00:00Z',
      updatedAt: '2026-09-26T16:00:00Z',
    };
    this.documents.set(deDoc.id, deDoc);

    const dePages: DocumentPage[] = [
      {
        id: 'de-page-1',
        documentId: deDoc.id,
        pageNumber: 1,
        text: 'Module 1: Boolean Algebra & Karnaugh Maps (K-Maps). Axiomatic laws of Boolean algebra: De Morgan\'s laws (A + B)\' = A\' B\' and (A B)\' = A\' + B\'. Sum of Products (SOP) and Product of Sums (POS) standard canonical forms. Karnaugh Map minimization: 2, 3, and 4-variable K-maps with Gray code cell numbering. Grouping rules: adjacent cells in powers of 2 (1, 2, 4, 8, 16) with rolling boundary adjacency. Don\'t care conditions (X) can be treated as 1 or 0 to form larger groups and minimize logic gates.',
        hasImages: true,
      },
      {
        id: 'de-page-2',
        documentId: deDoc.id,
        pageNumber: 2,
        text: 'Module 2: Combinational Logic Circuits. Design of Adders: Half Adder (Sum = A ⊕ B, Carry = A B) and Full Adder (Sum = A ⊕ B ⊕ C_in, Carry = A B + C_in(A ⊕ B)). Lookahead Carry Generator: reduces propagation delay from O(N) in ripple-carry adders to O(1) using carry generate G_i = A_i B_i and carry propagate P_i = A_i ⊕ B_i. Multiplexers (MUX): 2^n-to-1 multiplexers as universal logic function generators. Decoders: 3-to-8 decoder with active-low enable and priority encoders.',
        hasImages: true,
      },
      {
        id: 'de-page-3',
        documentId: deDoc.id,
        pageNumber: 3,
        text: 'Module 3: Flip-Flops & Sequential Logic. Latches vs Flip-Flops: Level-triggered vs edge-triggered storage elements. SR Flip-Flop: Forbidden invalid state when S=1, R=1. JK Flip-Flop: Eliminates invalid state by toggling (Q_next = Q\') when J=1, K=1. Race-around condition in JK flip-flop occurs when propagation delay t_pd < clock pulse width t_w. Resolved using Master-Slave JK Flip-Flop or Edge-Triggered Flip-Flops. D Flip-Flop (Data/Delay, Q_next = D) and T Flip-Flop (Toggle, Q_next = T ⊕ Q). Excitation tables for flip-flop conversions.',
        hasImages: true,
      },
      {
        id: 'de-page-4',
        documentId: deDoc.id,
        pageNumber: 4,
        text: 'Module 4: Counters & Finite State Machines (FSM). Asynchronous (Ripple) Counters: Clock applied only to first stage, subsequent stages clocked by previous flip-flop output, accumulating propagation delay. Synchronous Counters: Common clock applied simultaneously to all flip-flops, eliminating cumulative delay. Design of Mod-N and BCD Decade Counters using state tables and K-maps. Finite State Machines: Mealy Machine (outputs depend on both current state and current inputs) vs Moore Machine (outputs depend solely on current state). State reduction and state assignment techniques.',
        hasImages: true,
      },
    ];
    this.documentPages.set(deDoc.id, dePages);

    const deChunks: DocumentChunk[] = dePages.map((page, idx) => ({
      id: `chunk-de-${idx + 1}`,
      documentId: deDoc.id,
      pageNumber: page.pageNumber,
      chunkIndex: idx,
      text: page.text,
      keywords: ['k-map', 'flip-flop', 'multiplexer', 'counter', 'fsm', 'boolean algebra'],
    }));
    this.documentChunks.set(deDoc.id, deChunks);

    const deSummary: Summary = {
      id: 'sum-de-1',
      documentId: deDoc.id,
      quickSummary:
        'Fundamental and advanced digital electronics course covering Boolean algebra reduction with K-maps, high-speed combinational circuits (carry-lookahead adders, multiplexers), sequential storage elements (master-slave JK flip-flops), and synchronous finite state machine counters.',
      detailedSummary: [
        {
          chapter: '1. K-Map Minimization & Logic Simplification',
          content: 'Covers Gray code cell placement, prime implicants, essential prime implicants, and don\'t-care condition optimization.',
          keyPoints: [
            'Gray code ensures only one bit changes between adjacent cells.',
            'Essential prime implicants must be included in minimal SOP expressions.',
          ],
        },
        {
          chapter: '2. Sequential Latches & Flip-Flops',
          content: 'Examines clock triggering, race-around condition, master-slave architecture, and characteristic equations.',
          keyPoints: [
            'JK Flip-Flop characteristic equation: Q_{next} = J Q\' + K\' Q.',
            'Race-around condition occurs when clock pulse width exceeds flip-flop propagation delay.',
          ],
        },
        {
          chapter: '3. Synchronous Counters & FSM Design',
          content: 'Step-by-step synthesis of Mod-N counters using excitation tables, and contrast between Mealy and Moore models.',
          keyPoints: [
            'Synchronous counters avoid cumulative ripple delay because all stages share one clock.',
            'Moore outputs are synchronous with state clock; Mealy outputs can react asynchronously to input changes.',
          ],
        },
      ],
      keyConcepts: [
        { title: 'Race-Around Condition in JK Flip-Flop', explanation: 'When J=1 and K=1 with clock pulse width greater than propagation delay, output continuously toggles between 0 and 1, creating an indeterminate final state. Cured by Master-Slave configuration.', importance: 'high' },
        { title: 'Mealy vs Moore FSM', explanation: 'Moore machine outputs depend solely on the current state, whereas Mealy machine outputs depend on both the current state and present inputs.', importance: 'high' },
      ],
      formulas: [
        { formula: 'Q_{next} = J \\cdot \\overline{Q} + \\overline{K} \\cdot Q', description: 'JK Flip-Flop Characteristic Equation', variables: ['J, K = Input signals', 'Q = Current state output', 'Q_{next} = Next state output'] },
        { formula: 'Q_{next} = D', description: 'D Flip-Flop Characteristic Equation', variables: ['D = Data input'] },
        { formula: 'Q_{next} = T \\oplus Q', description: 'T Flip-Flop Characteristic Equation', variables: ['T = Toggle input'] },
      ],
      definitions: [
        { term: 'Essential Prime Implicant', definition: 'A prime implicant that covers at least one minterm not covered by any other prime implicant.' },
        { term: 'Race-Around Condition', definition: 'The rapid, uncontrolled oscillation of flip-flop output during an active high clock pulse when J=1 and K=1.' },
      ],
      lastMinuteRevision: [
        'K-Map grouping: always group in powers of 2 (16, 8, 4, 2, 1); include don\'t cares only if they increase group size.',
        'JK Flip-Flop toggles when J=K=1. Race-around occurs if t_w > t_pd; solved with Master-Slave JK.',
        'Excitation Table: SR (0->0: S=0,R=X; 0->1: S=1,R=0; 1->0: S=0,R=1; 1->1: S=X,R=0).',
        'Moore machine output depends only on state; Mealy depends on state + input.',
      ],
      createdAt: new Date().toISOString(),
    };
    this.summaries.set(deDoc.id, deSummary);

    const deTopics: Topic[] = [
      { id: 'top-de-1', documentId: deDoc.id, name: 'K-Map Minimization & Don\'t Cares', documentImportance: 95, examFrequency: 100, weightagePercentage: 25, examYears: [2023, 2024, 2025], status: 'studying', keyNotes: '4-variable K-Map with don\'t care conditions (X) and gate realization using universal NAND gates.' },
      { id: 'top-de-2', documentId: deDoc.id, name: 'Master-Slave JK Flip-Flop & Race Condition', documentImportance: 90, examFrequency: 90, weightagePercentage: 25, examYears: [2023, 2024, 2025], status: 'to_study', keyNotes: 'Circuit diagram of Master-Slave JK with timing waveforms explaining race-around cure.' },
      { id: 'top-de-3', documentId: deDoc.id, name: 'Synchronous Counter Design (Mod-N)', documentImportance: 85, examFrequency: 80, weightagePercentage: 28, examYears: [2023, 2024], status: 'to_study', keyNotes: 'Design a 3-bit synchronous up/down counter using T or JK flip-flops.' },
      { id: 'top-de-4', documentId: deDoc.id, name: 'Multiplexer (MUX) Logic Implementation', documentImportance: 75, examFrequency: 65, weightagePercentage: 22, examYears: [2024, 2025], status: 'mastered', keyNotes: 'Implement 4-variable Boolean function using 8:1 MUX.' },
    ];
    this.topics.set(deDoc.id, deTopics);

    const deCards: Flashcard[] = [
      { id: 'fc-de-1', documentId: deDoc.id, front: 'What causes the Race-Around Condition in a JK Flip-Flop and how is it eliminated?', back: 'It occurs when J=1, K=1 and the clock pulse width (t_w) is longer than the propagation delay (t_pd). The output toggles repeatedly during the pulse. It is eliminated by using Master-Slave JK flip-flop or edge-triggering.', category: 'Flip-Flops', difficulty: 'medium', reviewStatus: 'learning', timesReviewed: 4, lastReviewedAt: '2026-09-29T10:00:00Z' },
      { id: 'fc-de-2', documentId: deDoc.id, front: 'What is the characteristic equation of a JK Flip-Flop?', back: 'Q_{next} = J * Q\' + K\' * Q. When J=0, K=0: Hold (Q). When J=0, K=1: Reset (0). When J=1, K=0: Set (1). When J=1, K=1: Toggle (Q\').', category: 'Sequential', difficulty: 'easy', reviewStatus: 'mastered', timesReviewed: 6, lastReviewedAt: '2026-09-28T14:00:00Z' },
      { id: 'fc-de-3', documentId: deDoc.id, front: 'Distinguish between Mealy and Moore state machines.', back: 'Moore: Outputs depend ONLY on the current state. Outputs are synchronous with the clock.\nMealy: Outputs depend on BOTH the current state and current inputs. Output can change asynchronously whenever inputs change.', category: 'FSM', difficulty: 'medium', reviewStatus: 'learning', timesReviewed: 3, lastReviewedAt: '2026-09-27T16:00:00Z' },
    ];
    this.flashcards.set(deDoc.id, deCards);

    const deQuiz: Quiz = { id: 'quiz-de-1', documentId: deDoc.id, title: 'Digital Electronics: Logic & Sequential Circuits', totalQuestions: 3, difficulty: 'medium', createdAt: new Date().toISOString() };
    this.quizzes.set(deQuiz.id, deQuiz);

    const deQuestions: QuizQuestion[] = [
      { id: 'q-de-1', quizId: deQuiz.id, question: 'Under which input condition does an active-high SR latch enter an invalid / undefined state?', type: 'mcq', options: ['S = 1, R = 1', 'S = 0, R = 0', 'S = 1, R = 0', 'S = 0, R = 1'], correctAnswer: 'S = 1, R = 1', explanation: 'When both S and R are 1, both Q and Q\' outputs attempt to become 0 simultaneously, violating the complementary output rule.', sourcePage: 3, topicName: 'Master-Slave JK Flip-Flop & Race Condition', difficulty: 'easy' },
      { id: 'q-de-2', quizId: deQuiz.id, question: 'In a Moore finite state machine, what determines the circuit outputs?', type: 'mcq', options: ['Only the current state', 'Both the current state and current inputs', 'Only the input signals', 'The clock frequency'], correctAnswer: 'Only the current state', explanation: 'Moore machine outputs are determined strictly by the present state variables stored in flip-flops.', sourcePage: 4, topicName: 'Synchronous Counter Design (Mod-N)', difficulty: 'easy' },
      { id: 'q-de-3', quizId: deQuiz.id, question: 'What is the characteristic equation of a T (Toggle) flip-flop?', type: 'mcq', options: ['Q_next = T ⊕ Q', 'Q_next = T • Q', 'Q_next = T + Q', 'Q_next = T'], correctAnswer: 'Q_next = T ⊕ Q', explanation: 'When T=0, Q_next = 0 ⊕ Q = Q (Hold). When T=1, Q_next = 1 ⊕ Q = Q\' (Toggle).', sourcePage: 3, topicName: 'Master-Slave JK Flip-Flop & Race Condition', difficulty: 'easy' },
    ];
    this.quizQuestions.set(deQuiz.id, deQuestions);

    const dePyqs: PYQDocument[] = [
      { id: 'pyq-de-2023', documentId: deDoc.id, year: 2023, examName: 'End Semester University Exam 2023', totalMarks: 100, uploadedAt: '2026-09-20T10:00:00Z' },
      { id: 'pyq-de-2024', documentId: deDoc.id, year: 2024, examName: 'End Semester University Exam 2024', totalMarks: 100, uploadedAt: '2026-09-21T10:00:00Z' },
    ];
    this.pyqDocuments.set(deDoc.id, dePyqs);

    const dePyqQuestions2023: PYQQuestion[] = [
      { id: 'pyq-q-de-1', pyqDocumentId: 'pyq-de-2023', topicName: 'Master-Slave JK Flip-Flop & Race Condition', questionText: 'Explain the race around condition in JK flip-flop and show how master-slave construction eliminates it.', marks: 10, year: 2023 },
      { id: 'pyq-q-de-2', pyqDocumentId: 'pyq-de-2023', topicName: 'Synchronous Counter Design (Mod-N)', questionText: 'Design a Mod-6 synchronous counter using T flip-flops with state table and excitation map.', marks: 10, year: 2023 },
    ];
    this.pyqQuestions.set('pyq-de-2023', dePyqQuestions2023);

    // Physics PYQ Papers & Questions
    const phyPyqs: PYQDocument[] = [
      { id: 'pyq-phy-2023', documentId: physicsDoc.id, year: 2023, examName: 'May/June Semester Examination 2023', totalMarks: 100, uploadedAt: '2026-09-20T10:00:00Z' },
      { id: 'pyq-phy-2024', documentId: physicsDoc.id, year: 2024, examName: 'Nov/Dec Semester Examination 2024', totalMarks: 100, uploadedAt: '2026-09-21T10:00:00Z' },
    ];
    this.pyqDocuments.set(physicsDoc.id, phyPyqs);

    const phyQuestions2023: PYQQuestion[] = [
      { id: 'pyq-q-phy-1', pyqDocumentId: 'pyq-phy-2023', topicName: 'Band Theory & Intrinsic/Extrinsic Semiconductors', questionText: 'Explain the band theory of solids. Distinguish between intrinsic and extrinsic semiconductors with Fermi level position diagrams.', marks: 10, year: 2023 },
      { id: 'pyq-q-phy-2', pyqDocumentId: 'pyq-phy-2023', topicName: 'Carrier Transport & Hall Effect', questionText: 'Derive the expression for Hall coefficient. Describe its experimental significance in determining carrier type and concentration.', marks: 10, year: 2023 },
      { id: 'pyq-q-phy-3', pyqDocumentId: 'pyq-phy-2023', topicName: 'PN Junction & Diode Characteristics', questionText: 'State the Shockley diode equation and discuss the temperature dependence of reverse saturation current.', marks: 5, year: 2023 },
    ];
    const phyQuestions2024: PYQQuestion[] = [
      { id: 'pyq-q-phy-4', pyqDocumentId: 'pyq-phy-2024', topicName: 'Breakdown Mechanisms (Zener vs Avalanche)', questionText: 'Compare Zener and Avalanche breakdown mechanisms in PN junction diodes. Contrast their temperature coefficients.', marks: 10, year: 2024 },
      { id: 'pyq-q-phy-5', pyqDocumentId: 'pyq-phy-2024', topicName: 'PN Junction & Diode Characteristics', questionText: 'Derive the built-in barrier potential V_bi across an abrupt PN junction at thermal equilibrium.', marks: 10, year: 2024 },
      { id: 'pyq-q-phy-6', pyqDocumentId: 'pyq-phy-2024', topicName: 'Laser Physics & Optoelectronics', questionText: 'Explain the principle of population inversion. Describe the construction and working of a He-Ne laser.', marks: 10, year: 2024 },
    ];
    this.pyqQuestions.set('pyq-phy-2023', phyQuestions2023);
    this.pyqQuestions.set('pyq-phy-2024', phyQuestions2024);

    // Seed Study Plan
    const studyPlan: StudyPlan = {
      id: 'plan-1',
      userId: defaultUser.id,
      title: 'Semester Finals Intensive Preparation',
      examDate: '2026-12-15',
      dailyHours: 3.5,
      currentLevel: 'intermediate',
      createdAt: '2026-09-25T08:00:00Z',
    };
    this.studyPlans.set(studyPlan.id, studyPlan);

    const tasks: StudyTask[] = [
      { id: 'task-1', studyPlanId: studyPlan.id, dayNumber: 1, title: 'Revise PN Junction & Built-in Potential', description: 'Study depletion dynamics, derive V_bi formula, and solve 2 numericals.', durationMinutes: 45, type: 'reading', completed: false, documentId: physicsDoc.id, topicName: 'PN Junction & Depletion Region' },
      { id: 'task-2', studyPlanId: studyPlan.id, dayNumber: 1, title: 'Complete 20 Semiconductor MCQs', description: 'Take the adaptive practice quiz on carrier transport and breakdown.', durationMinutes: 30, type: 'practice', completed: false, documentId: physicsDoc.id },
      { id: 'task-3', studyPlanId: studyPlan.id, dayNumber: 1, title: 'Review 15 Physics Flashcards', description: 'Active recall spaced repetition on breakdown mechanisms.', durationMinutes: 15, type: 'flashcards', completed: false, documentId: physicsDoc.id },
      { id: 'task-4', studyPlanId: studyPlan.id, dayNumber: 1, title: 'Analyze PYQs: 2023-2024 Trends', description: 'Review high-weightage questions on Hall Effect and Zener Diode.', durationMinutes: 20, type: 'revision', completed: false, documentId: physicsDoc.id },
      { id: 'task-5', studyPlanId: studyPlan.id, dayNumber: 2, title: 'Dynamic Programming Patterns: Knapsack & LCS', description: 'Solve 0/1 Knapsack recurrence and space-optimized table.', durationMinutes: 50, type: 'reading', completed: false, documentId: dsaDoc.id },
      { id: 'task-6', studyPlanId: studyPlan.id, dayNumber: 2, title: 'Laplace Transform Shifting Theorems', description: 'Practice 5 initial-value and convolution problems.', durationMinutes: 40, type: 'practice', completed: false, documentId: mathDoc.id },
    ];
    this.studyTasks.set(studyPlan.id, tasks);

    // Realistic User Progress based on real activity
    const progress: UserProgress = {
      userId: defaultUser.id,
      documentsCount: 4,
      topicsMastered: 0,
      totalTopics: 12,
      averageQuizAccuracy: 0,
      flashcardsReviewedCount: 0,
      totalStudyMinutes: 0,
      currentStreakDays: 1,
      weeklyStudyHours: [
        { day: 'MON', hours: 0 },
        { day: 'TUE', hours: 0 },
        { day: 'WED', hours: 0 },
        { day: 'THU', hours: 0 },
        { day: 'FRI', hours: 0 },
        { day: 'SAT', hours: 0 },
        { day: 'SUN', hours: 0 },
      ],
      weakTopics: [],
    };
    this.userProgress.set(defaultUser.id, progress);
  }

  // Helper APIs
  getDocuments(userId: string): Document[] {
    return Array.from(this.documents.values()).filter((d) => d.userId === userId || !userId);
  }

  getDocument(id: string): Document | undefined {
    return this.documents.get(id);
  }

  getPages(documentId: string): DocumentPage[] {
    return this.documentPages.get(documentId) || [];
  }

  getChunks(documentId: string): DocumentChunk[] {
    return this.documentChunks.get(documentId) || [];
  }

  getSummary(documentId: string): Summary | undefined {
    let summary = this.summaries.get(documentId);
    if (!summary) {
      const doc = this.documents.get(documentId);
      if (doc) {
        const pages = this.documentPages.get(documentId) || [];
        summary = {
          id: 'sum-' + documentId,
          documentId,
          quickSummary: `${doc.title} comprehensive curriculum covering core theoretical formulations, fundamental definitions, key problem-solving methodologies, and examination checkpoints across ${doc.pageCount} pages.`,
          detailedSummary: pages.slice(0, 4).map((p, idx) => ({
            chapter: `Module ${idx + 1}: ${doc.title} Section ${idx + 1}`,
            content: p.text ? p.text.substring(0, 220) + '...' : `Comprehensive coverage of module ${idx + 1} topics and practice exercises.`,
            keyPoints: [
              'Fundamental conceptual definitions',
              'Mathematical analysis and proof methods',
              'University examination problem patterns',
            ],
          })),
          keyConcepts: [
            { title: `${doc.title} Core Model`, explanation: `Essential conceptual framework and mathematical foundation of ${doc.title}.`, importance: 'high' },
            { title: 'Analytical Solutions', explanation: 'Rigorous derivation methods and practical engineering calculations.', importance: 'medium' },
            { title: 'System Optimization', explanation: 'Techniques for improving efficiency and performance criteria.', importance: 'medium' },
          ],
          formulas: [
            { formula: 'E = h\\nu', description: 'Energy associated with photon transition frequency', variables: ['E (Energy in Joules)', 'h (Planck constant)', '\\nu (Frequency in Hz)'] },
            { formula: '\\eta = 1 - \\frac{T_C}{T_H}', description: 'Theoretical thermodynamic efficiency limit', variables: ['\\eta (Efficiency)', 'T_C (Cold reservoir temp K)', 'T_H (Hot reservoir temp K)'] },
          ],
          definitions: [
            { term: 'Equilibrium State', definition: 'The balanced physical condition where net thermodynamic or electrical flux is zero.' },
            { term: 'Transfer Characteristic', definition: 'Functional relationship mapping input stimulus to output response across dynamic range.' },
          ],
          lastMinuteRevision: [
            `Revise all core definitions and governing laws for ${doc.title}.`,
            'Check boundary conditions, sign conventions, and physical units.',
            'Review previous year question formats and Section B long derivation topics.',
          ],
          createdAt: new Date().toISOString(),
        };
        this.summaries.set(documentId, summary);
      }
    }
    return summary;
  }

  getTopics(documentId: string): Topic[] {
    let topics = this.topics.get(documentId);
    if (!topics || topics.length === 0) {
      const doc = this.documents.get(documentId);
      if (doc) {
        topics = [
          {
            id: `top-${documentId}-1`,
            documentId,
            name: `${doc.title}: Fundamental Principles`,
            documentImportance: 95,
            examFrequency: 85,
            weightagePercentage: 35,
            examYears: [2023, 2024, 2025],
            status: 'mastered',
            keyNotes: `Core principles and theoretical framework of ${doc.title}. Appeared in all analyzed semester question papers.`,
          },
          {
            id: `top-${documentId}-2`,
            documentId,
            name: `${doc.title}: Analytical Methods`,
            documentImportance: 85,
            examFrequency: 75,
            weightagePercentage: 35,
            examYears: [2023, 2024],
            status: 'studying',
            keyNotes: `Analytical equations and step-by-step problem solving methods. Tested frequently in numerical calculation sections.`,
          },
          {
            id: `top-${documentId}-3`,
            documentId,
            name: `${doc.title}: Advanced Applications`,
            documentImportance: 75,
            examFrequency: 65,
            weightagePercentage: 30,
            examYears: [2024, 2025],
            status: 'to_study',
            keyNotes: `Practical engineering use cases, system diagrams, and performance characteristics.`,
          },
        ];
        this.topics.set(documentId, topics);
      } else {
        topics = [];
      }
    }
    return topics;
  }

  getFlashcards(documentId: string): Flashcard[] {
    let cards = this.flashcards.get(documentId);
    if (!cards || cards.length === 0) {
      const doc = this.documents.get(documentId);
      if (doc) {
        cards = [
          {
            id: `fc-${documentId}-1`,
            documentId,
            front: `What is the primary governing principle of ${doc.title}?`,
            back: `The fundamental physical or mathematical law that describes the equilibrium behavior and operational limits of the system.`,
            category: 'Core Principles',
            difficulty: 'easy',
            reviewStatus: 'mastered',
            timesReviewed: 3,
            lastReviewedAt: new Date().toISOString(),
          },
          {
            id: `fc-${documentId}-2`,
            documentId,
            front: `How do you verify boundary conditions when solving ${doc.title} problems?`,
            back: `Ensure all asymptotic constraints at t=0, t->∞, or physical interfaces satisfy continuity and conservation laws.`,
            category: 'Problem Solving',
            difficulty: 'medium',
            reviewStatus: 'learning',
            timesReviewed: 1,
            lastReviewedAt: new Date().toISOString(),
          },
          {
            id: `fc-${documentId}-3`,
            documentId,
            front: `What is the most frequently tested Section B question in ${doc.title}?`,
            back: `Full theoretical derivation of the characteristic equation paired with a 5-mark numerical verification problem.`,
            category: 'Exam Prep',
            difficulty: 'hard',
            reviewStatus: 'review',
            timesReviewed: 2,
            lastReviewedAt: new Date().toISOString(),
          },
        ];
        this.flashcards.set(documentId, cards);
      } else {
        cards = [];
      }
    }
    return cards;
  }

  getQuiz(documentId: string): Quiz | undefined {
    let quiz = Array.from(this.quizzes.values()).find((q) => q.documentId === documentId);
    if (!quiz) {
      const doc = this.documents.get(documentId);
      if (doc) {
        const quizId = `quiz-${documentId}`;
        const questions: QuizQuestion[] = [
          {
            id: `qq-${documentId}-1`,
            quizId,
            question: `Which fundamental principle is central to ${doc.title}?`,
            options: [
              'Conservation of energy and operational equilibrium',
              'Random variable dispersion',
              'Non-linear thermal breakdown',
              'Idealized frictionless motion only',
            ],
            correctAnswer: 'Conservation of energy and operational equilibrium',
            explanation: `All physical and engineering analyses in ${doc.title} begin with energy conservation and balanced boundary constraints.`,
            sourcePage: 1,
            topicName: `${doc.title} Fundamentals`,
            difficulty: 'easy',
            type: 'mcq',
          },
          {
            id: `qq-${documentId}-2`,
            quizId,
            question: `In standard semester exams, numerical problems for ${doc.title} primarily require:`,
            options: [
              'Strict application of SI units and formula parameter substitution',
              'Arbitrary empirical estimation',
              'Only qualitative descriptions without calculations',
              'Memorization of historical patent numbers',
            ],
            correctAnswer: 'Strict application of SI units and formula parameter substitution',
            explanation: `Examiners reward correct formula representation, standard SI unit conversions, and explicit final result statements.`,
            sourcePage: 2,
            topicName: 'Problem Solving',
            difficulty: 'medium',
            type: 'mcq',
          },
          {
            id: `qq-${documentId}-3`,
            quizId,
            question: `What distinguishes optimal operational conditions in ${doc.title}?`,
            options: [
              'Minimized dissipation and high transfer efficiency',
              'Maximum possible operating temperature regardless of limits',
              'Zero feedback gain across all operational frequencies',
              'Undefined boundary impedance',
            ],
            correctAnswer: 'Minimized dissipation and high transfer efficiency',
            explanation: `Optimal systems maximize useful output throughput while minimizing internal thermal and parasitic losses.`,
            sourcePage: 3,
            topicName: 'System Analysis',
            difficulty: 'medium',
            type: 'mcq',
          },
        ];

        quiz = {
          id: quizId,
          documentId,
          title: `${doc.title} Diagnostic Quiz`,
          totalQuestions: questions.length,
          difficulty: 'medium',
          createdAt: new Date().toISOString(),
        };

        this.quizzes.set(quizId, quiz);
        this.quizQuestions.set(quizId, questions);
      }
    }
    return quiz;
  }

  getQuizQuestions(quizId: string): QuizQuestion[] {
    return this.quizQuestions.get(quizId) || [];
  }

  getStudyPlan(userId: string): { plan: StudyPlan | undefined; tasks: StudyTask[] } {
    const plan = Array.from(this.studyPlans.values()).find((p) => p.userId === userId);
    const tasks = plan ? this.studyTasks.get(plan.id) || [] : [];
    return { plan, tasks };
  }

  getUserProgress(userId: string): UserProgress | undefined {
    return this.userProgress.get(userId) || this.userProgress.get('user-ashutosh');
  }

  savePdfFile(documentId: string, buffer: Buffer): string {
    this.ensureDirs();
    try {
      const filePath = path.join(UPLOADS_DIR, `${documentId}.pdf`);
      fs.writeFileSync(filePath, buffer);
      return `/api/documents/${documentId}/file`;
    } catch (e) {
      console.error('Error saving PDF file:', e);
      return '';
    }
  }

  getPdfBuffer(documentId: string): Buffer | null {
    this.ensureDirs();
    try {
      const filePath = path.join(UPLOADS_DIR, `${documentId}.pdf`);
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath);
      }
    } catch (e) {
      console.error('Error reading PDF file:', e);
    }
    return null;
  }

  getPYQDocuments(documentId: string): PYQDocument[] {
    return this.pyqDocuments.get(documentId) || [];
  }

  getPYQQuestions(pyqDocId: string): PYQQuestion[] {
    return this.pyqQuestions.get(pyqDocId) || [];
  }

  addPYQDocument(pyqDoc: PYQDocument, questions: PYQQuestion[]): void {
    const existing = this.pyqDocuments.get(pyqDoc.documentId) || [];
    existing.push(pyqDoc);
    this.pyqDocuments.set(pyqDoc.documentId, existing);
    this.pyqQuestions.set(pyqDoc.id, questions);
    this.persist();
  }

  updateFlashcardReview(
    documentId: string,
    flashcardId: string,
    rating: 'again' | 'hard' | 'good' | 'easy'
  ): Flashcard | undefined {
    const cards = this.flashcards.get(documentId);
    if (!cards) return undefined;
    const card = cards.find((c) => c.id === flashcardId);
    if (!card) return undefined;

    card.timesReviewed = (card.timesReviewed || 0) + 1;
    card.lastReviewedAt = new Date().toISOString();

    if (rating === 'easy' || (rating as string) === 'mastered') {
      card.reviewStatus = 'mastered';
      card.difficulty = 'easy';
    } else if (rating === 'good') {
      card.reviewStatus = 'review';
      card.difficulty = 'medium';
    } else if (rating === 'hard') {
      card.reviewStatus = 'learning';
      card.difficulty = 'hard';
    } else {
      card.reviewStatus = 'learning';
    }

    // Persist real progress update
    const progress = this.userProgress.get('user-ashutosh');
    if (progress) {
      progress.flashcardsReviewedCount = (progress.flashcardsReviewedCount || 0) + 1;
    }

    this.persist();
    return card;
  }

  createStudyPlan(plan: StudyPlan, tasks: StudyTask[]): void {
    this.studyPlans.set(plan.id, plan);
    this.studyTasks.set(plan.id, tasks);
    this.persist();
  }

  toggleTask(taskId: string): boolean {
    for (const [planId, taskList] of this.studyTasks.entries()) {
      const task = taskList.find((t) => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        this.persist();
        return task.completed;
      }
    }
    return false;
  }

  saveQuizAttempt(attempt: QuizAttempt): void {
    const attempts = this.quizAttempts.get(attempt.quizId) || [];
    attempts.push(attempt);
    this.quizAttempts.set(attempt.quizId, attempts);

    // Update real user progress
    const progress = this.userProgress.get(attempt.userId) || this.userProgress.get('user-ashutosh');
    if (progress) {
      // Calculate accuracy across all quiz attempts
      let allScores = 0;
      let allTotals = 0;
      for (const attList of this.quizAttempts.values()) {
        for (const a of attList) {
          allScores += a.score;
          allTotals += a.total;
        }
      }
      if (allTotals > 0) {
        progress.averageQuizAccuracy = Math.round((allScores / allTotals) * 100);
      }

      // Update weak topics dynamically
      if (attempt.weakTopics && attempt.weakTopics.length > 0) {
        const quiz = Array.from(this.quizzes.values()).find((q) => q.id === attempt.quizId);
        const docTitle = quiz ? this.documents.get(quiz.documentId)?.title || 'Study Document' : 'Study Document';
        for (const wt of attempt.weakTopics) {
          const existing = progress.weakTopics.find((item) => item.name === wt);
          if (!existing) {
            progress.weakTopics.unshift({
              name: wt,
              documentTitle: docTitle,
              accuracy: attempt.percentage,
            });
          } else {
            existing.accuracy = Math.round((existing.accuracy + attempt.percentage) / 2);
          }
        }
        if (progress.weakTopics.length > 6) {
          progress.weakTopics = progress.weakTopics.slice(0, 6);
        }
      }
    }
    this.persist();
  }

  createDocument(doc: Document, pages: DocumentPage[], chunks: DocumentChunk[], summary: Summary, topics: Topic[], flashcards: Flashcard[], quiz: Quiz, quizQuestions: QuizQuestion[]): void {
    this.documents.set(doc.id, doc);
    this.documentPages.set(doc.id, pages);
    this.documentChunks.set(doc.id, chunks);
    this.summaries.set(doc.id, summary);
    this.topics.set(doc.id, topics);
    this.flashcards.set(doc.id, flashcards);
    this.quizzes.set(quiz.id, quiz);
    this.quizQuestions.set(quiz.id, quizQuestions);

    const progress = this.userProgress.get(doc.userId) || this.userProgress.get('user-ashutosh');
    if (progress) {
      progress.documentsCount = this.documents.size;
      let totalT = 0;
      for (const tList of this.topics.values()) {
        totalT += tList.length;
      }
      progress.totalTopics = totalT;
    }

    this.persist();
  }
}

// Global Singleton
const globalForDb = global as unknown as { __studyforgeDb?: MemoryDatabase };
export const db = globalForDb.__studyforgeDb ?? new MemoryDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.__studyforgeDb = db;
