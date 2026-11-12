/* ============================================================
   PORTFOLIO DATA — single source of truth
   ============================================================ */

export const PROFILE = {
  name: 'Harshit Shyamsukha',
  role: 'Software Engineer · AI / ML & Full-Stack',
  github: 'https://github.com/Harshit-3114',
  githubHandle: 'Harshit-3114',
  linkedin: 'https://www.linkedin.com/in/harshit-shyamsukha-512254258/',
  email: 'harshitshyamsukha@gmail.com',
  phone: '7412811448',
  location: 'Chennai, India',
  site: 'https://harshit-shyamsukhas-portfolio.vercel.app/',
  resume: '/resume.pdf',
  resumeDrive: 'https://drive.google.com/file/d/1VjoFFnNqJhm1_u1kuI9RkMrW1UFdaKrq/view?usp=drive_link',
};

export const KNOWLEDGE = {
  skill: "I work across the full stack: languages like Python, JavaScript/TypeScript, C++, Java, SQL, Bash; frameworks like React, FastAPI, Node.js, PyTorch, Pandas; infrastructure tools like Docker, Kubernetes, Red Hat OpenShift, Podman, GitHub Actions; databases including MongoDB, MySQL, Supabase, MinIO; and an AI/ML stack spanning LLMs (Llama 3, Phi-3 Mini, Gemini, Groq, NVIDIA NIM), agentic pipelines with LangGraph, FAISS, Sentence Transformers, Ollama, LoRA/QLoRA fine-tuning, and GDELT/ACLED pipelines.",
  experience: "My experience includes a content writing internship and participation in the Study Australia Industry Experience Program, where I honed cross-functional collaboration skills. I also worked as a Web Developer Intern at CanIT Solutions on Canit Pulse, a multi-tenant social media analytics SaaS built with FastAPI, Supabase, React/TypeScript and Render — where I shipped production features, eliminated an OOM crash on Render's free tier, closed a session-security gap and shipped role-based permissions.",
  project: "I've built 23 projects, from GitHub Innovator — a fully autonomous six-stage LangGraph agent that discovers, rewrites, tests and publishes forks with no human in the loop — through the Edee Apply platform (FastAPI, PostgreSQL, Razorpay) for college applications, the SOS Packaging and Prakash Plastics catalogues, and the Dun Digital agency site. The AI side runs on Llama 3, FAISS and Sentence Transformers: ARGUS fuses face recognition with keystroke dynamics for passwordless login, Nexus matches a free-text problem to the nearest of 10,000 expert profiles, and Scalar Meta is an OpenEnv benchmark for support-ticket triage. This portfolio is itself the transformer — press Shift+T and it restyles from a real MiniLM encoder running entirely in your browser.",
  certifications: "I am a Red Hat Certified Specialist in Linux Diagnostics & Troubleshooting, and a Red Hat OpenShift Development I (DO188) Certified Specialist. I'm also certified in DSA in C, DBMS, and Operating Systems.",
  hire: "I'm actively looking for SDE Internships! You can reach me at harshitshyamsukha@gmail.com, or on LinkedIn at linkedin.com/in/harshit-shyamsukha-512254258.",
  education: "I'm currently pursuing my B.Tech in Computer Science at SRM Institute of Science & Technology, Chennai (Batch of Aug 2023 - May 2027).",
  default: "I'm a B.Tech CSE student at SRM Chennai passionate about software development, systems programming, and Linux. Ask me about my skills, certifications, or how to reach me!",
};

