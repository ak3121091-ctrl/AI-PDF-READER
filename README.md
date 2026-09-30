# StudyForge AI — AI PDF Study System

StudyForge AI is a premium, unified academic learning platform that transforms standard lecture PDFs, textbooks, and previous-year question papers (PYQs) into an interactive, AI-driven study workspace.

Built with **Next.js 15**, **React 19**, **TypeScript**, and **Google Gemini AI**.

---

## ⚡ Key Highlights

- **Single Unified Workspace**: The entire study experience (Dashboard, Documents Library, Reader, Summary, Ask PDF, Important Topics, AI Quiz, Flashcards, PYQ Matrix, Study Plan, and Progress Analytics) is unified under one application shell at `http://localhost:3000/`. No jarring page refreshes or route changes.
- **Active Document Context**: Global context persistence across all modules. Selecting a document once keeps it active when navigating between Summary, Topics, Quiz, Flashcards, and RAG Chat.
- **Interactive 3D Landing Experience**: Integrated registered ThreeUI `BestsellersBookShowcase` component with interactive 3D books and fluid transition into the study workspace.
- **Dual-Pane PDF Reader & Ask PDF**: Read page-by-page while querying the AI assistant with ground-truth citations and page reference tags.
- **Structured 6-Layer Summary**: Quick Summary, Chapter Breakdown, Key Concepts, Formulas & Equations, Core Definitions, and Last-Minute Exam Revision.
- **Exam Pattern & PYQ Matrix**: Distinguishes Document Importance from Multi-Year Exam Frequency (2023–2025) without artificial extrapolation.
- **Active Recall Diagnostic Quiz**: Interactive time-bounded testing with score evaluation, strong vs. weak topic diagnosis, and line-by-line review explanations.
- **3D Spaced Repetition Flashcards**: Interactive 3D perspective flip cards with standard SM-2 / SRS difficulty ratings (*Again*, *Hard*, *Good*, *Easy*).
- **Personalized Study Planner**: Target exam date and daily study intensity scheduler with interactive task completion tracking.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI & State**: React 19, TypeScript, Vanilla CSS design system, Lucide Icons
- **3D & Motion**: ThreeUI WebGL / CSS3D Shaders & iframe bridge
- **AI & RAG Engine**: Google Generative AI (`gemini-1.5-flash` with local semantic vector fallback)
- **PDF Extraction**: `pdf-parse` with automatic OCR fallback pipeline

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or later
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/ak3121091-ctrl/AI-PDF-READER.git
cd AI-PDF-READER
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (optional for Gemini API features):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(If no API key is provided, the system automatically uses the built-in Academic Intelligence provider for zero-setup demo exploration).*

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── api/                     # Backend API Routes
│   │   ├── documents/           # Upload, list, RAG chat, summary, quiz, flashcards
│   │   ├── progress/            # User streak & study statistics
│   │   ├── pyq/                 # Multi-year exam pattern analysis
│   │   └── study-plan/          # Daily tasks & schedule generator
│   ├── layout.tsx               # Root layout & styling tokens
│   ├── page.tsx                 # Root application (Landing + Workspace Shell)
│   └── globals.css              # Dark earth-toned luxury styling system
├── components/
│   ├── dashboard/               # Upload modal & UI dialogs
│   ├── study/                   # Modular unified workspace views
│   │   ├── WorkspaceShell.tsx   # Master frame & sidebar navigation
│   │   ├── DashboardView.tsx    # Metrics, recent docs & today's plan
│   │   ├── DocumentsView.tsx    # Study library grid
│   │   ├── DocumentReaderView.tsx # Dual-pane reader + integrated Ask PDF
│   │   ├── SummaryView.tsx      # 6-tab AI synthesis
│   │   ├── AskPdfView.tsx       # Dedicated full RAG conversation
│   │   ├── TopicsView.tsx       # Document importance vs PYQ frequency
│   │   ├── QuizView.tsx         # Diagnostic quiz runner & review
│   │   ├── FlashcardsView.tsx   # 3D flip card active recall
│   │   ├── PyqView.tsx          # Multi-year exam repetition matrix
│   │   ├── StudyPlanView.tsx    # Schedule generator
│   │   └── ProgressView.tsx     # Streaks & intensity analytics
│   └── ui/                      # Shared UI components
├── contexts/
│   └── StudyContext.tsx         # Unified workspace state & active document context
├── lib/
│   ├── ai/                      # Gemini & fallback AI providers
│   ├── database/                # Mock DB & type-safe data schema
│   ├── pdf/                     # PDF extraction & OCR fallback
│   └── vector/                  # Vector chunking & semantic search
└── shaders/                     # ThreeUI shader integration components
```

---

## 📜 License
MIT License. Built for students and researchers.

