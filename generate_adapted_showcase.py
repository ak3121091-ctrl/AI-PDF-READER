import os
import re

with open('scraped_showcase.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Title and Meta
html = re.sub(
    r'<title>.*?</title>',
    '<title>StudyForge AI — Turn PDFs Into Your Personal Study System</title>',
    html
)
html = re.sub(
    r'<meta\s+name="description"\s+content="[^"]*">',
    '<meta name="description" content="Upload your notes, textbooks and previous-year papers. StudyForge AI turns them into summaries, important topics, quizzes, flashcards and personalized study plans.">',
    html
)

# 2. Add extra CSS for the StudyForge hero banner & trust indicators while keeping all original styles
hero_css = """
    /* StudyForge AI Hero Overlay & Trust Indicators */
    .studyforge-hero-card {
      position: absolute;
      z-index: 6;
      bottom: 28px;
      left: 3.2vw;
      max-width: 480px;
      background: rgba(41, 37, 29, 0.85);
      border: 1px solid rgba(195, 164, 123, 0.25);
      border-radius: 14px;
      padding: 22px 24px;
      backdrop-filter: blur(14px);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
      transition: opacity 400ms var(--ease), transform 400ms var(--ease);
      pointer-events: auto;
    }

    body[data-mode="detail"] .studyforge-hero-card {
      opacity: 0.15;
      transform: translateY(12px) scale(0.96);
      pointer-events: none;
    }

    .studyforge-kicker {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--pink-bright);
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .studyforge-kicker::before {
      content: "";
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--pink);
    }

    .studyforge-hero-title {
      font-family: var(--serif);
      font-size: 24px;
      font-weight: 500;
      line-height: 1.15;
      color: var(--text);
      margin: 0 0 8px 0;
      letter-spacing: -0.02em;
    }

    .studyforge-hero-desc {
      font-size: 13.5px;
      line-height: 1.5;
      color: var(--muted);
      margin: 0 0 16px 0;
    }

    .studyforge-cta-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }

    .studyforge-btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--pink);
      color: var(--ink-deep);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 10px 18px;
      border-radius: 999px;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: background 200ms ease, transform 150ms ease;
    }

    .studyforge-btn-primary:hover {
      background: var(--pink-bright);
      transform: translateY(-1px);
    }

    .studyforge-btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(238, 226, 202, 0.08);
      color: var(--text);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 10px 18px;
      border-radius: 999px;
      text-decoration: none;
      border: 1px solid rgba(195, 164, 123, 0.3);
      cursor: pointer;
      transition: background 200ms ease, border-color 200ms ease;
    }

    .studyforge-btn-secondary:hover {
      background: rgba(238, 226, 202, 0.16);
      border-color: var(--pink);
    }

    .studyforge-trust-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding-top: 10px;
      border-top: 1px solid rgba(195, 164, 123, 0.15);
    }

    .studyforge-pill {
      font-size: 10.5px;
      font-weight: 500;
      letter-spacing: 0.04em;
      color: var(--muted);
      background: rgba(33, 30, 24, 0.6);
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid rgba(195, 164, 123, 0.18);
    }

    .detail-action-bar {
      display: flex;
      gap: 10px;
      margin-top: 20px;
      flex-wrap: wrap;
    }

    .action-btn-study {
      flex: 1;
      min-width: 140px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 14px;
      background: var(--pink);
      color: var(--ink-deep);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: transform 150ms ease, background 150ms ease;
    }
    .action-btn-study:hover {
      background: var(--pink-bright);
      transform: translateY(-1px);
    }

    .action-btn-quiz {
      flex: 1;
      min-width: 140px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 14px;
      background: rgba(238, 226, 202, 0.1);
      color: var(--text);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border-radius: 8px;
      border: 1px solid rgba(195, 164, 123, 0.3);
      cursor: pointer;
      text-decoration: none;
      transition: background 150ms ease, border-color 150ms ease;
    }
    .action-btn-quiz:hover {
      background: rgba(238, 226, 202, 0.2);
      border-color: var(--pink);
    }

    @media (max-width: 768px) {
      .studyforge-hero-card {
        bottom: 12px;
        left: 12px;
        right: 12px;
        max-width: none;
        padding: 16px;
      }
      .studyforge-hero-title {
        font-size: 20px;
      }
    }
"""

html = html.replace('</style>', f'{hero_css}\n</style>')

# 3. Update Brand and Navigation
html = html.replace(
    '<a class="brand" href="#" aria-label="Field Manuals home">Field Manuals</a>',
    '<a class="brand" href="/" target="_top" aria-label="StudyForge AI home">STUDYFORGE AI</a>'
)

html = html.replace(
    '<button class="ticket-button" type="button" data-toast="The collection is complete.">The Collection</button>',
    '<a class="ticket-button" href="/dashboard" target="_top" style="text-decoration:none; display:inline-flex; align-items:center;">ENTER WORKSPACE</a>'
)

html = html.replace(
    '<li><a class="menu-link" href="#" data-menu-close>Volumes</a></li>\n        <li><a class="menu-link" href="#notes" data-menu-close data-toast="Field notes are coming soon.">Notes</a></li>\n        <li><a class="menu-link" href="#index" data-menu-close data-toast="An index of tools for thought.">Index</a></li>',
    '<li><a class="menu-link" href="/dashboard" target="_top">Dashboard</a></li>\n        <li><a class="menu-link" href="/documents/engineering-physics" target="_top">Document Reader</a></li>\n        <li><a class="menu-link" href="/study-plan" target="_top">Study Planner</a></li>\n        <li><a class="menu-link" href="/profile" target="_top">Profile & Goals</a></li>\n        <li><a class="menu-link" href="/sign-in" target="_top">Sign In</a></li>'
)

# 4. Update the backdrop word
html = html.replace(
    '<h1 class="hero-word" aria-hidden="true">Agents</h1>',
    '<h1 class="hero-word" aria-hidden="true">STUDY</h1>'
)

# 5. Insert the StudyForge AI Hero Card into the stage
hero_card_html = """
    <!-- StudyForge AI Hero Showcase Banner -->
    <div class="studyforge-hero-card">
      <div class="studyforge-kicker">TURN ANY PDF INTO A STUDY SYSTEM</div>
      <h2 class="studyforge-hero-title">STUDY SMARTER.</h2>
      <p class="studyforge-hero-desc">
        Upload your notes, textbooks and previous-year papers. StudyForge AI turns them into summaries, important topics, quizzes, flashcards and personalized study plans.
      </p>
      <div class="studyforge-cta-row">
        <a href="/dashboard?upload=true" target="_top" class="studyforge-btn-primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          UPLOAD PDF
        </a>
        <a href="/documents/engineering-physics" target="_top" class="studyforge-btn-secondary">
          EXPLORE DEMO
        </a>
      </div>
      <div class="studyforge-trust-pills">
        <span class="studyforge-pill">PDF → SUMMARY</span>
        <span class="studyforge-pill">PDF → QUIZ</span>
        <span class="studyforge-pill">PDF → FLASHCARDS</span>
        <span class="studyforge-pill">PDF → STUDY PLAN</span>
      </div>
    </div>
"""

# Insert before </main>
html = html.replace('</main>', f'{hero_card_html}\n  </main>')

# 6. Adapt the 3 Books on the shelf
# Book 1: Codex -> Engineering Physics
html = html.replace(
    'aria-label="Open Codex details"',
    'aria-label="Open Engineering Physics details"'
)
html = html.replace(
    '<span class="cover-kicker">Field Manual · I</span>\n              <span class="cover-title">Codex</span>\n              <span class="cover-subtitle">The Agentic Engineer</span>\n              <span></span>\n              <span class="cover-footer">Systems · Tools · Taste</span>',
    '<span class="cover-kicker">VOLUME · I</span>\n              <span class="cover-title">Engineering<br>Physics</span>\n              <span class="cover-subtitle">Semiconductors & Optics</span>\n              <span></span>\n              <span class="cover-footer">Band Theory · PN Junction · Lasers</span>'
)

# Book 2: Claude Code -> Data Structures
html = html.replace(
    'aria-label="Open Claude Code details"',
    'aria-label="Open Data Structures & Algorithms details"'
)
html = html.replace(
    '<span class="cover-kicker">Field Manual · II</span>\n              <span class="cover-title">Claude<br>Code</span>\n              <span class="cover-subtitle">The Quiet Terminal</span>\n              <span></span>\n              <span class="cover-footer">Context · Craft · Care</span>',
    '<span class="cover-kicker">VOLUME · II</span>\n              <span class="cover-title">Data<br>Structures</span>\n              <span class="cover-subtitle">Algorithms & Analysis</span>\n              <span></span>\n              <span class="cover-footer">Dynamic Prog · Graphs · Trees</span>'
)

# Book 3: Cursor -> Mathematics III
html = html.replace(
    'aria-label="Open Cursor details"',
    'aria-label="Open Applied Mathematics III details"'
)
html = html.replace(
    '<span class="cover-kicker">Field Manual · III</span>\n              <span class="cover-title">Cursor</span>\n              <span class="cover-subtitle">The Augmented Editor</span>\n              <span></span>\n              <span class="cover-footer">Select · Predict · Refine</span>',
    '<span class="cover-kicker">VOLUME · III</span>\n              <span class="cover-title">Applied<br>Maths III</span>\n              <span class="cover-subtitle">Calculus & Transforms</span>\n              <span></span>\n              <span class="cover-footer">Fourier · Laplace · Linear Algebra</span>'
)

# Update badges
html = html.replace('<span class="open-badge">Read</span>', '<span class="open-badge">Study</span>')

# 7. Add action buttons inside the Detail Panel
detail_actions = """
        <div class="detail-action-bar">
          <a href="/documents/engineering-physics" target="_top" id="detailOpenBtn" class="action-btn-study">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Study Document
          </a>
          <a href="/documents/engineering-physics/quiz" target="_top" id="detailQuizBtn" class="action-btn-quiz">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Take 20-MCQ Quiz
          </a>
        </div>
"""

# Insert inside detail-scroll at end
html = html.replace(
    '<footer class="detail-actions">',
    f'{detail_actions}\n        <footer class="detail-actions">'
)

# 8. Update JavaScript books dictionary with academic data
js_books_replacement = """
      const books = {
        codex: {
          title: "Engineering Physics & Semiconductors",
          year: "Exam Weight: 28% • High Yield",
          docUrl: "/documents/engineering-physics",
          quizUrl: "/documents/engineering-physics/quiz",
          description:
            "Complete semester syllabus coverage: Energy band theory of solids, PN junction diode operating dynamics under forward and reverse bias, Zener tunneling vs avalanche impact ionization, Hall Effect determination, and He-Ne gas laser emission at 632.8 nm.",
          steps: [
            {
              title: "Step 1: High-Yield Topics Identification",
              body: "AI analysis of uploaded 2023-2025 PYQs flags PN Junction (100% recurrence) and Zener Breakdown as mandatory 10-mark questions."
            },
            {
              title: "Step 2: Formula & Constant Sheet",
              body: "Memorize built-in potential barrier V_bi = (kT/q)*ln(N_A*N_D/n_i^2) and diode current equation with ideality factor."
            },
            {
              title: "Step 3: Interactive Diagnostic Quiz",
              body: "Test recall across 20 adaptive MCQs covering carrier transport, Hall voltage, and stimulated laser emission."
            },
            {
              title: "Step 4: Last-Minute Exam Trap Sheet",
              body: "Review negative temperature coefficient of Zener breakdown vs positive temperature coefficient of Avalanche breakdown."
            }
          ],
          prompt:
            "Explain the working principle and V-I characteristics of a Zener diode in simple terms, detailing its application as a shunt voltage regulator.",
          review:
            "Frequency verified across 3 uploaded semester papers: PN Junction (3/3 appearances), Zener Diode (2/3 appearances), Photodiode (2/3 appearances)."
        },
        claude: {
          title: "Data Structures & Algorithms",
          year: "Exam Weight: 32% • High Yield",
          docUrl: "/documents/data-structures",
          quizUrl: "/documents/data-structures/quiz",
          description:
            "Core university algorithms syllabus: Asymptotic bounds, Master Theorem cases, Red-Black tree rotations, Graph traversals (BFS, DFS, Dijkstra shortest path), and Dynamic Programming paradigms (0/1 Knapsack, Longest Common Subsequence).",
          steps: [
            {
              title: "Step 1: Master Recurrence Relations",
              body: "Master theorem shortcuts and substitution methods with step-by-step mathematical induction proofs."
            },
            {
              title: "Step 2: Graph Algorithm Trace",
              body: "Visual state tracking for Dijkstra edge relaxation and Bellman-Ford negative cycle detection."
            },
            {
              title: "Step 3: Algorithmic Complexity Quiz",
              body: "20 time-bounded questions identifying best, average, and worst-case bounds for balanced search trees."
            },
            {
              title: "Step 4: Active Recall Flashcard Deck",
              body: "24 spaced repetition cards targeting data structure invariants and dynamic programming state transitions."
            }
          ],
          prompt:
            "Compare Dijkstra and Bellman-Ford algorithms: when does Dijkstra fail and how does Bellman-Ford detect negative weight cycles?",
          review:
            "PYQ Analysis: 0/1 Knapsack problem appeared in 2023 and 2025; Dijkstra shortest path appeared in 2024 and 2025."
        },
        cursor: {
          title: "Applied Mathematics III",
          year: "Exam Weight: 25% • Core Foundation",
          docUrl: "/documents/mathematics-iii",
          quizUrl: "/documents/mathematics-iii/quiz",
          description:
            "Higher engineering mathematics: Partial differential equations, half-range Fourier series expansions, Laplace transform theorems (first/second shifting, convolution), and Cauchy-Riemann equations in complex analysis.",
          steps: [
            {
              title: "Step 1: Fourier Series Decompositions",
              body: "Dirichlet conditions and odd/even function symmetry shortcuts for rapid Euler coefficient calculation."
            },
            {
              title: "Step 2: Laplace Shifting & Convolution",
              body: "Step-by-step proofs of convolution theorem and application to 2nd order initial-value problems."
            },
            {
              title: "Step 3: Analytical Derivation Practice",
              body: "Self-testing on solving one-dimensional heat and wave equations with Dirichlet boundary conditions."
            },
            {
              title: "Step 4: Transform Identity Deck",
              body: "Quick recall of inverse transform pairs and trigonometric product-to-sum identities."
            }
          ],
          prompt:
            "State and prove the Convolution Theorem for Laplace transforms and use it to evaluate L^-1{ 1 / (s^2 * (s+1)) }.",
          review:
            "Exam frequency analysis: Fourier series and Laplace convolution appeared in 100% of analyzed semester papers over the last 3 years."
        }
      };
"""

# Replace the books definition in JS
html = re.sub(r'const books\s*=\s*\{.*?\n\s*\};\n\n\s*const body', f'{js_books_replacement}\n      const body', html, flags=re.DOTALL)

# Update the setBookDetails JS to update the buttons
set_details_old = """      function setBookDetails(key) {
        const book = books[key];
        if (!book) return;

        detailTitle.textContent = book.title;
        detailDescription.textContent = book.description;
        detailPrompt.textContent = book.prompt;
        detailReview.textContent = book.review;
        detailYear.textContent = book.year;

        detailSteps.innerHTML = "";
        book.steps.forEach((step) => {
          const item = document.createElement("li");
          item.className = "doc-step";

          const heading = document.createElement("p");
          heading.className = "step-title";
          heading.textContent = step.title;

          const bodyText = document.createElement("p");
          bodyText.className = "step-body";
          bodyText.textContent = step.body;

          item.append(heading, bodyText);
          detailSteps.appendChild(item);
        });
      }"""

set_details_new = """      function setBookDetails(key) {
        const book = books[key];
        if (!book) return;

        detailTitle.textContent = book.title;
        detailDescription.textContent = book.description;
        detailPrompt.textContent = book.prompt;
        detailReview.textContent = book.review;
        detailYear.textContent = book.year;

        const openBtn = document.querySelector("#detailOpenBtn");
        const quizBtn = document.querySelector("#detailQuizBtn");
        if (openBtn && book.docUrl) openBtn.href = book.docUrl;
        if (quizBtn && book.quizUrl) quizBtn.href = book.quizUrl;

        detailSteps.innerHTML = "";
        book.steps.forEach((step) => {
          const item = document.createElement("li");
          item.className = "doc-step";

          const heading = document.createElement("p");
          heading.className = "step-title";
          heading.textContent = step.title;

          const bodyText = document.createElement("p");
          bodyText.className = "step-body";
          bodyText.textContent = step.body;

          item.append(heading, bodyText);
          detailSteps.appendChild(item);
        });
      }"""

html = html.replace(set_details_old, set_details_new)

# Write to public/landing-pages/bestsellers-book-showcase.html
with open('public/landing-pages/bestsellers-book-showcase.html', 'w', encoding='utf-8', newline='\n') as f:
    f.write(html)

print('Generated public/landing-pages/bestsellers-book-showcase.html successfully! Length:', len(html))