export const PROJECTS_DETAILED = [
  {
    id: 'github-innovator', title: "GitHub Innovator — Autonomous Agent", date: "Oct 2026",
    stack: ["LangGraph", "NVIDIA NIM", "Typer", "Textual", "Python"], badge: "New",
    desc: "Fully autonomous six-stage LangGraph pipeline — discover, filter, LLM-analyze, rewrite, test, publish — producing forks 80–90% different from upstream with no human in the loop.",
    problem: "Open-source maintainers receive a constant stream of low-quality pull requests that repeat the same mechanical fixes. Manually vetting and rewriting every issue by hand does not scale, and half-finished contributions are worse than none.",
    architecture: ["LangGraph graph orchestrates six typed stages: discovery, filtering, LLM analysis, code rewriting, test execution, and publishing", "NVIDIA NIM serves the local reasoning backbone so the pipeline runs without a per-token cloud bill", "A code indexer builds a structural view of the target repository before the writer agent touches it", "A planner agent decomposes the original issue into an executable change plan", "The code writer emits a diff, the test stage runs it in isolation, and only passing results reach the publisher", "A Typer CLI and a Textual TUI dashboard expose live run history and stage telemetry"],
    decisions: ["LangGraph over a plain async pipeline so stage state is checkpointed and resumable", "NVIDIA NIM over a hosted API to keep inference local and reproducible", "Held the publish stage behind a passing test run so the agent cannot open broken PRs", "Textual TUI over a web dashboard for a single-binary CLI that works over SSH"],
    metrics: "Forks 80–90% different from upstream, zero human in the loop",
    github: "https://github.com/Harshit-3114/Github-Innovator", demo: null, image: null, category: "ai", status: "live",
    files: [{ name: "graph.py", path: "agents/graph.py", url: "https://github.com/Harshit-3114/Github-Innovator", type: "py" },{ name: "code_writer.py", path: "agents/code_writer.py", url: "https://github.com/Harshit-3114/Github-Innovator", type: "py" },{ name: "publisher.py", path: "agents/publisher.py", url: "https://github.com/Harshit-3114/Github-Innovator", type: "py" }]
  },
  {
    id: 'skillroute', title: "SkillRoute", date: "Ongoing",
    stack: ["FAISS", "Sentence Transformers", "React 19", "MapLibre GL JS", "FastAPI"], badge: null,
    desc: "Intelligent talent routing system that matches candidates to opportunities using vector similarity search and geospatial dispatch visualization. The source is not public yet — the IEEE-format paper is available below.",
    problem: "Talent matching platforms use keyword filtering that misses nuanced skill adjacencies. Organizations need semantic understanding of candidate profiles plus geographic dispatch optimization.",
    architecture: ["Candidate profiles embedded via sentence-transformers into a FAISS vector index", "Synergy Score computed from cosine similarity + weighted experience factors", "MapLibre GL JS renders dispatch map showing candidate-to-opportunity routing", "FastAPI backend handles indexing, querying, and scoring orchestration", "ROI calculator projects cost-of-delay, cost-to-hire and break-even windows", "SECURITY.md documents a full audit that closed 12 vulnerabilities"],
    decisions: ["FAISS enables sub-50ms similarity search across thousands of candidate profiles", "MapLibre GL JS avoids paid map SDKs while delivering full-featured geospatial viz", "Synergy Score combines semantic match, location proximity, and availability windows", "Evolved from a Streamlit prototype into a production React 19 + FastAPI application"],
    metrics: "Full security audit closed 12 vulnerabilities, including a live API key in the repo, wildcard CORS, and missing auth/rate limiting",
    github: null, demo: null, image: null, category: "ai", status: "wip",
    files: [{ name: "SkillRoute_IEEE.pdf", path: "papers/skillroute_ieee.pdf", url: "https://github.com/Harshit-3114/Harshitshyamsukha.github.io/blob/main/papers/skillroute_ieee.pdf", type: "pdf" }]
  },
  {
    id: 'ai-ethics', title: "AI Ethics Advisor", date: "Jan 2026 – Ongoing",
    stack: ["Llama 3 (8B)", "Phi-3 Mini", "LoRA", "Ollama", "React"], badge: null,
    desc: "Full-stack web application powered by a locally hosted Llama 3 8B model that analyzes real-world business dilemmas through an ethical lens.",
    problem: "Businesses need ethical guidance when making tough decisions, but sending sensitive internal data to third-party APIs like ChatGPT poses privacy and compliance risks.",
    architecture: ["React frontend with real-time JSON streaming for token-by-token responses", "Node.js/Express backend orchestrating prompt engineering and response validation", "Ollama runtime serving Llama 3 8B and a custom LoRA fine-tuned phi-3-mini-4k-instruct model entirely on-premises", "AbortController-based stop so a runaway generation can be cancelled mid-stream", "bcrypt at cost factor 12, 7-day JWT expiry, Helmet headers, rate limiting and restricted CORS", "No data ever leaves the local network — fully air-gapped inference"],
    decisions: ["Chose Ollama over cloud APIs to guarantee data privacy", "LoRA fine-tuning on phi-3-mini-4k-instruct to keep the model small and local", "JSON streaming avoids UI blocking and enables partial result rendering", "Prompt chaining decomposes complex ethical dilemmas into sub-questions"],
    metrics: "100% valid JSON output with real-time token generation and AbortController stop",
    github: "https://github.com/Harshit-3114/ai-ethics-advisor", demo: null, image: null, category: "ai", status: "live",
    files: [{ name: "main.py", path: "ai-ethics/backend/main.py", url: "https://github.com/Harshit-3114/ai-ethics-advisor", type: "py" },{ name: "App.jsx", path: "ai-ethics/frontend/src/App.jsx", url: "https://github.com/Harshit-3114/ai-ethics-advisor", type: "jsx" },{ name: "ollama_client.py", path: "ai-ethics/backend/ollama_client.py", url: "https://github.com/Harshit-3114/ai-ethics-advisor", type: "py" }]
  },
  {
    id: 'deepfake', title: "DeepFake Detection", date: "Oct 2025",
    stack: ["FastAPI", "PyTorch", "Docker Compose", "MinIO", "Python"], badge: null,
    desc: "Microservices-based MVP for evaluating image authenticity at scale, with structured persistence and containerized deployment.",
    problem: "Image authenticity verification is computationally expensive and needs a scalable, reproducible pipeline that can handle batches of uploads.",
    architecture: ["Upload service accepts images via REST API and queues them for processing", "Processing pipeline runs detection models in isolated containers", "MinIO (S3-compatible) stores raw uploads and results with metadata", "Docker Compose orchestrates all services for one-command deployment", "Independent text, image, audio and video detector services with a GradientBoosting fusion layer"],
    decisions: ["MinIO over cloud S3 for full local control and zero egress costs", "Docker Compose enables reproducible dev/test/prod environments", "Async task queue prevents upload endpoint from blocking on inference", "Per-service model directories keep each detector independently trainable"],
    metrics: "Four modality-specific detector services plus a fusion layer, orchestrated end to end",
    github: "https://github.com/Harshit-3114/Deepfake-Detection", demo: null, image: null, category: "fullstack", status: "live",
    files: [{ name: "docker-compose.yml", path: "docker-compose.yml", url: "https://github.com/Harshit-3114/Deepfake-Detection", type: "yml" },{ name: "train_xception.py", path: "detectors/image_detector/train_xception.py", url: "https://github.com/Harshit-3114/Deepfake-Detection", type: "py" },{ name: "README.md", path: "README.md", url: "https://github.com/Harshit-3114/Deepfake-Detection", type: "md" }]
  },
  {
    id: 'insightx', title: "InsightX Analytics", date: "Aug 2025",
    stack: ["Gemini 1.5", "Gemini 2.5 Flash", "Text-to-SQL", "SQLite"], badge: null,
    desc: "Enterprise-grade analytics engine that translates natural language questions into executing SQL queries against relational databases.",
    problem: "Non-technical stakeholders rely on data-driven decisions but lack SQL proficiency, creating a bottleneck around engineering teams for every ad-hoc query.",
    architecture: ["Two-pass architecture: Gemini generates SQL from natural language, executes it against a real database, then a second pass produces insights strictly from the returned data", "Read-only database connection with SQL validation and query caching", "4-point structured insight report: Direct Response, Statistics, Context, Recommendations", "The exact generated SQL is displayed for transparency", "Indian Rupee formatting applied consistently across every UI layer", "Path-selective raw SQL fetch layer avoids full in-memory loads of large JSON columns"],
    decisions: ["Gemini 1.5 chosen for its 1M-token context window — can ingest full schema definitions", "A second inference pass over the actual result set is what removes hallucination", "Read-only connection plus query validation prevents destructive or hallucinated SQL", "Path-selective fetching eliminated a production OOM on Render's free tier"],
    metrics: "Eliminated a production OOM crash on Render's free tier (~19 MB JSON column no longer fully materialised)",
    github: "https://github.com/Harshit-3114/InsightX", demo: null, image: null, category: "fullstack", status: "live",
    files: [{ name: "text_to_sql_engine.py", path: "text_to_sql_engine.py", url: "https://github.com/Harshit-3114/InsightX", type: "py" },{ name: "data_engine.py", path: "data_engine.py", url: "https://github.com/Harshit-3114/InsightX", type: "py" },{ name: "Readme.md", path: "InsightX Readme.md", url: "https://github.com/Harshit-3114/InsightX", type: "md" }]
  },
  {
    id: 'edee', title: "Edee Apply", date: "Sep 2026",
    stack: ["FastAPI", "PostgreSQL", "Razorpay", "Firebase Auth", "Docker"], badge: "Client",
    desc: "FastAPI backend powering a college-application platform — student signup, college search and shortlisting, Razorpay payments, and role-based admin portals.",
    problem: "Students applying to colleges juggle scattered deadlines and paperwork across portals, while institutions need a reliable, structured pipeline of applications and payments.",
    architecture: ["Async FastAPI service with SQLAlchemy 2.0, asyncpg and Alembic migrations", "PostgreSQL 16 with seeded college catalogue and phase-1 schema migrations", "Firebase Admin SDK verifies JWTs for students, admins and staff", "Razorpay order creation with webhook handling for application payments", "Routers split by domain: students, colleges, shortlists, payments", "pytest/httpx async test suite with black and ruff linting, containerised via Docker Compose"],
    decisions: ["Firebase Admin JWT verification over rolling a bespoke auth service", "asyncpg and SQLAlchemy 2.0 async for connection efficiency under concurrent applicant load", "Alembic for versioned migrations instead of ad-hoc schema edits", "pytest with httpx AsyncClient so the suite exercises the real async stack"],
    metrics: "Razorpay payment flow, role-based portals, seeded college catalogue and a versioned migration chain",
    github: "https://github.com/Harshit-3114/Edee", demo: null, image: null, category: "client", status: "live",
    files: [{ name: "main.py", path: "app/main.py", url: "https://github.com/Harshit-3114/Edee", type: "py" },{ name: "settings.py", path: "app/core/settings.py", url: "https://github.com/Harshit-3114/Edee", type: "py" },{ name: "requirements.txt", path: "requirements.txt", url: "https://github.com/Harshit-3114/Edee", type: "txt" }]
  },
  {
    id: 'sosp', title: "SOS Packaging", date: "2026",
    stack: ["Astro", "React", "Tailwind CSS", "Framer Motion"], badge: "Client",
    desc: "Marketing site for Shree Om Sai Packaging — an ISO 9001 industrial manufacturer of steel cable drums, corrugated drums and M.S spools.",
    problem: "A long-established industrial manufacturer needed a digital presence that speaks to cable-industry buyers rather than a generic corporate template, while staying fast and maintainable.",
    architecture: ["Astro with React islands for a mostly static, fast-loading marketing site", "Hero carousel, logo carousel and scroll-triggered reveal sections", "Animated counters and a brochure download served from public/", "PDF brochure generated with pdfkit and images optimised with sharp", "Per-page canonical tags and sitemap for crawlability", "Vercel Analytics and Speed Insights for real-user performance data"],
    decisions: ["Astro over a SPA for near-zero client JS and a faster first paint on a content-led site", "React islands only where interactivity is actually needed", "sharp for WebP conversion with original JPEGs retained as fallback", "An explicit DESIGN.md brand system so the industrial green/gold identity stays consistent"],
    metrics: "ISO 9001 certified manufacturer, est. 2008 — 'Save Wood, Go Green'",
    github: "https://github.com/Harshit-3114/SOSP", demo: "https://sosp-nine.vercel.app", image: null, category: "client", status: "live",
    files: [{ name: "index.astro", path: "src/pages/index.astro", url: "https://github.com/Harshit-3114/SOSP", type: "jsx" },{ name: "DESIGN.md", path: "DESIGN.md", url: "https://github.com/Harshit-3114/SOSP", type: "md" },{ name: "astro.config.mjs", path: "astro.config.mjs", url: "https://github.com/Harshit-3114/SOSP", type: "yml" }]
  },
  {
    id: 'dsfs', title: "Dynamic Societal Friction Simulator (DSFS)", date: "Ongoing",
    stack: ["GDELT", "ACLED", "MuRIL", "Python", "PyTorch"], badge: "Research",
    desc: "Two-stage conflict forecasting pipeline — a MuRIL encoder with trust learning and cleavage classification feeding a friction-tensor model with a Negative Binomial forecasting head.",
    problem: "Traditional conflict forecasting relies on sparse survey data and lags behind real-time events. Automated early-warning systems need to ingest global news and conflict reports continuously.",
    architecture: ["GDELT 2.0 event stream captures real-time global news coverage", "ACLED provides validated conflict event records for supervised training", "MuRIL multilingual embeddings enable cross-lingual signal extraction from Indian regional languages", "Transformer-based temporal fusion model forecasts friction scores at weekly horizons"],
    decisions: ["MuRIL over multilingual BERT for superior performance on 16 Indian languages", "Hawkes process baseline for rigorous comparison — not just naive baselines", "h=4 weeks forecasting horizon balances lead time against accuracy decay", "Co-authored through the SRMIST CINTEL department"],
    metrics: "LTROC 0.73 at h=4 weeks, 12.3% improvement over Hawkes baseline",
    github: "https://github.com/vivek797029/Dynamic-Societal-Friction-Simulator", demo: null, image: null, category: "ai", status: "wip",
    files: [{ name: "friction_model.py", path: "dsfs/models/friction_model.py", url: "https://github.com/vivek797029/Dynamic-Societal-Friction-Simulator", type: "py" },{ name: "README.md", path: "dsfs/README.md", url: "https://github.com/vivek797029/Dynamic-Societal-Friction-Simulator", type: "md" },{ name: "IEEE_Paper.pdf", path: "docs/DSFS_IEEE_Paper.pdf", url: "https://github.com/vivek797029/Dynamic-Societal-Friction-Simulator", type: "pdf" },{ name: "requirements.txt", path: "dsfs/requirements.txt", url: "https://github.com/vivek797029/Dynamic-Societal-Friction-Simulator", type: "txt" }]
  },
  {
    id: 'finance-tracker', title: "Finance Tracker", date: "2025",
    stack: ["FastAPI", "React 18", "TypeScript", "Chart.js"], badge: null,
    desc: "Full-stack personal finance app for budgeting, transaction management and spending analytics, with a JWT-authenticated backend and a custom Tailwind design system.",
    problem: "Manual budgeting spreadsheets are tedious — needed an automated way to categorize, track, and visualize spending patterns over time.",
    architecture: ["React 18 + TypeScript frontend with Chart.js visualizations and Framer Motion transitions", "FastAPI backend with JWT authentication and PBKDF2+SHA256 password hashing", "Monthly, category-wise and payment-method budgets with real-time tracking", "Interactive dashboard with pie charts, a calendar view, and a 30-item soft-delete recycle bin", "Custom Tailwind design system rather than a stock UI kit"],
    decisions: ["PBKDF2+SHA256 over plain SHA hashing for password storage", "Soft delete with a recycle bin instead of hard deletes so budget history stays auditable", "Chart.js over heavier viz libraries for lightweight bundle size", "A bespoke Tailwind token set so the dashboard matches the product's own brand"],
    metrics: "Budgets by month, category and payment method, with a 30-item soft-delete recycle bin",
    github: "https://github.com/Harshit-3114/Finance-tracker", demo: null, image: null, category: "fullstack", status: "live",
    files: []
  },
  {
    id: 'saas-vm', title: "SaaS Vending Machine", date: "2025",
    stack: ["Terraform", "Kubernetes", "Ansible", "AWS", "Shell"], badge: null,
    desc: "Infrastructure-as-Code platform that provisions multi-tenant SaaS environments — Terraform, Kind/EKS, Ansible, 70+ tests, 3 tenant tiers.",
    problem: "Manually provisioning SaaS tenant environments is slow and error-prone. Needed a fully automated, reproducible IaC pipeline with isolated tenant resources.",
    architecture: ["Terraform provisions cloud infrastructure (VPC, S3, IAM, RDS, ElastiCache, K8s namespaces)", "Kind (local) or EKS (AWS) for Kubernetes tenant isolation", "Ansible playbooks for configuration management with OS detection", "4-format architecture visualization (ASCII/HTML/Markdown/Mermaid)", "70+ automated tests across provisioning, networking, and security"],
    decisions: ["Dual deployment mode (local Kind + AWS EKS) for dev/prod parity", "Windows batch menu for interactive multi-mode deployment", "AWS Secrets Manager over hardcoded secrets for security hardening", "3-tier tenant resource allocation (Basic/Standard/Premium)"],
    metrics: "70+ automated tests, 3 tenant tiers, dual Kind/EKS deployment modes",
    github: "https://github.com/Harshit-3114/Saas-Vending-Machine", demo: null, image: null, category: "fullstack", status: "live",
    files: []
  },
  {
    id: 'crest', title: "Crest Automotive Solutions", date: "2025 – Ongoing",
    stack: ["React", "FastAPI", "Supabase", "TailwindCSS"], badge: null,
    desc: "Premium car detailing studio web platform with owner, customer, and worker portals.",
    problem: "A local premium auto detailing business needed a multi-portal web presence with booking, job tracking, and customer management — built from scratch.",
    architecture: ["React frontend with separate routing for owner / customer / worker roles", "FastAPI backend handling appointments, worker assignment, and job status", "Supabase for auth, database, and real-time job status updates", "Deployed on GitHub Pages (frontend) with a cloud backend"],
    decisions: ["Supabase chosen for real-time subscriptions without a custom WebSocket server", "Role-based routing via React context — single codebase, three portal views", "TailwindCSS for rapid consistent UI across all three portals"],
    metrics: null, github: "https://github.com/concealedaaryan/carboutiqueauto", demo: null, image: null, category: "client", status: "live",
    files: [{ name: "carboutiqueauto", path: "astro site", url: "https://github.com/concealedaaryan/carboutiqueauto", type: "md" },{ name: "Car-service-updates", path: "detailing updates app", url: "https://github.com/concealedaaryan/Car-service-updates", type: "md" }]
  },
  {
    id: 'cosmic-calendar', title: "Cosmic Calendar", date: "2025 (Hackathon)",
    stack: ["React", "Vite", "Tailwind CSS", "NASA APOD API", "HuggingFace Spaces"], badge: "Hackathon",
    desc: "Interactive space exploration web app built for AstralWeb Innovate Hackathon 2025 — NASA APOD daily imagery, space quiz, AI astronomy chatbot, bookmarks, and countdown timers. Built over the hackathon weekend; the source was never released publicly.",
    problem: "Building a polished, demoworthy full-stack space app in a single hackathon weekend required ruthless feature prioritization.",
    architecture: ["React + Vite frontend consuming NASA APOD API for daily astronomy pictures", "HuggingFace Spaces Gradio chatbot (FLAN-T5 Large) for AI astronomy Q&A", "localStorage for bookmarking, theme persistence, and API caching", "Light/dark theme toggle with system preference detection"],
    decisions: ["FLAN-T5 Large over cloud LLMs for zero-cost inference on HuggingFace free tier", "localStorage API caching with TTL to stay under NASA's 1000 req/day limit", "Prioritized 4 core features over 8 planned ones to ship on time"],
    metrics: null, github: null, demo: null, image: null, category: "fullstack", status: "live",
    files: []
  },
  {
    id: 'argus', title: "ARGUS — Multimodal Biometric Login", date: "Oct 2026",
    stack: ["Flask", "FaceNet512 / DeepFace", "Keystroke Dynamics", "OpenCV", "Python"], badge: "New",
    desc: "A login gate that authenticates with two biometric modalities instead of a password — face recognition scored by cosine similarity against enrolled embeddings, keystroke dynamics scored by a per-user scaled-Manhattan filter — fused with weighted score-level fusion.",
    problem: "Passwords are phishable, reused and leak. One modality is not enough either: a photograph of you cannot reproduce your typing rhythm, and an impostor who knows the passphrase cannot reproduce your face or your rhythm.",
    architecture: [
      "Face branch: webcam frames are embedded with FaceNet512 via DeepFace and matched by maximum cosine similarity against enrolled templates",
      "Keystroke branch: browser keydown/keyup timestamps are normalised per user and scored with a scaled-Manhattan filter, sim = 1/(1+d)",
      "Both scores are normalised to [0,1] and combined with weighted score-level fusion, w_face = 0.6 and w_keystroke = 0.4",
      "The fused score is compared against a decision threshold to admit or reject the login",
      "Evaluation harness reports FAR, FRR, EER and AUC per modality and for the fused system, rendering ROC curves and score distributions automatically",
      "PIN-gated admin console for enrolment, threshold tuning and the biometric evaluation results"
    ],
    decisions: [
      "Score-level fusion over feature-level, so each modality can be tuned and inspected independently",
      "A 0.6/0.4 weight split reflecting face as the stronger physiological signal against a noisier behavioural one",
      "Per-user keystroke templates rather than a global model, because typing rhythm is personal",
      "Cosine similarity for faces so a match survives differences in lighting and pose"
    ],
    metrics: "FAR, FRR, EER and AUC evaluated per modality and for the fused system",
    github: "https://github.com/Harshit-3114/ARGUS", demo: null, image: null, category: "ai", status: "live",
    files: [{ name: "app.py", path: "app.py", url: "https://github.com/Harshit-3114/ARGUS", type: "py" },{ name: "face_engine.py", path: "face_engine.py", url: "https://github.com/Harshit-3114/ARGUS", type: "py" },{ name: "evaluation.py", path: "evaluation.py", url: "https://github.com/Harshit-3114/ARGUS", type: "py" },{ name: "README.md", path: "README.md", url: "https://github.com/Harshit-3114/ARGUS", type: "md" }]
  },
  {
    id: 'heatwave-predictor', title: "HeatWave AI — India Heat Wave Predictor", date: "Nov 2026",
    stack: ["Flask", "Python", "Pandas", "Jinja2"], badge: "New",
    desc: "A forecasting app for 22 major Indian cities that reports predicted temperature, severity class, confidence, humidity estimate and safety advice — from a transparent statistical model rather than an opaque one.",
    problem: "Heat wave warnings need to be explainable and fast enough to run offline in a district office. A trained network with no visible weights is hard to trust and harder to tune when the threshold policy changes.",
    architecture: [
      "Seasonal base curve per city, adjusted by a 12-month offset curve that peaks in May and troughs in December",
      "Day-of-year sinusoidal trend with a secondary cosine term, capturing the annual temperature wave",
      "Latitude factor and an urban heat island approximation scaled by city size",
      "Gaussian jitter (σ = 1.5 °C) representing day-to-day variation",
      "IMD-style zone thresholds — plains ≥ 40 °C, coastal ≥ 37 °C, hilly ≥ 30 °C — with severity set by departure from each city's summer high",
      "Confidence is derived from the distance between the prediction and the city's typical summer high, bounded to 40–95%",
      "Seven-day forecasts and a national hotspot ranking over all cities, with one Flask dependency and no build step"
    ],
    decisions: [
      "A statistical seasonal model over a trained network, so every prediction traces back to an inspectable formula",
      "Zone-aware thresholds matching IMD practice rather than one global cut-off",
      "Confidence derived from departure from the seasonal norm, which is the honest signal for this kind of model",
      "One dependency and no build step, so the app runs fully offline"
    ],
    metrics: "22 cities, 3 difficulty-free zones, 7-day forecasts and a live hotspot ranking",
    github: "https://github.com/Harshit-3114/heatwave-predictor", demo: null, image: null, category: "ai", status: "live",
    files: [{ name: "predictor.py", path: "model/predictor.py", url: "https://github.com/Harshit-3114/heatwave-predictor", type: "py" },{ name: "cities.py", path: "data/cities.py", url: "https://github.com/Harshit-3114/heatwave-predictor", type: "py" },{ name: "app.py", path: "app.py", url: "https://github.com/Harshit-3114/heatwave-predictor", type: "py" },{ name: "README.md", path: "README.md", url: "https://github.com/Harshit-3114/heatwave-predictor", type: "md" }]
  },
  {
    id: 'scalar-meta', title: "Scalar Meta — Customer Support Ticket Triage", date: "Nov 2026",
    stack: ["OpenEnv", "Gym-style API", "OpenAI", "pytest"], badge: "New",
    desc: "An OpenEnv-compatible benchmark environment for routing customer support tickets to the correct department, with three difficulty tiers and a fractional reward so partial credit is visible in the signal.",
    problem: "Evaluating a support-routing agent needs a reproducible environment with a known answer key. A live support queue is neither reproducible nor safe to experiment against.",
    architecture: [
      "Gym-style environment implementing reset(), state(), step(action) and grader()",
      "Three task tiers — easy (1 ticket), medium (3 tickets), hard (5 tickets) — spanning repair, billing, sales and tech",
      "Fractional reward of 1/len(tickets) per correct routing, so partial credit is observable mid-task",
      "Deterministic ticket ordering, which makes runs directly comparable across models",
      "The hard tier deliberately pairs two differently-phrased billing tickets and a tech ticket that a keyword heuristic misroutes to repair",
      "OpenAI-compatible --api-base, so any hosted provider or a local Ollama / vLLM server works without code changes",
      "25 unit tests covering task validation, reward arithmetic, sequencing, the done-flag lifecycle and the grader"
    ],
    decisions: [
      "Fractional rather than binary reward, because a 5-ticket task should not read as all-or-nothing",
      "Fixed ticket order per task, so two models can be compared on the same sequence",
      "Gym-style interface to match what OpenEnv environments implement",
      "A swappable API base rather than a hardcoded provider, so the benchmark runs against local models"
    ],
    metrics: "25 passing unit tests; three tiers scoring from 0.0 to 1.0",
    github: "https://github.com/Harshit-3114/scalar-meta", demo: null, image: null, category: "ai", status: "live",
    files: [{ name: "env.py", path: "env.py", url: "https://github.com/Harshit-3114/scalar-meta", type: "py" },{ name: "inference.py", path: "inference.py", url: "https://github.com/Harshit-3114/scalar-meta", type: "py" },{ name: "test_env.py", path: "tests/test_env.py", url: "https://github.com/Harshit-3114/scalar-meta", type: "py" },{ name: "README.md", path: "README.md", url: "https://github.com/Harshit-3114/scalar-meta", type: "md" }]
  },
  {
    id: 'nexus-matcher', title: "Nexus — Deep Semantic Matchmaker", date: "Nov 2026",
    stack: ["FAISS", "Sentence Transformers", "Gemini 2.5 Flash", "Streamlit", "Plotly"], badge: "New",
    desc: "A semantic expert-matching system over 10,000 synthetic global profiles — a transformer encoder embeds a problem description, FAISS finds the nearest experts, and Gemini writes the match dossier and the outreach email.",
    problem: "Keyword matching misses skill adjacencies: a request for 'someone who has seen a mainframe before' shares no words with the expert who has actually maintained one.",
    architecture: [
      "Gemini 2.5 Flash distils the visitor's free-text problem into a concrete skill statement",
      "all-MiniLM-L6-v2 embeds that statement into a 384-dimensional vector",
      "A flat L2 FAISS index over 10,000 pre-embedded expert profiles returns the nearest matches in milliseconds",
      "Match percentage is derived from embedding distance and rendered as a Plotly gauge",
      "Gemini then produces a four-point dossier — why matched, profile, pros, friction",
      "A one-click personalised outreach email is drafted from the same dossier",
      "build_index.py regenerates the index and metadata cache from the source CSV, so the binaries never have to be committed"
    ],
    decisions: [
      "A flat L2 index rather than an approximate index, because 10,000 vectors is small enough that exact search is both fast and free of recall loss",
      "all-MiniLM-L6-v2 at 384 dimensions, which is small enough to run on CPU and good enough for short profile text",
      "The index and metadata are generated artefacts rebuilt from CSV, not committed binaries",
      "Distance mapped to a percentage with a 60–99.9% floor, because a cosine score alone does not communicate to a non-technical reader"
    ],
    metrics: "10,000 expert profiles indexed at 384 dimensions, with millisecond L2 search",
    github: "https://github.com/Harshit-3114/nexus-matcher", demo: null, image: null, category: "ai", status: "live",
    files: [{ name: "app.py", path: "app.py", url: "https://github.com/Harshit-3114/nexus-matcher", type: "py" },{ name: "build_index.py", path: "build_index.py", url: "https://github.com/Harshit-3114/nexus-matcher", type: "py" },{ name: "README.md", path: "README.md", url: "https://github.com/Harshit-3114/nexus-matcher", type: "md" }]
  },
  {
    id: 'portfolio-rebalancer', title: "Portfolio Rebalancer", date: "Nov 2026",
    stack: ["React 19", "Express", "sql.js", "Recharts", "Vite"], badge: "New",
    desc: "A household portfolio rebalancer: import a broker CSV, set target allocations by asset class, and get exact buy/sell trades per account — with cash never allowed to move between accounts.",
    problem: "Brokers export a flat list of positions, but households think in asset classes and targets. Reconciling the two by hand across three or four accounts is where the spreadsheet sprawl starts.",
    architecture: [
      "A single-pass state-machine CSV parser handles quoted fields with embedded commas, escaped quotes, multi-line values and disclaimer footer rows",
      "An editable ticker → asset-class mapping layer turns symbols into US Equity, International Equity, Gold, Treasuries, Thematic and Cash",
      "Target allocation percentages that must sum to 100%, with three presets: Aggressive Growth, Conservative Income, Permanent Portfolio",
      "Per-account liquidity floors — the minimum cash percentage purchases may never dip below",
      "Shortfall handling: when buys exceed available cash, purchases scale down proportionally so cash never goes negative",
      "Per-account isolation: each account rebalances against its own cash, because moving cash between a taxable and a tax-advantaged account is a taxable event",
      "sql.js (SQLite compiled to WebAssembly) for persistence, so there are no native build dependencies",
      "Share counts are estimated from the last available price — buys floored, sells ceiled — and labelled as estimates"
    ],
    decisions: [
      "Per-account isolation over a global optimiser, because a global optimum that needs cash transferred between accounts cannot actually be executed",
      "sql.js over better-sqlite3, so the project installs without a native toolchain",
      "Cash modelled as a first-class target class rather than a residual, because the user wants explicit control over cash position",
      "Proportional scaling for shortfalls rather than a priority solver, which could starve low-priority classes indefinitely"
    ],
    metrics: "12 API endpoints, three target presets, per-account liquidity floors and proportional shortfall handling",
    github: "https://github.com/Harshit-3114/portfolio-rebalancer", demo: null, image: null, category: "fullstack", status: "live",
    files: [{ name: "rebalancer.js", path: "server/rebalancer.js", url: "https://github.com/Harshit-3114/portfolio-rebalancer", type: "js" },{ name: "csv-parser.js", path: "server/csv-parser.js", url: "https://github.com/Harshit-3114/portfolio-rebalancer", type: "js" },{ name: "App.jsx", path: "client/src/App.jsx", url: "https://github.com/Harshit-3114/portfolio-rebalancer", type: "jsx" },{ name: "ARCHITECTURE.md", path: "docs/ARCHITECTURE.md", url: "https://github.com/Harshit-3114/portfolio-rebalancer", type: "md" }]
  },
  {
    id: 'web-auditor', title: "Web Auditor", date: "Nov 2026",
    stack: ["Node.js", "Cheerio", "puppeteer-core", "Chromium"], badge: "New",
    desc: "A CLI that crawls a site and runs 77 checks across SEO, UX/accessibility, performance, security and duplicate content — then reports findings grouped by the team that has to fix them.",
    problem: "Auditing a site page-by-page in devtools is slow, inconsistent, and easy to skip the boring-but-important checks. The output also tends to arrive as a flat list nobody can act on.",
    architecture: [
      "A breadth-first crawler follows internal links with configurable depth and page limits",
      "Cheerio extracts DOM detail from the source while puppeteer-core drives real Chromium for what static analysis cannot see",
      "77 checks in total — 10 SEO, 21 UX/accessibility, 16 performance, 14 security, 3 duplicate-content",
      "Core Web Vitals (LCP, CLS, FCP), DOM size and console errors come from the browser, not from headers",
      "Every finding carries a severity, a owning team and a remediation note",
      "--platform wix filters the report to dashboard-fixable issues and gives the exact navigation path for each",
      "Graceful fallback to HTTP-only mode when Chromium is unavailable, rather than failing the run",
      "JSON output for CI pipelines"
    ],
    decisions: [
      "A CLI over a web app, because a site audit is a batch job that should point at a URL and hand back a list",
      "Grouping findings by team, so the output maps to who fixes what instead of being one undifferentiated pile",
      "Real Chromium alongside Cheerio, because the two see complementary halves of the page",
      "Falling back to HTTP-only instead of aborting, so a missing browser degrades the report rather than losing it"
    ],
    metrics: "77 checks across 5 categories, with a per-team breakdown and severity histogram",
    github: "https://github.com/Harshit-3114/web-auditor", demo: null, image: null, category: "fullstack", status: "live",
    files: [{ name: "audits.js", path: "lib/audits.js", url: "https://github.com/Harshit-3114/web-auditor", type: "js" },{ name: "index.js", path: "index.js", url: "https://github.com/Harshit-3114/web-auditor", type: "js" },{ name: "platform.js", path: "lib/platform.js", url: "https://github.com/Harshit-3114/web-auditor", type: "js" },{ name: "README.md", path: "README.md", url: "https://github.com/Harshit-3114/web-auditor", type: "md" }]
  },
  {
    id: 'job-agent', title: "Job Agent", date: "Nov 2026",
    stack: ["Python", "BeautifulSoup4", "OpenAI", "SQLite", "Chrome headless"], badge: "New",
    desc: "A CLI that automates the mechanical half of job hunting — scrape listings, tailor your resume to each posting, render it to PDF, and track every application — while stopping exactly where judgement is required.",
    problem: "Finding 30 relevant listings and rewriting your resume for each one is a lot of repetitive work, but the final judgement about which roles to pursue and whether an application sounds like you is not a machine's to make.",
    architecture: [
      "Multi-source scraping across Indeed, LinkedIn and Glassdoor with role, location and keyword filters",
      "An exclude-keyword list and a job-age cutoff, plus a configurable request delay and rotating user agents",
      "An LLM step that takes the job description and your base resume and returns a tailored resume and cover letter per role",
      "HTML with print-specific CSS rendered to PDF through Chrome headless, with a pdfkit fallback",
      "Every application is upserted into SQLite with a ready → applied status transition",
      "auto_submit defaults to false — the agent prepares materials and never sends anything",
      "Personal data (resume, API key, application database) is kept out of version control entirely"
    ],
    decisions: [
      "Splitting the workflow at the point where judgement starts, so the tool automates tedium without automating decisions",
      "auto_submit off by default, with submission as an explicit opt-in",
      "HTML plus print CSS over a document library, which keeps the PDF typographically clean without a heavy dependency",
      "A rotating user agent and a request delay, so scraping stays within reasonable limits"
    ],
    metrics: "Scrape → tailor → render → track, end to end, across 9 CLI subcommands",
    github: "https://github.com/Harshit-3114/job-agent", demo: null, image: null, category: "fullstack", status: "live",
    files: [{ name: "scraper.py", path: "src/scraper.py", url: "https://github.com/Harshit-3114/job-agent", type: "py" },{ name: "customizer.py", path: "src/customizer.py", url: "https://github.com/Harshit-3114/job-agent", type: "py" },{ name: "resume_renderer.py", path: "src/resume_renderer.py", url: "https://github.com/Harshit-3114/job-agent", type: "py" },{ name: "README.md", path: "README.md", url: "https://github.com/Harshit-3114/job-agent", type: "md" }]
  },
  {
    id: 'trizen', title: "Trizen — Photo Sharing Platform", date: "Nov 2026",
    stack: ["FastAPI", "SQLAlchemy", "React 18", "TypeScript", "Vercel"], badge: "New",
    desc: "A full-stack photo-sharing platform for photography and event teams: the team uploads event photos, an admin curates them, and a PIN-protected customer gallery is published behind a shareable link.",
    problem: "Event photographers deliver galleries by email, then answer the same 'where is my photo?' question endlessly. The customer needs a link, not a login; the team needs curation before anything goes public.",
    architecture: [
      "FastAPI backend with a lifespan handler, a storage abstraction over local disk or S3, and separate routers for events, memberships, photos and galleries",
      "Schema built on SQLAlchemy models with users, events, event_members, photos, galleries and a gallery_photos join table",
      "Public gallery access is gated by a bcrypt-hashed PIN, with per-slug rate limiting of 20 attempts per 10 minutes",
      "Unpublished slugs return 404 rather than 403, so the API never leaks which galleries exist",
      "Members can upload and view but cannot publish galleries, select photos, or delete other people's photos",
      "Upload validation covers an image MIME allowlist, a 10 MB default cap and 50 files per request",
      "React 18 + TypeScript SPA with an auth context and service layer",
      "A Vercel serverless entrypoint with its own dependency set for deployment"
    ],
    decisions: [
      "bcrypt-hashed PINs rather than plaintext comparison, and per-slug rate limiting to blunt guessing",
      "404 instead of 403 for foreign events, because a 403 confirms that the resource exists",
      "A storage abstraction so local disk works in development and S3 works in production behind one interface",
      "create_all() over Alembic for a greenfield schema — with the trade-off documented, since it never alters existing tables"
    ],
    metrics: "PIN-gated public galleries, per-slug rate limiting and 404-not-403 isolation",
    github: "https://github.com/Harshit-3114/trizen", demo: null, image: null, category: "fullstack", status: "live",
    files: [{ name: "main.py", path: "backend/app/main.py", url: "https://github.com/Harshit-3114/trizen", type: "py" },{ name: "gallery.py", path: "backend/app/api/v1/endpoints/gallery.py", url: "https://github.com/Harshit-3114/trizen", type: "py" },{ name: "storage.py", path: "backend/app/core/storage.py", url: "https://github.com/Harshit-3114/trizen", type: "py" },{ name: "README.md", path: "README.md", url: "https://github.com/Harshit-3114/trizen", type: "md" }]
  },
  {
    id: 'sdn', title: "SDN Lab — OpenFlow Control Plane", date: "Oct 2026",
    stack: ["Mininet", "Open vSwitch", "Ryu", "OpenFlow 1.3", "Python"], badge: "Lab",
    desc: "A software-defined networking lab: three Open vSwitches under one custom Ryu controller running a hand-written L2-learning application over OpenFlow 1.3, with a management GUI for live topology inspection.",
    problem: "Learning SDN by reading about it does not teach you what actually breaks. The interesting failures — stale flow tables, a controller that loses a switch, MAC tables that never age — only show up against a live topology.",
    architecture: [
      "Mininet emulates a linear topology of three switches and six hosts with auto-assigned addressing and MACs",
      "Open vSwitch provides the data plane; every switch opens its own OpenFlow 1.3 connection to the controller over TCP 6653",
      "A custom Ryu controller application implements L2 learning — it installs flow rules rather than flooding packets",
      "A Python management GUI drives the topology and inspects live state",
      "Verification scripts check end-to-end connectivity and report failures rather than assuming the topology came up",
      "State purging between runs, because a stale flow table is the single most common source of confusing lab results",
      "Portable launchers for both Windows and Linux"
    ],
    decisions: [
      "A linear topology rather than a full mesh, because a three-switch line is the smallest topology that still exercises the control plane",
      "Ryu over OpenFlow-based controllers with more moving parts, keeping the learning surface narrow",
      "Explicit state purging between runs, so a previous experiment cannot masquerade as a current result",
      "A GUI alongside the CLI, because watching the flow table change is the part that teaches"
    ],
    metrics: "3 switches, 6 hosts, one controller, OpenFlow 1.3 over TCP 6653",
    github: "https://github.com/Harshit-3114/SDN", demo: null, image: null, category: "fullstack", status: "live",
    files: [{ name: "l2_learn_switch.py", path: "controller/l2_learn_switch.py", url: "https://github.com/Harshit-3114/SDN", type: "py" },{ name: "topology.py", path: "mininet/topology.py", url: "https://github.com/Harshit-3114/SDN", type: "py" },{ name: "sdn_gui.py", path: "gui/sdn_gui.py", url: "https://github.com/Harshit-3114/SDN", type: "py" },{ name: "README.md", path: "README.md", url: "https://github.com/Harshit-3114/SDN", type: "md" }]
  },
  {
    id: 'prakash-plastics', title: "Prakash Plastics — Catalogue Site", date: "Nov 2026",
    stack: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "Express"], badge: "Client",
    desc: "A product catalogue site for a plastic household goods manufacturer — 244 SKUs across 17 categories, with filtering, product detail pages, a Groq-powered PrakashAI assistant and a Web3Forms contact flow.",
    problem: "A manufacturer with 244 SKUs across 17 categories needs a catalogue that a customer can actually search, and an assistant that can answer 'do you make a 20 L bucket in dark green?' without a human on the other end.",
    architecture: [
      "A typed catalogue of 244 SKUs across 17 categories, each with code, capacity, dimensions and colour options",
      "Filtering by category, capacity and colour with URL-driven state, so a filtered view can be shared",
      "Product detail pages with per-SKU specs and colour swatches",
      "PrakashAI chatbot: the server injects a condensed catalogue context into a Groq prompt and proxies the request",
      "A contact form with validation, a honeypot and Web3Forms delivery",
      "JSON-LD for LocalBusiness, WebSite, FAQPage, BreadcrumbList and ItemList, plus canonical URLs, Open Graph and Twitter cards",
      "A complete design system written before the UI — colour tokens, a 6-step type scale, spacing, component specs, motion rules and accessibility requirements",
      "67 tests across catalogue integrity, components, hooks, API endpoints and pages"
    ],
    decisions: [
      "DESIGN.md written before any component, so every later decision traces back to a rule rather than to taste",
      "inline SVG category icons over an icon font, so they inherit colour and need no extra request",
      "The catalogue context injected server-side rather than shipped to the browser, so the chatbot cannot be fed a different catalogue than the one displayed",
      "Web3Forms with a honeypot over a custom backend, keeping form delivery to zero infrastructure"
    ],
    metrics: "244 SKUs, 17 categories, 67 passing tests and a full documented design system",
    github: "https://github.com/Harshit-3114/prakash-plastics", demo: null, image: null, category: "client", status: "live",
    files: [{ name: "DESIGN.md", path: "DESIGN.md", url: "https://github.com/Harshit-3114/prakash-plastics", type: "md" },{ name: "catalogue.ts", path: "src/data/catalogue.ts", url: "https://github.com/Harshit-3114/prakash-plastics", type: "ts" },{ name: "server.ts", path: "server.ts", url: "https://github.com/Harshit-3114/prakash-plastics", type: "ts" },{ name: "README.md", path: "README.md", url: "https://github.com/Harshit-3114/prakash-plastics", type: "md" }]
  },
  {
    id: 'dun-digital', title: "Dun Digital", date: "2026",
    stack: ["Astro", "Tailwind CSS", "TypeScript", "Sharp"], badge: "Client",
    desc: "The public front door for Dun Digital — a Chennai agency taking on brand, content, media, PR, websites and live events under one point of contact. Eight service lines, four case studies and a conversion-focused enquiry path.",
    problem: "Commercial decision-makers arrive asking 'can this team carry my whole brief?' and institutional buyers asking 'can you run a public-awareness campaign end to end?'. Both are skimming. The site has to answer both in one pass, and route them into a conversation.",
    architecture: [
      "A fully static Astro build — no accounts, no checkout, no backend, and almost no client JavaScript",
      "Eight service line pages, four case-study pages, an about page, a contact page and a custom 404 — 17 URLs in the sitemap",
      "Content curated by hand: 8 services, 4 case studies, 10 gallery frames and a 12-industry pill cloud",
      "Three conversion paths — an enquiry drawer staged behind PUBLIC_INQUIRY_ENDPOINT, an optional Google Form embed, and mailto",
      "Trailing-slash canonicals and an auto-generated sitemap",
      "CI on pull requests, plus a DESIGN.md and PRODUCT.md that fix the positioning and the content rules",
      "Image optimisation through sharp at build time"
    ],
    decisions: [
      "Static Astro output over a CMS, because the content changes on a marketing cadence, not a news-feed one",
      "An enquiry drawer plus a mailto fallback, so the contact path works even before the CRM endpoint is set",
      "Proposal-stage benchmarks explicitly labelled as not-yet-realised, rather than quietly presented as traction",
      "PRODUCT.md written before the pages, which fixed who the site is for and what it must not become"
    ],
    metrics: "17 routes, 8 service lines, 4 case studies and three conversion paths",
    github: "https://github.com/Harshit-3114/Dun-DIgital", demo: null, image: null, category: "client", status: "live",
    files: [{ name: "PRODUCT.md", path: "PRODUCT.md", url: "https://github.com/Harshit-3114/Dun-DIgital", type: "md" },{ name: "DESIGN.md", path: "DESIGN.md", url: "https://github.com/Harshit-3114/Dun-DIgital", type: "md" },{ name: "index.astro", path: "src/pages/index.astro", url: "https://github.com/Harshit-3114/Dun-DIgital", type: "jsx" },{ name: "ci.yml", path: ".github/workflows/ci.yml", url: "https://github.com/Harshit-3114/Dun-DIgital", type: "yml" }]
  },
];

