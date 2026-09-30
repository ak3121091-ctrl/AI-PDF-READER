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
    this.seed();
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
      { id: 'task-3', studyPlanId: studyPlan.id, dayNumber: 1, title: 'Review 15 Physics Flashcards', description: 'Active recall spaced repetition on breakdown mechanisms.', durationMinutes: 15, type: 'flashcards', completed: true, documentId: physicsDoc.id },
      { id: 'task-4', studyPlanId: studyPlan.id, dayNumber: 1, title: 'Analyze PYQs: 2023-2025 Trends', description: 'Review high-weightage questions on Hall Effect and Zener Diode.', durationMinutes: 20, type: 'revision', completed: false, documentId: physicsDoc.id },
      { id: 'task-5', studyPlanId: studyPlan.id, dayNumber: 2, title: 'Dynamic Programming Patterns: Knapsack & LCS', description: 'Solve 0/1 Knapsack recurrence and space-optimized table.', durationMinutes: 50, type: 'reading', completed: false, documentId: dsaDoc.id },
      { id: 'task-6', studyPlanId: studyPlan.id, dayNumber: 2, title: 'Laplace Transform Shifting Theorems', description: 'Practice 5 initial-value and convolution problems.', durationMinutes: 40, type: 'practice', completed: false, documentId: mathDoc.id },
    ];
    this.studyTasks.set(studyPlan.id, tasks);

    // User Progress
    const progress: UserProgress = {
      userId: defaultUser.id,
      documentsCount: 4,
      topicsMastered: 18,
      totalTopics: 48,
      averageQuizAccuracy: 82,
      flashcardsReviewedCount: 142,
      totalStudyMinutes: 1350,
      currentStreakDays: 7,
      weeklyStudyHours: [
        { day: 'MON', hours: 3.5 },
        { day: 'TUE', hours: 2.5 },
        { day: 'WED', hours: 4.5 },
        { day: 'THU', hours: 2.0 },
        { day: 'FRI', hours: 4.0 },
        { day: 'SAT', hours: 3.0 },
        { day: 'SUN', hours: 2.0 },
      ],
      weakTopics: [
        { name: 'Zener vs Avalanche Breakdown', documentTitle: 'Engineering Physics', accuracy: 55 },
        { name: 'Graph Bellman-Ford Negative Cycles', documentTitle: 'Data Structures', accuracy: 62 },
        { name: 'Cauchy-Riemann Differential Equations', documentTitle: 'Mathematics III', accuracy: 68 },
      ],
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
    return this.summaries.get(documentId);
  }

  getTopics(documentId: string): Topic[] {
    return this.topics.get(documentId) || [];
  }

  getFlashcards(documentId: string): Flashcard[] {
    return this.flashcards.get(documentId) || [];
  }

  getQuiz(documentId: string): Quiz | undefined {
    return Array.from(this.quizzes.values()).find((q) => q.documentId === documentId);
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

  toggleTask(taskId: string): boolean {
    for (const [planId, taskList] of this.studyTasks.entries()) {
      const task = taskList.find((t) => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        return task.completed;
      }
    }
    return false;
  }

  saveQuizAttempt(attempt: QuizAttempt): void {
    const attempts = this.quizAttempts.get(attempt.quizId) || [];
    attempts.push(attempt);
    this.quizAttempts.set(attempt.quizId, attempts);
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
  }
}

// Global Singleton
const globalForDb = global as unknown as { __studyforgeDb?: MemoryDatabase };
export const db = globalForDb.__studyforgeDb ?? new MemoryDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.__studyforgeDb = db;