export const CERTIFICATIONS = [
  {
    id: 'redhat', title: "Certified Specialist in Linux Diagnostics and Troubleshooting", issuer: "Red Hat", date: "November 14, 2025", category: "certification",
    desc: "The EX342 exam is a hands-on, performance-based Linux diagnostic certification. I passed it by diagnosing live broken systems under time pressure — no multiple choice, just root cause analysis on real machines. It underpins all my containerization and DevOps work.",
    skills: ["Linux kernel diagnostics and log analysis", "Performance profiling with perf, strace, ltrace", "System crash analysis with kdump / crash utility", "Network troubleshooting: tcpdump, ss, ip", "Storage and filesystem fault isolation"],
    badge: "https://www.credly.com/badges/a4fafe7b-9071-4e1a-8a2b-15c3572d597e/public_url",
    usedIn: ["deepfake", "skillroute"], files: []
  },
  {
    id: 'openshift', title: "Red Hat OpenShift Development I (DO188)", issuer: "Red Hat", date: "November 2025", category: "certification",
    desc: "Red Hat's official containers-with-Podman certification, covering image management, container lifecycle, podman networking and the OpenShift workflow. I passed the performance-based exam, not a multiple-choice quiz — every objective had to be demonstrated on a live system.",
    skills: ["Container lifecycle and image management with Podman", "Podman networking, volumes and rootless operation", "Red Hat OpenShift application deployment workflow", "Image registry authentication and multi-container orchestration", "Troubleshooting container build and runtime failures"],
    badge: "https://www.credly.com/badges/a4fafe7b-9071-4e1a-8a2b-15c3572d597e/public_url",
    usedIn: ["saas-vm", "deepfake", "edee"], files: []
  },
  {
    id: 'practera', title: "Study Australia Industry Experience Program", issuer: "Practera / Study Australia", date: "Jan – Feb 2024", category: "certification",
    desc: "A virtual industry program run jointly with Australian universities and industry partners. Built cross-timezone collaboration skills and delivered a group project under real client constraints.",
    skills: ["Cross-functional remote collaboration", "Stakeholder communication under ambiguity", "Agile sprint delivery with international teams"],
    usedIn: ["crest"], files: []
  },
  {
    id: 'dsa-c', title: "DSA in C", issuer: "Udemy", date: "2024", category: "certification",
    desc: "Completed alongside my first year at SRMIST to solidify fundamentals in data structures and algorithm analysis using C — the language that makes complexity impossible to ignore.",
    skills: ["Arrays, linked lists, trees, graphs in C", "Sorting and searching algorithm complexity", "Dynamic memory management (malloc / free)", "Recursive and iterative problem decomposition"],
    badge: "https://www.udemy.com/certificate/UC-c7c3527b-162c-4a09-a55c-3200f6796c8c/",
    usedIn: ["skillroute", "dsfs"], files: []
  },
  {
    id: 'dbms', title: "DBMS", issuer: "Scaler Topics", date: "2024", category: "certification",
    desc: "Covers relational theory, normalization, transactions, and query optimization. Most useful when architecting Supabase schemas and writing performant SQL for InsightX.",
    skills: ["Relational schema design and normalization (1NF–3NF)", "SQL: joins, subqueries, window functions", "Transaction management: ACID, isolation levels", "Index design and query plan analysis"],
    badge: "https://moonshot.scaler.com/s/sl/wCWv1KzNt0",
    usedIn: ["insightx", "crest"], files: []
  },
  {
    id: 'os', title: "Operating Systems", issuer: "Udemy", date: "2024", category: "certification",
    desc: "Real-time OS concepts including scheduling, memory management, and interrupt handling. Context for understanding container isolation, process management, and Kubernetes internals.",
    skills: ["Process scheduling algorithms (FCFS, SJF, Round Robin)", "Memory paging and segmentation", "Semaphores, mutexes, deadlock handling", "Real-time constraints and interrupt-driven I/O"],
    badge: "https://www.udemy.com/certificate/UC-957ae760-0d1b-47d9-a2f6-ac2ca169ca61/",
    usedIn: ["deepfake", "ai-ethics"], files: []
  },
];

export const EXPERIENCE = [
  {
    id: 'canit', title: "Web Developer Intern", company: "CanIT Solutions", product: "Canit Pulse — Multi-tenant Social Media Analytics SaaS", date: "Jun 2026 – Jul 2026", category: "experience",
    desc: "Built and shipped features for a multi-tenant social media analytics SaaS used by agency teams to track campaign performance across client brands. Worked across a FastAPI backend, a Supabase data layer and a React/TypeScript frontend deployed on Render.",
    skills: ["FastAPI service development and API design", "Supabase Postgres, auth and realtime subscriptions", "React 18 + TypeScript front-end work", "Render deployment and CI/CD", "Production debugging: memory, auth and session handling"],
    highlights: [
      "Eliminated a production OOM crash on Render's free tier by architecting a path-selective raw SQL fetch layer, removing full in-memory loads of a ~19 MB JSON column.",
      "Closed a session-security gap caused by a token expiry bug (TOKEN_EXPIRE_HOURS wasn't passed into token creation) — fixed the creation path, added a missing client-detail API route, and implemented a global exception handler for structured error responses.",
      "Cut unnecessary frontend network load by resolving a re-fetch-on-tab-switch bug and JSX structural errors; shipped role-based permissions for report feedback and the spec for a new Ad Spends module."
    ],
    usedIn: [], files: []
  },
  {
    id: 'content-writing', title: "Content Writing Intern", company: "Content & Communications", product: "Editorial content production", date: "2023", category: "experience",
    desc: "Produced editorial content for client-facing publications, working to tight editorial deadlines and adapting technical subject matter for a general audience.",
    skills: ["Editorial research and long-form writing", "Copy editing and structural revision", "Fact-checking and sourcing technical claims", "Meeting editorial deadlines under revision"],
    usedIn: [], files: []
  },
];

export const ACADEMIC = [
  {
    id: 'btech-cse', title: "B.Tech Computer Science Engineering", institution: "SRMIST, Kattankulathur", date: "Aug 2023 – May 2027", category: "academic",
    desc: "Pursuing CSE Core in the Computing Technologies department.",
    highlights: ["Computing Technologies department — CSE Core branch", "Courses: Compiler Design, Software Engineering, Data Science, DevOps, Advanced Calculus", "Active in hackathon participation and peer research collaboration"],
    usedIn: [], files: [], visual: "degree"
  },
  {
    id: 'compiler-design', title: "Compiler Design", institution: "SRMIST · 18CSC304J", date: "Semester 4", category: "academic",
    desc: "Lexical analysis, parsing (LL/LR), shift-reduce parsing, LR(0) items, intermediate code generation. Lab experiments in C.",
    highlights: ["Implemented shift-reduce parser from scratch in C", "Built LR(0) item set construction and goto tables", "Intermediate code generation: three-address code", "Wrote complete lab experiment reports for all 8 experiments"],
    usedIn: ["dsfs", "insightx"], files: [{ name: "shift_reduce.c", path: "compiler-lab/exp3/shift_reduce.c", url: "https://github.com/Harshit-3114/Harshitshyamsukha.github.io/blob/main/compiler-lab/exp3/shift_reduce.c", type: "c" },{ name: "lr0_items.c", path: "compiler-lab/exp5/lr0_items.c", url: "https://github.com/Harshit-3114/Harshitshyamsukha.github.io/blob/main/compiler-lab/exp5/lr0_items.c", type: "c" },{ name: "lab_report.pdf", path: "docs/compiler_design_lab.pdf", url: "https://github.com/Harshit-3114/Harshitshyamsukha.github.io/blob/main/docs/compiler_design_lab.pdf", type: "pdf" }], visual: "compiler"
  },
  {
    id: 'data-science', title: "Data Science", institution: "SRMIST · 21CSS303T", date: "Semester 4", category: "academic",
    desc: "Statistical foundations, data wrangling, EDA, regression, classification, and model evaluation in Python.",
    highlights: ["Applied Pandas and NumPy for data cleaning pipelines", "Built regression and classification models using scikit-learn", "Exploratory data analysis with matplotlib and seaborn", "Direct foundation for DSFS data pipeline design"],
    usedIn: ["dsfs", "insightx"], files: [{ name: "eda_notebook.ipynb", path: "data-science/eda_notebook.ipynb", url: "https://github.com/Harshit-3114/Harshitshyamsukha.github.io/blob/main/data-science/eda_notebook.ipynb", type: "py" },{ name: "study_guide.html", path: "docs/data_science_notes.html", url: "https://github.com/Harshit-3114/Harshitshyamsukha.github.io/blob/main/docs/data_science_notes.html", type: "md" }], visual: "data-science"
  },
  {
    id: 'devops', title: "DevOps", institution: "SRMIST", date: "Semester 5", category: "academic",
    desc: "CI/CD pipelines, containerization, Kubernetes orchestration, monitoring. Units 3–4 covered Helm, GitOps, and observability.",
    highlights: ["Configured GitHub Actions CI/CD pipelines for automated testing", "Kubernetes deployment manifests, services, and ingress rules", "Docker multi-stage builds for production image optimization", "Helm chart templating for reproducible deployments"],
    usedIn: ["deepfake", "skillroute"], files: [{ name: "ci_pipeline.yml", path: "devops-lab/github-actions/ci.yml", url: "https://github.com/Harshit-3114/Harshitshyamsukha.github.io/blob/main/devops-lab/github-actions/ci.yml", type: "yml" },{ name: "k8s_deploy.yaml", path: "devops-lab/k8s/deployment.yaml", url: "https://github.com/Harshit-3114/Harshitshyamsukha.github.io/blob/main/devops-lab/k8s/deployment.yaml", type: "yaml" }], visual: "devops"
  },
  {
    id: 'software-engineering', title: "Software Engineering & Project Management", institution: "SRMIST · 21CSC303J", date: "Semester 4", category: "academic",
    desc: "SDLC models, requirements engineering, UML, agile sprints, risk management, and project estimation techniques.",
    highlights: ["Applied agile sprint planning across SkillRoute development", "UML class and sequence diagrams for InsightX architecture", "Risk matrix analysis for DSFS conflict data pipeline", "IEEE-format project documentation for all major projects"],
    usedIn: ["skillroute", "insightx", "dsfs"], files: [], visual: "se"
  },
  {
    id: 'research-papers', title: "Research & Academic Publications", institution: "SRMIST", date: "2024 – Ongoing", category: "academic",
    desc: "IEEE-format research papers and SRM project reports across AI/ML systems. Focus on reproducible experiments and formal evaluation.",
    highlights: ["DSFS: IEEE research paper with LTROC 0.73 benchmark", "SkillRoute: IEEE-format paper on semantic talent routing with FAISS", "LLM-IoT Bridge: B.Tech project report", "Kissan AI: multimodal crop disease detection academic report"],
    usedIn: [], files: [{ name: "DSFS_IEEE.pdf", path: "papers/dsfs_ieee.pdf", url: "/papers/dsfs.pdf", type: "pdf" },{ name: "SkillRoute_IEEE.pdf", path: "papers/skillroute_ieee.pdf", url: "https://github.com/Harshit-3114/Harshitshyamsukha.github.io/blob/main/papers/skillroute_ieee.pdf", type: "pdf" },{ name: "LLM_IoT_Report.pdf", path: "papers/llm_iot_report.pdf", url: "https://github.com/Harshit-3114/Harshitshyamsukha.github.io/blob/main/papers/llm_iot_report.pdf", type: "pdf" },{ name: "Kissan_AI.pdf", path: "papers/kissan_ai_report.pdf", url: "https://github.com/Harshit-3114/Harshitshyamsukha.github.io/blob/main/papers/kissan_ai_report.pdf", type: "pdf" }], visual: "research"
  },
];

export const GITHUB_ACTIVITY = {
  id: 'github-activity', title: "GitHub Activity", category: "activity",
  desc: "Live commit graph and recent repository activity pulled from the GitHub API.",
  date: "Updated live via GitHub API",
  stats: "github-stats"
};

export const ALL_PINS = [...PROJECTS_DETAILED, ...CERTIFICATIONS, ...EXPERIENCE, ...ACADEMIC, GITHUB_ACTIVITY];

export const CORE_PROJECTS = [
  { id: 'github-innovator', title: 'GitHub Innovator', repo: 'Github-Innovator', category: 'ai' },
  { id: 'argus', title: 'ARGUS', repo: 'ARGUS', category: 'ai' },
  { id: 'skillroute', title: 'SkillRoute', category: 'ai' },
  { id: 'ai-ethics', title: 'AI Ethics Advisor', repo: 'ai-ethics-advisor', category: 'ai' },
  { id: 'nexus-matcher', title: 'Nexus Matcher', repo: 'nexus-matcher', category: 'ai' },
  { id: 'heatwave-predictor', title: 'HeatWave Predictor', repo: 'heatwave-predictor', category: 'ai' },
  { id: 'scalar-meta', title: 'Scalar Meta', repo: 'scalar-meta', category: 'ai' },
  { id: 'dsfs', title: 'Dynamic Societal Friction Simulator', repo: 'Dynamic-Societal-Friction-Simulator', category: 'ai', githubUrl: 'https://github.com/vivek797029/Dynamic-Societal-Friction-Simulator' },
  { id: 'deepfake', title: 'DeepFake Detection', repo: 'Deepfake-Detection', category: 'fullstack' },
  { id: 'insightx', title: 'InsightX Analytics', repo: 'InsightX', category: 'fullstack' },
  { id: 'web-auditor', title: 'Web Auditor', repo: 'web-auditor', category: 'fullstack' },
  { id: 'portfolio-rebalancer', title: 'Portfolio Rebalancer', repo: 'portfolio-rebalancer', category: 'fullstack' },
  { id: 'job-agent', title: 'Job Agent', repo: 'job-agent', category: 'fullstack' },
  { id: 'trizen', title: 'Trizen', repo: 'trizen', category: 'fullstack' },
  { id: 'sdn', title: 'SDN Lab', repo: 'SDN', category: 'fullstack' },
  { id: 'cosmic-calendar', title: 'Cosmic Calendar', category: 'fullstack' },
  { id: 'finance-tracker', title: 'Finance Tracker', repo: 'Finance-tracker', category: 'fullstack' },
  { id: 'saas-vm', title: 'SaaS Vending Machine', repo: 'Saas-Vending-Machine', category: 'fullstack' },
  { id: 'edee', title: 'Edee Apply', repo: 'Edee', category: 'client' },
  { id: 'sosp', title: 'SOS Packaging', repo: 'SOSP', category: 'client' },
  { id: 'crest', title: 'Crest Automotive', category: 'client', githubUrl: 'https://github.com/concealedaaryan/carboutiqueauto' },
  { id: 'prakash-plastics', title: 'Prakash Plastics', repo: 'prakash-plastics', category: 'client' },
  { id: 'dun-digital', title: 'Dun Digital', repo: 'Dun-DIgital', category: 'client' },
];

export const PROCESS_DATA = {
  'github-innovator': {
    thinking: "The core bet: most open-source PRs are mechanically derivable, so the bottleneck is human review bandwidth, not idea generation. I built a six-stage LangGraph pipeline — discover, filter, LLM-analyze, rewrite, test, publish — where each stage is a typed node with checkpointed state. The discovery stage mines issues and PRs, the filter stage scores opportunity, the analyzer reads the target repo, the planner decomposes the change, the writer emits a diff, and the test stage runs it before anything is allowed to publish. NVIDIA NIM serves the local reasoning backbone, so a full run costs nothing per token and the whole thing is reproducible. The publish stage is gated behind a passing test run, which is the single decision that stops the agent from opening broken PRs on someone else's repository.",
    errors: [
      "Early runs produced diffs that passed the test suite but were stylistically alien to the host project — the LLM had no sense of the repo's conventions. Added a code indexer stage that builds a structural view of the target repo, plus a README generator so every fork arrives with context.",
      "The NVIDIA NIM client timed out on the larger repositories. Added per-stage timeout budgets with graceful degradation, so a slow analyse stage skips rather than aborts the whole graph.",
      "Publishing twice for the same issue produced duplicate PRs. Added a fingerprint over the analysed issue plus the target repo, and made the publisher idempotent against it.",
      "The Textual TUI froze while a run was in flight because the dashboard polled the run state on the event loop. Moved state updates onto a worker thread and made the TUI read-only during execution."
    ],
    skillsLearned: ["LangGraph multi-stage agent orchestration with checkpointed state", "NVIDIA NIM local inference integration", "Code indexing and repository-structure understanding", "Autonomous test execution as a publish gate", "Typer CLI design and Textual TUI development", "Idempotent publishing and fingerprint-based deduplication"]
  },
  'canit': {
    thinking: "Canit Pulse is a multi-tenant social media analytics SaaS: agency staff log in, see every client brand they manage, and pull campaign analytics. I worked across the whole stack — FastAPI services, a Supabase Postgres layer with auth and realtime, and a React 18 + TypeScript frontend on Render. The most valuable work was not greenfield feature work but making production behave: the OOM on Render's free tier, a session-security gap in the token path, and a frontend that refetched on every tab switch. I learned that on a small team the highest-leverage contribution is often the fix that stops a graph from spiking or a token from expiring unexpectedly.",
    errors: [
      "The service was OOM-killed on Render's free tier because a raw SQL path materialised an entire ~19 MB JSON column into memory. Replaced it with a path-selective fetch layer that only pulls the fields the request actually needs.",
      "A session-security gap came from TOKEN_EXPIRE_HOURS never being passed into the token creation call, so sessions expired far earlier than configured. Fixed the creation path and added a missing client-detail API route.",
      "The frontend re-fetched all report data every time a tab was switched. Fixed the dependency and the JSX structural errors, cutting unnecessary network load on every navigation.",
      "Some API errors surfaced as raw stack traces to the client. Implemented a global exception handler that returns structured, consistent error responses."
    ],
    skillsLearned: ["FastAPI service development and API design", "Supabase Postgres, auth and realtime subscriptions", "React 18 + TypeScript front-end engineering", "Render deployment and CI/CD pipelines", "Production memory profiling and query-path optimisation", "Auth token lifecycle and session security", "Role-based permissions and structured error handling"]
  },
  edee: {
    thinking: "Edee Apply is a college-application platform. Students sign up, search and shortlist colleges, and pay an application fee; administrators run the portal. I built the FastAPI backend for it — async SQLAlchemy 2.0 on asyncpg against PostgreSQL 16, Alembic for versioned migrations, Firebase Admin for JWT verification, and Razorpay for order creation and webhooks. The domain split is deliberate: students, colleges, shortlists and payments each own a router, so authorisation rules stay local to the domain that owns them rather than sprawling through the app. Migrations were the discipline that paid off — every schema change is a reviewable Alembic revision instead of an ad-hoc edit.",
    errors: [
      "Razorpay webhook verification initially failed in staging because the IP whitelist was missing the test server. Added conditional webhook verification per environment.",
      "Firebase JWT middleware needed to distinguish student, admin and staff roles, and the role helpers were originally scattered across routers. Centralised them into middleware so every route resolves identity the same way.",
      "Alembic autogenerate produced a migration that dropped a column on a non-empty table. Switched to explicit, hand-reviewed migrations and added a seeds script for the college catalogue."
    ],
    skillsLearned: ["Async FastAPI with SQLAlchemy 2.0 and asyncpg", "PostgreSQL 16 and Alembic migration authoring", "Firebase Admin SDK JWT verification and role resolution", "Razorpay order creation and webhook handling", "pytest and httpx AsyncClient test suites", "Docker Compose multi-service orchestration"]
  },
  sosp: {
    thinking: "SOS Packaging (Shree Om Sai Packaging) has manufactured steel cable drums, corrugated steel drums, M.S spools and process drums since 2008, supplying the cable and electrical wire industry. Their site had to speak to that buyer — a procurement manager comparing drum specifications — not to a generic SaaS audience. I chose Astro with React islands so the marketing pages ship almost no client JavaScript, and wrote a DESIGN.md capturing the industrial green and gold brand so the identity stays consistent as it grows. The brochure is generated with pdfkit, and images are converted to WebP with sharp while keeping the originals as fallback.",
    errors: [
      "The brochure PDF generator produced an enormous file because the source images were embedded at full resolution. Re-ran pdfkit through a sharp-converted WebP set, cutting the payload substantially.",
      "The hero carousel initially caused a layout shift as slides resized on load. Reserved the aspect ratio in CSS so the container never reflows.",
      "The logo carousel clipped logos of different aspect ratios. Standardised each entry to a fixed box with object-fit, so nothing is cut off regardless of source proportions."
    ],
    skillsLearned: ["Astatic islands architecture for content-led marketing sites", "React islands scoped to interactive components only", "Brand system authoring in DESIGN.md", "pdfkit brochure generation and sharp image optimisation", "Vercel Analytics and Speed Insights instrumentation"]
  },
  dsfs: {
    thinking: "Research system that ingests GDELT 2.0 events + GKG + multilingual news articles for India and produces a trust-weighted multi-signal estimate of societal friction across Indian states (2015-2025). The core innovation is learning a per-source trust weight τ_s endogenously via cross-source factual-agreement contrastive learning on MuRIL — no misinformation labels needed. Produces a cleavage-decomposed friction field F(state, week, cleavage) using trust-weighted discourse + Goldstein-weighted event intensity, and forecasts short-horizon (1/2/4-week) protest & fatality counts validated against ACLED. Runs end-to-end on Google Colab (A100/L4 for Stage A, CPU for Stage B). The 9-module pipeline handles ingest, geolocation, event clustering, factual signal extraction, trust learning, cleavage/hostility analysis (LoRA), friction aggregation, escalation forecasting, and evaluation/viz.",
    errors: [
      "First run downloads ~4 GB of GDELT + 20k-article sample — took 30 min on standard Colab runtime. Had to add caching + incremental download logic.",
      "MuRIL model on A100 was memory-intensive for contrastive learning over all source pairs. Had to implement gradient checkpointing and reduce batch size from 32 to 16.",
      "ACLED validation alignment required careful temporal bucketing — GDELT publish-time vs ACLED event-time mismatch caused initial forecast metrics to look worse than reality. Built a 2-week tolerance window alignment.",
      "LoRA fine-tuning for cleavage + hostility module initially overfit to regional language patterns. Added dropout and data augmentation via back-translation."
    ],
    skillsLearned: ["GDELT 2.0 + GKG data ingestion and parsing", "Cross-source factual-agreement contrastive learning on MuRIL", "Per-source trust weight estimation without labeled data", "LoRA fine-tuning for multilingual hostility analysis", "Goldstein-scale event intensity weighting", "ACLED event-time vs GDELT publish-time temporal alignment", "9-module research pipeline orchestration on Colab"]
  },
  skillroute: {
    thinking: "Built a Proactive Capacity Engine that detects project bottlenecks and routes internal experts using AI. The core idea was a three-component Synergy Score: semantic skill fit (60%), availability (25%), and past success (15%) — weighted to prioritize relevant, available, and proven experts. I used FAISS with all-MiniLM-L6-v2 for embedding-based skill matching, and Gemini 2.5 Flash for natural-language bottleneck descriptions. The glassmorphism UI includes an ROI Calculator showing cost-of-delay, cost-to-hire, and break-even projections. The bottleneck detection rules check for overloaded team members, approaching deadlines, and skill gaps.",
    errors: [
      "FAISS index returned stale results — wasn't rebuilding after new candidates. Added incremental indexing queue.",
      "Synergy Score initially over-weighted geospatial proximity (0.5). Adjusted to 0.25 after testing showed it unfairly penalized remote experts.",
      "Bottleneck detection had false positives during planned PTO. Added a calendar-exclusion filter."
    ],
    skillsLearned: ["FAISS (all-MiniLM-L6-v2) embedding and incremental indexing", "Three-component weighted scoring system design", "Gemini 2.5 Flash API for NL description generation", "Glassmorphism UI with ROI calculator math"]
  },
  'ai-ethics': {
    thinking: "Multi-framework ethical analysis platform using local Ollama models (phi-3-mini) so user data never touches a third-party server. Analyzes dilemmas through Utilitarian (greatest good), Deontological (duty/rules), and Virtue Ethics (character) frameworks simultaneously. Built with React 19 + Vite + Tailwind CSS + Framer Motion + Recharts frontend, and Node.js/Express + SQLite + bcrypt + JWT backend. Features risk meters, radar charts for framework comparison, activity heatmaps, three UI themes (Dark/Light/Sepia), and follow-up conversation capability. The challenge was generating genuinely distinct ethical analyses per framework rather than the model defaulting to generic advice.",
    errors: [
      "Ollama phi-3-mini defaulted to generic responses. Had to design framework-specific prompts with ground-truth philosophical principles to produce distinct analyses.",
      "Recharts radar chart data normalization was off — one framework dominated the visualization. Fixed with min-max scaling per axis.",
      "JWT token expiry was set too short (15m) causing users to lose analysis history. Extended to 24h with refresh token rotation."
    ],
    skillsLearned: ["Local Ollama serving with phi-3-mini", "Multi-framework ethical reasoning prompt engineering", "Recharts radar charts and risk meter visualization", "Node.js/Express JWT auth with refresh rotation", "Three-theme system (Dark/Light/Sepia)"]
  },
  deepfake: {
    thinking: "Multimodal deepfake detection MVP skeleton with microservice architecture. Four services: ingestion_service (file upload + validation), text_detector (BM25 + NLI for textual artifacts), image_detector (face-crop + heuristic mask analysis), and fusion_service (weighted aggregator for final verdict). Uses FastAPI per service, MinIO for S3-compatible storage, and Docker Compose for orchestration. This is a proof-of-concept scaffold — the README explicitly notes that placeholder heuristics should be replaced with real models (HuggingFace Transformers for text, EfficientNet/Xception for images, ResNet/RawNet for audio, 3D CNNs for video).",
    errors: [
      "Docker Compose health checks raced — API started before MinIO was ready. Added depends_on with condition: service_healthy.",
      "Threading-based async queue didn't scale. Switched to proper worker process queue.",
      "MinIO bucket policies were too permissive initially. Locked to per-service accounts."
    ],
    skillsLearned: ["Microservice architecture (4 FastAPI services)", "MinIO S3-compatible storage in Docker", "Multi-modal detection pipeline design (text + image + fusion)", "Docker Compose multi-service orchestration"]
  },
  insightx: {
    thinking: "AI-powered Text-to-SQL engine built with Python + Streamlit. Users ask natural language questions about transaction data, and the app generates + executes the correct SQL query using Google Gemini API, then produces a structured 4-point factual insight report (Direct Response, Statistics, Context, Recommendations) based strictly on returned data to prevent hallucination. Displays the exact generated SQL for transparency. Automatically formats monetary values to Indian Rupees (₹). Supports dark/light mode via Streamlit theming. Uses SQLite database for storage. The key design decision was the 4-point structured report format — by constraining the AI to only reason from actual query results, I eliminated the hallucination problem common in NL-to-SQL tools.",
    errors: [
      "Gemini API occasionally generated INSERT/UPDATE/DELETE queries despite the safety prompt. Added a secondary validation layer that rejects any non-SELECT query before execution.",
      "Streamlit reruns the entire script on every interaction — caused the Gemini API to be called multiple times per query. Cached the NL-to-SQL response with st.cache_data and invalidated only on new questions.",
      "Indian Rupee formatting wasn't consistent across all UI components — some tables showed raw floats while AI insights showed formatted values. Standardized with a central format_currency() function.",
      "The initial prompt didn't instruct Gemini to handle date-range questions (e.g. 'last month'). Added few-shot examples covering common temporal patterns."
    ],
    skillsLearned: ["Streamlit app development and state management", "Google Gemini API for NL-to-SQL generation", "4-point structured insight report design", "SQL safety validation and execution guardrails", "Indian Rupee formatting across UI layers"]
  },
  crest: {
    thinking: "Full-stack premium automotive services platform for a luxury car detailing studio in Gurgaon. Built with React 18 + TypeScript + Vite + Tailwind CSS v4 + R3F (3D PPF animation) + Framer Motion frontend, and FastAPI + SQLAlchemy async + asyncpg + PostgreSQL 15 backend. Three role-aware portals (Customer/Owner/Worker) from a single codebase. Features JWT + Google OAuth + phone OTP auth, Razorpay payments, Twilio WhatsApp notifications, Redis-backed token blacklist, Groq AI chatbot (llama-3.3-70b-versatile), multi-studio booking, inventory management, staff assignment lifecycle, and full OWASP API Security Top 10 hardening. The scope was massive — learned to prioritize ruthlessly. The public marketing site for the studio is the published piece.",
    errors: [
      "Razorpay webhook verification initially failed in staging — IP whitelist was missing the test server. Added conditional webhook verification per environment.",
      "PostgreSQL connection pooling under async SQLAlchemy leaked connections under load. Switched from create_async_engine to async with async_sessionmaker + connection pool limits.",
      "Twilio WhatsApp templates required Meta approval — each template took 48h. Learned to batch template submissions and maintain fallback SMS.",
      "Three portal routing via React context caused unnecessary re-renders. Memoized role context with useMemo + useCallback.",
      "PPF 3D animation (R3F) lagged on mid-range phones. Reduced polygon count and added lazy loading for the 3D scene."
    ],
    skillsLearned: ["FastAPI + SQLAlchemy async + asyncpg + PostgreSQL 15", "Razorpay payment gateway integration", "Twilio WhatsApp + SMS notification system", "Redis token blacklist and caching", "Groq AI chatbot integration (llama-3.3-70b)", "React Three Fiber 3D product visualization", "OWASP API Security Top 10 hardening", "Three-role portal architecture from single codebase"]
  },
  'cosmic-calendar': {
    thinking: "Interactive space exploration web app built for AstralWeb Innovate Hackathon 2025. React + Vite + Tailwind CSS frontend consuming NASA APOD API for daily astronomy pictures. Features a 20-question space quiz, AI astronomy chatbot powered by HuggingFace Spaces (FLAN-T5 Large via Gradio), bookmarking with localStorage, countdown timers, random cosmic facts, light/dark theme toggle, and social sharing. Deployed on Vercel. The hackathon time constraint taught me to prioritize features that demo well over perfection.",
    errors: [
      "NASA APOD API rate limit (1000 requests/day) hit during testing. Added client-side caching with localStorage TTL.",
      "Gradio chatbot endpoint had 5-second cold starts on HuggingFace free tier. Added a loading skeleton and optimistic responses for common questions.",
      "Theme toggle caused layout shift — forgot to persist preference. Fixed with localStorage + media query listener for system preference."
    ],
    skillsLearned: ["NASA APOD API consumption and caching", "HuggingFace Spaces Gradio chatbot integration", "Hackathon project scoping and demo prioritization", "localStorage-based bookmarking and preference persistence", "Vercel deployment"]
  },
  'finance-tracker': {
    thinking: "Personal finance tracking app with expense categorization, income/expense tracking, and spending visualizations. Stack: React frontend with Chart.js, Node.js/Express backend, PostgreSQL database. Features CRUD operations for transactions, category management, and monthly spending summaries. No README available — built from exploration of repo structure (database, backend, frontend directories). Deployed on Vercel.",
    errors: [
      "Chart.js re-rendered on every state change causing jank. Memoized chart data with useMemo.",
      "Category CRUD had no uniqueness constraint — duplicate categories created. Added unique constraint at DB + validation layer."
    ],
    skillsLearned: ["Chart.js integration for spending visualizations", "Express + PostgreSQL CRUD API design", "Vercel deployment for full-stack apps"]
  },
  'saas-vm': {
    thinking: "Infrastructure-as-Code platform for automated multi-tenant SaaS provisioning — NOT a vending machine management app. Uses Terraform + Kubernetes (Kind local or EKS AWS) + Ansible + shell scripts. Features: dual deployment modes (local Kind or AWS cloud), interactive Windows batch menu, isolated tenant resources (VPC, S3, IAM, RDS, ElastiCache, K8s namespaces), 4-format architecture visualization (ASCII/HTML/Markdown/Mermaid), 70+ automated tests, 3 tenant tiers (Basic/Standard/Premium), and security hardening (no hardcoded passwords, AWS Secrets Manager, pg_dump backups, auto-rollback). The name is misleading — it provisions SaaS environments, it's not itself a SaaS.",
    errors: [
      "Terraform state locking with DynamoDB failed on first apply in AWS — lacked DynamoDB create-table permissions. Added explicit IAM policy for state lock table management.",
      "Ansible playbooks assumed Ubuntu 22.04 but some AWS AMIs were 24.04 with different package names. Added OS detection and conditional package installs.",
      "Kind cluster on Windows had persistent volume mount issues — WSL2 path translation broke container volumes. Switched to hostPath mounts with WSL2-aware path rewriting.",
      "Batch menu `choice` command failed on non-English Windows locales. Replaced with set /p input parsing."
    ],
    skillsLearned: ["Terraform multi-environment infrastructure provisioning", "Kubernetes (Kind + EKS) tenant isolation with namespaces", "Ansible playbook design with OS detection", "70+ automated tests for infra-as-code", "Windows batch scripting for DevOps tooling", "3-tier SaaS resource allocation (Basic/Standard/Premium)"]
  },
  argus: {
    thinking: "ARGUS is a login gate that fuses two biometric modalities instead of trusting a password. The face branch embeds webcam frames with FaceNet512 via DeepFace and scores them by maximum cosine similarity against enrolled templates. The keystroke branch takes browser keydown/keyup timestamps, normalises them per user, and scores them with a scaled-Manhattan filter — sim = 1/(1+d). Both land in [0,1] and fuse with weights of 0.6 face and 0.4 keystroke. The reasoning behind pairing a physiological trait with a behavioural one is simple: a photograph of you cannot reproduce your typing rhythm, and an impostor who knows the passphrase cannot reproduce your face or your rhythm. The evaluation harness reports FAR, FRR, EER and AUC per modality and for the fused system, with ROC curves rendered automatically.",
    errors: [
      "The first version compared raw pixel arrays between captured and enrolled frames, so the match collapsed whenever the lighting changed. Switching to FaceNet512 embeddings and cosine similarity made the score invariant to lighting and pose.",
      "A global keystroke model performed badly because typing rhythm is personal — a fast typist looked like an impostor to a slow profile. Moved to per-user templates, where the filter only has to distinguish that user from everyone else.",
      "The fused score sat in a narrow band around the threshold, so a handful of legitimate logins were rejected after a small change in the weighting. Added the ROC and score-distribution views to see the actual separation rather than tuning the threshold blind.",
      "The admin console was initially open on the enrolment endpoint, which meant anyone could add a face. Put it behind a PIN before writing a single evaluation script."
    ],
    skillsLearned: ["FaceNet512 / DeepFace embedding and cosine-similarity matching", "Keystroke dynamics capture and per-user template modelling", "Score-level fusion with weighted modality combination", "Biometric error-rate analysis — FAR, FRR, EER and AUC", "ROC curve and score-distribution interpretation", "Flask application structure with a separate evaluation harness"]
  },
  'heatwave-predictor': {
    thinking: "HeatWave AI forecasts heat wave conditions for 22 Indian cities using a statistical seasonal model rather than a trained network. Each city's summer high is adjusted by a 12-month offset curve, a day-of-year sinusoidal trend with a secondary cosine, a latitude factor and an urban heat island approximation, with Gaussian jitter for day-to-day variation. Thresholds follow IMD practice — plains at 40 °C, coastal at 37 °C, hilly at 30 °C — and severity is set by how far the prediction departs from the city's own summer high. The whole choice of approach was about trust: a district officer can be shown the formula, and when the policy threshold changes, it can be changed in one place.",
    errors: [
      "A single global threshold produced nonsense for coastal cities, where 37 °C is ordinary and for hilly ones, where 30 °C is severe. Split the thresholds by zone, which immediately made the hot-spot list believable.",
      "The first version showed confidence as a fixed 90%, which meant nothing. Confidence is now derived from the distance between the prediction and the city's seasonal norm, bounded to 40–95%, so it actually falls when the model is extrapolating.",
      "Smoothing the seasonal curve too aggressively made May and June indistinguishable. Kept a secondary cosine term to preserve the shoulder of the curve, where the Indian summer actually peaks.",
      "Adding a city to the dataset left it missing from the dropdown until the UI was touched. Made the city list the single source of truth so a new entry appears everywhere on its own."
    ],
    skillsLearned: ["Statistical seasonal modelling with sinusoidal and offset curves", "Zone-aware threshold design following IMD practice", "Heat island and latitude adjustment as explicit, inspectable terms", "Flask API design with a dependency-free template layer", "Model honesty — separating what the model is from what it is not", "Single-source-of-truth data modelling"]
  },
  'scalar-meta': {
    thinking: "Scalar Meta is an OpenEnv benchmark environment for routing customer support tickets to the right department. It implements the Gym-style interface OpenEnv expects — reset(), state(), step(action), grader() — across three task tiers. The design decision that mattered most was the reward: fractional, at 1/len(tickets) per correct routing, rather than binary. A five-ticket task that gets three right should not read as a total failure, and with a binary reward there is no gradient to learn from. Ticket order is fixed per task so two models can be compared on exactly the same sequence.",
    errors: [
      "The hard tier was initially too easy — every ticket contained its department keyword. Rewrote the tier so 'Charged twice!' and 'I hate this, give me my money back immediately' both route to billing with different vocabulary, and 'The app keeps crashing on startup' is a tech ticket that a keyword heuristic sends to repair.",
      "The reward was all-or-nothing in the first version, which made every multi-ticket task score 0.0 regardless of how close it was. Switched to fractional reward so partial credit is visible in the signal.",
      "The done flag was raised before the grader ran, which truncated the final ticket on some runs. Fixed the lifecycle so done is raised only after the last ticket is scored.",
      "The Dockerfile pinned python:3.9-slim while the type annotations used PEP 604 unions, so the image could not even import the module. Bumped the base image to 3.11-slim."
    ],
    skillsLearned: ["Gym-style environment interface design", "Fractional reward shaping for multi-step tasks", "OpenEnv environment compatibility and openenv.yaml manifests", "Deterministic task design for cross-model comparability", "pytest suites covering reward arithmetic and state lifecycles", "OpenAI-compatible API base configuration for local model hosting"]
  },
  'nexus-matcher': {
    thinking: "Nexus matches a free-text technical problem to the nearest of 10,000 synthetic global expert profiles. Gemini 2.5 Flash distils the visitor's problem into a concrete skill statement, all-MiniLM-L6-v2 embeds it into 384 dimensions, and a flat L2 FAISS index returns the nearest profiles in milliseconds. Gemini then writes a four-point dossier — why matched, profile, pros, friction — and drafts the outreach email. The payoff of the semantic route over keyword search is the whole point: 'someone who has seen a mainframe before' shares no words with the engineer who has actually maintained one, but the encoder knows what a mainframe is.",
    errors: [
      "The FAISS index and metadata pickle were committed as 18 MB of opaque binaries with no way to rebuild them. Wrote build_index.py, which regenerates both from the source CSV, and stopped tracking the artefacts.",
      "The project README had been emptied in the repository while its content sat in a typo'd filename, 'nexus matcher readmde.md'. Moved it back to README.md.",
      "The original index could not be matched to the app's scoring, because the app converts FAISS distance into a match percentage assuming L2. Rebuilt with IndexFlatL2 to match, and verified the search returns semantically sensible results for a finance query.",
      "The first dataset attempt used a different embedding model, so vector dimensions did not line up with what the app expected at load time. Pinned all-MiniLM-L6-v2 in the builder so the index and the app cannot drift apart."
    ],
    skillsLearned: ["FAISS IndexFlatL2 design and the distance-to-percentage mapping", "Sentence-Transformers embedding pipelines with mean pooling and normalisation", "Zero-shot classification by anchor-phrase similarity", "Making generated artefacts reproducible instead of committing binaries", "Gemini prompt design for structured dossier output", "Streamlit state management and Plotly gauge visualisation"]
  },
  'web-auditor': {
    thinking: "Web Auditor crawls a site and runs 77 checks across five categories — 10 SEO, 21 UX/accessibility, 16 performance, 14 security and 3 duplicate-content — then groups every finding by the team that has to fix it. The grouping is the point. An audit that returns '78 problems' gets filed and forgotten; one that returns '3 high SEO, 1 high security, 2 for the design team' gets worked through. The tool pairs Cheerio for the source with real Chromium through puppeteer-core for what actually rendered, because the two see complementary halves of the page — LCP, CLS and console errors only exist in the browser.",
    errors: [
      "The first crawler followed every outbound link and ended up auditing the entire internet. Restricted it to internal links with a breadth-first queue, plus depth and page caps.",
      "The browser step was mandatory, so the whole tool failed on machines without Chrome. Made it optional and fell back to HTTP-only mode with a warning, which degrades the report instead of losing it.",
      "Finding titles were counted in the wrong units, so a 70-character title was reported as fine. Switched to character counts against 10–60, which is what actually determines SERP truncation.",
      "The platform-specific fix guidance was buried in a long list of findings, which made it useless. Added --platform wix to filter the report down to dashboard-fixable items, each with the exact navigation path to fix it."
    ],
    skillsLearned: ["Breadth-first web crawling with depth and page budgets", "Cheerio DOM extraction for meta, headings, links and forms", "puppeteer-core driving Chromium for Core Web Vitals and console errors", "Security header and cookie-flag auditing", "Severity and team-scoped finding taxonomies", "Graceful degradation when an optional runtime is unavailable"]
  },
  'portfolio-rebalancer': {
    thinking: "The hard constraint in Portfolio Rebalancer is that cash cannot move between accounts, because transferring from a tax-advantaged account into a taxable one is a taxable event. That single constraint drove the entire algorithm. Each account rebalances independently: aggregate the account value per asset class, compute the target dollar amount, take the delta, fund the buys from that account's own cash above its liquidity floor, settle, then distribute the buys and sells across the tickers in each class by current weight. A global optimiser could produce fewer trades, but its output would not be executable — and an unexecutable optimum is worthless.",
    errors: [
      "The first CSV parser split on newlines and stripped quotes, which silently corrupted dollar values like \"$71,469.06\" into two fields. Rewrote it as a single-pass state machine that handles quoted fields, embedded commas, escaped quotes and multi-line values.",
      "The first version assumed cash could be pooled across accounts, which produced beautiful targets and trades that could not be placed. Rebuilt the algorithm around per-account isolation.",
      "better-sqlite3 failed to install because it needs native compilation and the machine had no Visual Studio build tools. Switched to sql.js — SQLite compiled to WebAssembly — which trades memory-resident operation for a zero-toolchain install.",
      "Accounts with negligible total value produced walls of meaningless zero-value trades. Added a threshold below which an account is skipped entirely."
    ],
    skillsLearned: ["Single-pass state-machine CSV parsing for messy financial exports", "Per-account, cash-isolated portfolio optimisation", "Proportional shortfall scaling that keeps cash non-negative", "Liquidity floors as an explicit modelling concept", "sql.js / WebAssembly SQLite for zero-native-dependency persistence", "React 19 with Recharts for allocation visualisation"]
  },
  'job-agent': {
    thinking: "Job Agent automates the mechanical half of job hunting and stops exactly where judgement begins. It scrapes listings across three boards with role, location and keyword filters, an exclude list and an age cutoff; tailors your resume and cover letter per posting with an LLM; renders each to PDF through Chrome headless; and tracks every application in SQLite with a ready → applied transition. The deliberate design choice is that it never submits. auto_submit is false by default and the send is a human action, because an application is a claim about who you are and that should stay yours.",
    errors: [
      "The first scraper hammered the job boards with no delay and a fixed user agent. Added a configurable request delay between requests and rotating user agents, and documented that the terms of service of any site you point it at still apply.",
      "The LLM customiser returned resume bullets in wildly different lengths, which made the rendered PDFs look inconsistent. Constrained the output shape and applied the same print CSS to every variant.",
      "The renderer assumed Chrome was present and failed with a raw path error. Added a pdfkit fallback and a clear message when neither is available.",
      "The first version of the config file held the API key in the same JSON as the search preferences, and that file was tracked by git. Split it, and moved the personal data — resume, API key, application database — out of version control entirely."
    ],
    skillsLearned: ["Responsible job-board scraping with rate limiting and user-agent rotation", "LLM-driven resume tailoring constrained to a stable output shape", "HTML-to-PDF rendering via Chrome headless with a pdfkit fallback", "SQLite application tracking with explicit status transitions", "Separating secrets and personal data from version control", "CLI design with composable subcommands"]
  },
  trizen: {
    thinking: "Trizen is a photo-sharing platform for photography and event teams. The team uploads event photos, an admin curates them into a gallery, and the gallery is published behind a PIN-protected customer link — no customer account, because the photographer's client should not have to sign up for anything. The security model drove the design: PINs are bcrypt-hashed, each slug gets its own rate limit of 20 attempts per 10 minutes, and unpublished slugs return 404 rather than 403 so the API never confirms which galleries exist.",
    errors: [
      "The first attempt returned 403 for galleries a visitor did not have a PIN for, which confirmed the gallery existed. Changed it to 404 — a resource that does not leak its existence is worth more than a precise status code.",
      "Members could publish galleries and select photos because the authorisation check only covered the upload path. Tightened the permission model so members can upload and view, but not publish, select or delete other people's photos.",
      "The upload endpoint accepted any file type and no size cap, which made the local disk a denial-of-service target. Added an image MIME allowlist, a 10 MB default cap and a limit of 50 files per request.",
      "The project carried an Alembic pin and an alembic/ directory long after the schema moved to Base.metadata.create_all(). Removed the dead dependency — and documented the trade-off, because create_all() creates missing tables but never alters existing ones."
    ],
    skillsLearned: ["FastAPI application structure with a lifespan handler", "bcrypt PIN hashing and per-resource rate limiting", "Returning 404 instead of 403 to avoid resource-existence leaks", "Role-based permission checks across upload, curation and publish paths", "Storage abstraction over local disk and S3", "Vercel serverless deployment with a separate dependency set"]
  },
  sdn: {
    thinking: "The SDN lab is three Open vSwitches under one custom Ryu controller running a hand-written L2-learning application over OpenFlow 1.3, with six hosts on a linear topology and a Python GUI for live inspection. The point of building it was to see the things a textbook does not show: a flow table that never ages, a controller that loses a switch, MACs that move between ports. Mininet handles the emulation, Open vSwitch provides the data plane, and the controller installs flow rules instead of flooding packets.",
    errors: [
      "The first run of every lab session produced different results, because the previous run's flow tables were still installed. Added explicit state purging between runs — the single most common source of confusing results in an SDN lab.",
      "The topology came up but hosts could not reach each other, because the controller had no flood rule for unknown destinations. Added the standard L2-learning behaviour of installing a miss rule that floods and then learns from the source MAC.",
      "Addresses and MACs were hard-coded in the topology script, so two instances on the same machine collided. Switched to Mininet's automatic addressing and autoSetMacs.",
      "The GUI only worked on Windows and the launcher on Linux, which made the project awkward to demo. Added portable launchers for both platforms."
    ],
    skillsLearned: ["Mininet network emulation with auto-assigned addressing", "Open vSwitch as the data plane under OpenFlow 1.3", "Ryu controller application development", "L2 learning and flow-rule installation", "Flow-table state management between lab runs", "Python GUI tooling for live topology inspection"]
  },
  'prakash-plastics': {
    thinking: "The Prakash Plastics catalogue covers 244 SKUs across 17 categories for a manufacturer of plastic household products. The decision that shaped the project was writing DESIGN.md before any component: colour tokens, a 6-step type scale, spacing rules, component specs, motion rules, accessibility requirements and SEO structure. Every later decision could be checked against a written rule instead of re-litigated by taste. The catalogue itself is typed TypeScript, filtering runs on category, capacity and colour with URL-driven state, and PrakashAI answers product questions by proxying to Groq with the catalogue context injected server-side.",
    errors: [
      "15 of the 67 tests were failing because jsdom implements neither IntersectionObserver nor a working requestAnimationFrame, so every page render threw and the animated counters never reached their final value. Added both stubs to the test setup.",
      "The contact hook read the failure detail from result.message only. Providers are inconsistent about the field, so the detail was being swallowed behind a generic message. Now it reads either field.",
      "The live Groq API key sat in a .env file that the existing ignore rules did not cover, and the file was staged for commit. Fixed the ignore rules and added a committed .env.example.",
      "The React build failed on two TypeScript errors introduced by my own test changes — a BodyInit narrowed to string, and parameter properties under erasableSyntaxOnly. Fixed both rather than loosening the compiler."
    ],
    skillsLearned: ["Design-system authoring before implementation, in DESIGN.md", "Typed product catalogues at 244 SKUs with filter state in the URL", "Server-side catalogue context injection for a grounded chatbot", "Vitest, Testing Library and Supertest across five test layers", "jsdom environment gaps — IntersectionObserver and requestAnimationFrame", "Secret hygiene in .env handling and gitignore rules"]
  },
  'dun-digital': {
    thinking: "Dun Digital is a Chennai agency taking on brand, content, media, PR, websites and live events under a single point of contact. The site is their public front door, and it has to answer two audiences who arrive with the same question — 'can this team carry my whole brief?' — commercial decision-makers and institutional buyers. PRODUCT.md was written first to pin that down, along with the positioning, the operating context and an explicit list of what the site must not become. The build is fully static Astro: 17 routes, no accounts, no checkout, no backend, and almost no client JavaScript.",
    errors: [
      "The first draft read like a brochure and converted nothing. Rewrote around the two audiences and the proof they each need — capacity for one account, and delivery evidence for a campaign.",
      "Benchmark numbers for work that had not actually happened yet sat next to real traction with no distinction. Labelled proposal-stage benchmarks explicitly as not-yet-realised.",
      "The enquiry form had no destination configured, so it silently failed. The drawer is now staged behind PUBLIC_INQUIRY_ENDPOINT, with an optional Google Form embed and a mailto fallback as the working default.",
      "The contact form was spammed within days of going live. Added a honeypot field and moved delivery to a hosted form service so there is no server-side honeypot to bypass."
    ],
    skillsLearned: ["Product and positioning definition before UI, in PRODUCT.md", "Static Astro architecture with zero backend and minimal client JS", "Conversion-path design with staged endpoints and graceful fallbacks", "Honest labelling of projected versus realised metrics", "Two-audience information architecture for a single landing proposition", "CI, canonicals, sitemap generation and sharp image optimisation"]
  },
};

export const PIN_ICONS = {
  ai: 'ai',
  fullstack: 'fullstack',
  client: 'client',
  certification: 'certification',
  academic: 'academic',
  experience: 'flask',
  activity: 'activity',
};

export const PIN_TONES = {
  ai: 'indigo',
  fullstack: 'sage',
  client: 'clay',
  certification: 'brass',
  academic: 'wine',
  experience: 'teal',
  activity: 'slate',
};

export const getPinCategory = (cat) => {
  if (cat === 'ai') return 'AI / Research';
  if (cat === 'fullstack') return 'Full-Stack';
  if (cat === 'client') return 'Client Work';
  if (cat === 'certification') return 'Certification';
  if (cat === 'academic') return 'Academic';
  if (cat === 'experience') return 'Experience';
  if (cat === 'activity') return 'Activity';
  return cat;
};

export const TABS = [
  { key: 'about', label: 'About', short: 'About' },
  { key: 'all', label: 'All Work', short: 'Work' },
  { key: 'ai', label: 'AI / Research', short: 'AI' },
  { key: 'fullstack', label: 'Full-Stack', short: 'Full-Stack' },
  { key: 'client', label: 'Client Work', short: 'Client' },
  { key: 'credentials', label: 'Credentials', short: 'Credentials' },
  { key: 'experience', label: 'Experience', short: 'Experience' },
  { key: 'activity', label: 'Activity', short: 'Activity' },
  { key: 'process', label: 'Thinking Process', short: 'Process' },
  { key: 'contact', label: 'Contact', short: 'Contact' },
  { key: 'void', label: 'Void', short: '◆' },
];
