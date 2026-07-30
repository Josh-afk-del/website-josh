/* The Capacity Audit — four-domain constraint diagnostic.
 * Scores Physical / Mental / Emotional / Spiritual, finds the domain that is
 * capping the whole system, and returns a real first move drawn from Josh's work.
 */

const SCALE = [
  { value: 0, label: "Rarely" },
  { value: 1, label: "Sometimes" },
  { value: 2, label: "Often" },
  { value: 3, label: "Almost always" }
];

const DOMAINS = [
  {
    id: "physical",
    name: "Physical",
    rail: "var(--dom-physical)",
    intro: "Energy, recovery, strength, sleep. The base everything else runs on.",
    statements: [
      { id: "p1", text: "By the afternoon my energy is gone and I push through on stimulation, not real reserves." },
      { id: "p2", text: "Training, movement, or recovery is the first thing I drop when the week gets heavy." },
      { id: "p3", text: "I wake up unrested, or lean on caffeine and sugar to get moving." }
    ]
  },
  {
    id: "mental",
    name: "Mental",
    rail: "var(--dom-mental)",
    intro: "Attention, noise, and whether you can actually switch off.",
    statements: [
      { id: "m1", text: "My mind stays switched on. Even in downtime it keeps running, planning, replaying." },
      { id: "m2", text: "I reach for my phone or a distraction the moment there is a gap, without deciding to." },
      { id: "m3", text: "I struggle to hold attention on one thing long enough to go deep." }
    ]
  },
  {
    id: "emotional",
    name: "Emotional",
    rail: "var(--dom-emotional)",
    intro: "What you feel, what you avoid, and the pressure underneath.",
    statements: [
      { id: "e1", text: "There are feelings I have carried for a while that I have not actually faced." },
      { id: "e2", text: "Under pressure I go numb, irritable, or reactive, and only see it afterward." },
      { id: "e3", text: "I stay busy partly so I do not have to sit with what is underneath." }
    ]
  },
  {
    id: "spiritual",
    name: "Spiritual",
    rail: "var(--dom-spiritual)",
    intro: "Direction, meaning, and whether the life you built is the one you want.",
    statements: [
      { id: "s1", text: "Parts of my life run on what others expect, not on what I actually want." },
      { id: "s2", text: "I am waiting for something to happen before I start really living." },
      { id: "s3", text: "I am successful on paper, but a quiet sense that this is not it keeps returning." }
    ]
  }
];

// Foundational order used to break ties: the body is the base, direction sits on top.
const CONSTRAINT_ORDER = ["physical", "mental", "emotional", "spiritual"];

const svg = (inner) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

const ICONS = {
  physical: svg('<path d="M3 20h18"/><polyline points="4 20 9.5 8 13 14 15.5 9 20 20"/>'),
  mental: svg('<path d="M12 3v8.5"/><path d="M6.6 6.6a8 8 0 1 0 10.8 0"/>'),
  emotional: svg('<path d="M2 9c2 0 3 2.4 5 2.4S9 9 12 9s3 2.4 5 2.4S20 9 22 9"/><path d="M2 15c2 0 3 2.4 5 2.4S9 15 12 15s3 2.4 5 2.4S20 15 22 15"/>'),
  spiritual: svg('<circle cx="12" cy="12" r="9"/><polygon points="15.6 8.4 10.8 10.8 8.4 15.6 13.2 13.2"/>'),
  eye: svg('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="2.6"/>'),
  cap: svg('<path d="M3 5h18"/><path d="M12 21V10"/><path d="M8 14l4-4 4 4"/>'),
  arrow: svg('<path d="M4 12h14"/><path d="M13 6l6 6-6 6"/>'),
  warn: svg('<path d="M12 3 22 20H2Z"/><path d="M12 10v5"/><path d="M12 17.5h.01"/>')
};

const RESULTS = {
  physical: {
    headline: "Your constraint right now: the physical base.",
    summary: "Your body is setting the ceiling. When energy, recovery, and readiness run low, everything above them, focus, mood, and drive, gets taxed to compensate.",
    exec: {
      constraint: "Physical readiness is lowest",
      caps: "Focus and mood run on empty reserves",
      move: "Rebuild the base before you push it"
    },
    signals: [
      "Energy fades through the day and you run on stimulation instead of real reserves.",
      "Training and recovery are the first things dropped when the week gets heavy.",
      "You wake unrested and lean on caffeine or sugar to get moving."
    ],
    reframe: {
      reflex: "I need more discipline and willpower.",
      actual: "Willpower drawn from a depleted body is expensive and short-lived. The base has to be rebuilt before it can be pushed.",
      check: "Look at sleep, daily movement, and food before you look at motivation."
    },
    move: {
      lead: "Start with the base, not the peak. A repeatable week beats a heroic one.",
      steps: [
        "Walk 20 minutes a day, same time most days. This is the floor, not the workout.",
        "Two simple strength sessions a week: a row, a push-up, a sit-up, a squat. One of each, then two, up to six, then back down.",
        "Anchor sleep and hydration first. Whole food, less inflammation, water before coffee.",
        "Protect one recovery day with full-body stretching and slow breathing."
      ]
    },
    risk: [
      "You keep spending focus and mood to cover for a tired body, and the interest compounds.",
      "Small illnesses, niggles, and crashes start deciding your calendar for you.",
      "The work you care about gets your leftovers instead of your capacity."
    ],
    next: "Your profile names the base to rebuild first. The Off Switch guide handles the mental load that keeps you from recovering, and the full program builds all four domains as one system.",
    strongGuide: false
  },

  mental: {
    headline: "Your constraint right now: the mental switch.",
    summary: "Your mind stays switched on. Attention is fragmented and there is no real off state, so every other domain runs against a background of noise it can never quiet.",
    exec: {
      constraint: "Mental capacity is lowest",
      caps: "No recovery, because the mind never rests",
      move: "Train the off switch, ten minutes a day"
    },
    signals: [
      "Even in downtime the mind keeps running, planning, and replaying.",
      "You reach for the phone the moment there is a gap, without deciding to.",
      "Going deep on one thing for long is getting harder."
    ],
    reframe: {
      reflex: "I just need better focus apps and more control.",
      actual: "The problem is not a missing tool. It is the trained inability to switch off. Always-on is a default you were conditioned into, and it can be retrained.",
      check: "Ask whether you can sit for ten minutes with no input and let thoughts pass. That answer is the real signal."
    },
    move: {
      lead: "Train the off switch like a muscle. Ten minutes a day is enough to start.",
      steps: [
        "Pick one dependable quiet time, early morning or last thing at night, and a settled place to sit upright and alert.",
        "Start with three to five slow belly breaths to shift out of problem-solving mode.",
        "Breathe naturally. At the end of each exhale, count: one, then two, up to ten, then start again at one.",
        "When a thought carries you off, drop it without judgment and return to one. That reset is the rep."
      ]
    },
    risk: [
      "You stay in a low-grade fight-or-flight that quietly drives anxiety, poor sleep, and burnout.",
      "Decisions get made from noise instead of clarity.",
      "Rest stops working, because you are never actually off."
    ],
    next: "This is exactly what The Off Switch guide is built for. It walks through the full practice step by step, and the program builds it into a complete system.",
    strongGuide: true
  },

  emotional: {
    headline: "Your constraint right now: the emotional load.",
    summary: "There are feelings you have been carrying without facing. Unprocessed emotion does not disappear. It builds pressure and shows up as tension, reactivity, and a life spent avoiding what is underneath.",
    exec: {
      constraint: "Emotional capacity is lowest",
      caps: "Energy goes to holding pressure down",
      move: "Face it on paper: the four gates"
    },
    signals: [
      "There are feelings you have carried a while and never actually faced.",
      "Under pressure you go numb or reactive, and only notice afterward.",
      "You stay busy partly so you do not have to sit with what is underneath."
    ],
    reframe: {
      reflex: "I should just push through and stay positive.",
      actual: "Suppression is not a strategy. Avoided feelings accumulate and leak into every experience. The release valve is facing them, not outrunning them.",
      check: "Ask what you have been too busy to feel. The honest answer is the work."
    },
    move: {
      lead: "Give the pressure a release valve. Pen and paper, one honest pass through four gates.",
      steps: [
        "Isolate. Slow down and write out what is actually going on for you, in plain, real language. Get it out.",
        "Ownership. Write it down: this is mine to navigate. Not a failure, just information for the next step.",
        "Exchange. For each old pull, name its replacement. Fear to courage, doubt to belief, stalling to one small action.",
        "Practice. Use daily friction as the training ground. Triggered, tired, or drifting each points to the gate to run."
      ]
    },
    risk: [
      "The pressure keeps building until it is felt everywhere, in the body and in every relationship.",
      "Reactivity and numbness make decisions and connection harder than they should be.",
      "You mistake a full schedule for a full life, and the backlog grows."
    ],
    next: "Your profile gives you the first pass through the gates. The program goes deeper and builds the emotional work into the whole system, not a one-off.",
    strongGuide: false
  },

  spiritual: {
    headline: "Your constraint right now: alignment and direction.",
    summary: "The engine runs, but not toward something you chose. When life is built on what others expect instead of what is true for you, no amount of performance fills the gap. The system is optimizing the wrong target.",
    exec: {
      constraint: "Alignment is lowest",
      caps: "Effort points away from what you want",
      move: "Get honest about the misalignment"
    },
    signals: [
      "Parts of your life run on others' expectations more than your own wants.",
      "You are waiting for something to happen before you really start living.",
      "Successful on paper, but a quiet sense that this is not it keeps returning."
    ],
    reframe: {
      reflex: "I just need to hit the next goal, then it will feel right.",
      actual: "The most common regret at the end of life is not living true to yourself. Chasing a misaligned target faster does not close the gap. It widens it.",
      check: "Ask where your life is built on what others expect. Name the first honest answer."
    },
    move: {
      lead: "Face what has been avoided. Ten quiet minutes, pen and paper, honesty set to ten out of ten.",
      steps: [
        "Settle with a few minutes of slow breathing, then name where the primary misalignment lives: work, relationships, place, or living for others.",
        "Describe how it actually feels, physically and emotionally. Hold nothing back. No one else reads this.",
        "Trace how you got here. What choices, and why. Own it fully, without blame.",
        "Getting it onto paper moves it from a private weight into something you can see and act on."
      ]
    },
    risk: [
      "Years accumulate in a life that looks fine and quietly is not.",
      "The gap between the outside and the inside keeps widening until it is hard to ignore.",
      "You arrive at the next transition unequipped to become who you actually want to be."
    ],
    next: "Your profile is the first honest pass. The program does this work properly and rebuilds the other three domains around a direction you actually chose.",
    strongGuide: false
  }
};

const BANDS = [
  { min: 75, name: "Strong base", note: "Your system is broadly resourced. The gain now comes from your single constraint, not from working harder everywhere." },
  { min: 55, name: "Building", note: "You are functional and building. One domain is holding the others back more than the rest." },
  { min: 35, name: "Strained", note: "The system is running hot. Your constraint is taxing everything above it." },
  { min: 0, name: "Depleted", note: "Most domains are running low. Start at the base named below, not everywhere at once." }
];

// ---------------------------------------------------------------- DOM refs

const modal = document.querySelector("[data-assessment-modal]");
const assessment = document.querySelector("[data-assessment]");
const form = document.querySelector("[data-quiz-form]");
const resultView = document.querySelector("[data-result-view]");
const progressText = document.querySelector("[data-progress-text]");
const progressBar = document.querySelector("[data-progress-bar]");
const reflectionInput = document.querySelector("[data-reflection]");
const writingLabel = document.querySelector("[data-writing-label]");
const writingCount = document.querySelector("[data-writing-count]");
const writingBar = document.querySelector("[data-writing-bar]");
const writingHint = document.querySelector("[data-writing-hint]");

const STEP_LABELS = ["Physical", "Mental", "Emotional", "Spiritual", "Reflect", "You"];
const TOTAL_STEPS = 6;

const state = {
  step: 1,
  answers: {},
  reflection: "",
  contact: { firstName: "", email: "", consent: false }
};

function track(event, props) {
  if (window.posthog && typeof window.posthog.capture === "function") {
    window.posthog.capture(event, props);
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setError(key, message) {
  const el = document.querySelector(`[data-error="${key}"]`);
  if (el) el.textContent = message;
}

// ---------------------------------------------------------------- Rendering the questions

function renderScales() {
  DOMAINS.forEach((domain) => {
    const container = document.querySelector(`[data-domain="${domain.id}"]`);
    if (!container) return;
    container.innerHTML = domain.statements.map((stmt) => `
      <div class="scale-row">
        <p>${escapeHtml(stmt.text)}</p>
        <div class="scale-options" role="radiogroup" aria-label="${escapeHtml(stmt.text)}">
          ${SCALE.map((opt) => {
            const checked = state.answers[stmt.id] === opt.value;
            return `<label>
              <input type="radio" name="${stmt.id}" value="${opt.value}" ${checked ? "checked" : ""}>
              <span>${escapeHtml(opt.label)}</span>
            </label>`;
          }).join("")}
        </div>
      </div>
    `).join("");

    container.querySelectorAll("input").forEach((input) => {
      input.addEventListener("change", () => {
        state.answers[input.name] = Number(input.value);
        setError(domain.id, "");
      });
    });
  });
}

// ---------------------------------------------------------------- Scoring

function computeScores() {
  const scores = {};
  DOMAINS.forEach((domain) => {
    const strain = domain.statements.reduce((sum, s) => sum + (state.answers[s.id] || 0), 0);
    const max = domain.statements.length * 3;
    scores[domain.id] = {
      strain,
      capacity: Math.round((1 - strain / max) * 100)
    };
  });

  let constraint = CONSTRAINT_ORDER[0];
  CONSTRAINT_ORDER.forEach((id) => {
    if (scores[id].strain > scores[constraint].strain) constraint = id;
  });

  const overall = Math.round(
    DOMAINS.reduce((sum, d) => sum + scores[d.id].capacity, 0) / DOMAINS.length
  );
  const band = BANDS.find((b) => overall >= b.min) || BANDS[BANDS.length - 1];

  return { scores, constraint, overall, band };
}

// ---------------------------------------------------------------- Result HTML

function buildDomainBars(scores, constraint) {
  const rows = DOMAINS.map((domain) => {
    const s = scores[domain.id];
    const isC = domain.id === constraint;
    return `
      <div class="dbar ${isC ? "is-constraint" : ""}" style="--rail:${domain.rail}">
        <div class="dbar-label">
          <span class="dbar-name">${ICONS[domain.id]}${escapeHtml(domain.name)}</span>
          ${isC ? '<span class="dbar-chip">Your constraint</span>' : ""}
        </div>
        <div class="dbar-track"><div class="dbar-fill" data-fill="${s.capacity}"></div></div>
        <div class="dbar-val">${s.capacity}</div>
      </div>
    `;
  }).join("");

  return `
    <div class="domain-bars">
      <div class="domain-bars-head">
        <span>Your four domains</span>
        <small>Higher is more capacity. The lowest is your constraint.</small>
      </div>
      ${rows}
    </div>
  `;
}

function buildResultCore(data) {
  const { scores, constraint, overall, band } = data;
  const meta = RESULTS[constraint];

  const exec = `
    <div class="result-executive">
      <article>
        <small>Your constraint</small>
        <strong>${escapeHtml(meta.exec.constraint)}</strong>
        <p>Overall capacity ${overall} of 100 · ${escapeHtml(band.name)}</p>
      </article>
      <article>
        <small>What it caps</small>
        <strong>${escapeHtml(meta.exec.caps)}</strong>
        <p>${escapeHtml(band.note)}</p>
      </article>
      <article>
        <small>First move</small>
        <strong>${escapeHtml(meta.exec.move)}</strong>
        <p>${escapeHtml(meta.reframe.check)}</p>
      </article>
    </div>
  `;

  const flow = `
    <div class="result-flow">
      <section class="rf-section">
        <div class="rf-label">${ICONS.eye}What this looks like</div>
        <ul class="rf-points">${meta.signals.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>
      </section>
      <section class="rf-section">
        <div class="rf-label">${ICONS.cap}Why it caps everything else</div>
        <div class="rf-diagnosis">
          <article><small>First reflex</small><p>${escapeHtml(meta.reframe.reflex)}</p></article>
          <article><small>What is actually going on</small><p>${escapeHtml(meta.reframe.actual)}</p></article>
          <article><small>The check</small><p>${escapeHtml(meta.reframe.check)}</p></article>
        </div>
      </section>
      <section class="rf-move">
        <div class="rf-label">${ICONS.arrow}Your first move</div>
        <p class="rf-lead">${escapeHtml(meta.move.lead)}</p>
        <ol>${meta.move.steps.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ol>
      </section>
      <section class="rf-section">
        <div class="rf-label">${ICONS.warn}If you ignore it</div>
        <ol class="rf-numbered">${meta.risk.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ol>
      </section>
    </div>
  `;

  return `
    <div class="result-hero">
      <p class="eyebrow">Your Capacity Profile</p>
      <h3>${escapeHtml(meta.headline)}</h3>
      <p class="result-summary">${escapeHtml(meta.summary)}</p>
    </div>
    ${buildDomainBars(scores, constraint)}
    ${exec}
    ${flow}
  `;
}

function buildBridge(meta) {
  const guideCopy = meta.strongGuide
    ? "This is the exact practice inside the guide. Start it today, free."
    : "A complete, do-it-today practice for switching off the overthinking mind. Free.";
  return `
    <div class="result-bridge">
      <div class="bridge-card">
        <div>
          <p class="eyebrow">Free next step</p>
          <h4>The Off Switch</h4>
          <p>${escapeHtml(guideCopy)}</p>
        </div>
        <a class="button button-ghost" href="/off-switch">Get the guide</a>
      </div>
      <div class="bridge-card primary spirit">
        <div>
          <p class="eyebrow">Go all the way</p>
          <h4>Work with Josh</h4>
          <p>Build all four domains as one system. Bespoke one-to-one coaching for people ready to close the gap.</p>
        </div>
        <a class="button button-light" href="/coaching">See the program</a>
      </div>
    </div>
  `;
}

function buildResultHtml(data) {
  const meta = RESULTS[data.constraint];
  return `
    ${buildResultCore(data)}
    <div class="result-tools">
      <p>Keep your profile. Use it as the map for your first block of work.</p>
      <button class="button button-ghost" type="button" data-pdf-result>Save as PDF</button>
    </div>
    <p class="result-confirm"><strong>Check your inbox.</strong> Your profile and The Off Switch, a free mental training tool, are on the way. ${escapeHtml(meta.next)}</p>
    ${buildBridge(meta)}
  `;
}

// ---------------------------------------------------------------- PDF export

function openResultPdf(data) {
  const win = window.open("", "_blank");
  if (!win) return;
  const origin = window.location.origin;
  win.document.write(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Capacity Profile · Josh Roche</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="${origin}/styles.css">
        <link rel="stylesheet" href="${origin}/assets/funnel.css">
        <style>
          body { margin: 0; background: var(--paper); color: var(--ink); }
          .pdf-wrap { padding: clamp(28px, 5vw, 54px); }
          .pdf-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 26px; font-family: var(--display); font-weight: 700; text-transform: uppercase; }
          .result-tools, .result-confirm, .result-bridge { display: none !important; }
          @media print { .pdf-wrap { padding: 16mm 12mm; } }
        </style>
      </head>
      <body>
        <main class="pdf-wrap">
          <div class="pdf-brand">Josh Roche · Capacity Audit</div>
          ${buildResultCore(data)}
        </main>
        <script>
          window.addEventListener("load", function () {
            document.querySelectorAll(".dbar-fill").forEach(function (el) {
              el.style.width = el.getAttribute("data-fill") + "%";
            });
            setTimeout(function () { window.print(); }, 450);
          });
        <\/script>
      </body>
    </html>
  `);
  win.document.close();
}

// ---------------------------------------------------------------- Steps + validation

function setStep(step) {
  state.step = step;
  document.querySelectorAll(".quiz-step").forEach((section) => {
    section.classList.toggle("is-active", Number(section.dataset.step) === step);
  });
  progressText.textContent = STEP_LABELS[step - 1];
  progressBar.style.width = `${(step / TOTAL_STEPS) * 100}%`;
  modal?.scrollTo({ top: 0, behavior: "smooth" });
}

function validateStep(step) {
  if (step >= 1 && step <= 4) {
    const domain = DOMAINS[step - 1];
    const done = domain.statements.every((s) => typeof state.answers[s.id] === "number");
    if (!done) {
      setError(domain.id, "Answer all three to keep the read accurate.");
      return false;
    }
  }
  if (step === 5) {
    state.reflection = reflectionInput?.value.trim() || "";
    if (state.reflection.length < 3) {
      setError("reflection", "A line or two sharpens your result. It stays private.");
      return false;
    }
  }
  return true;
}

function validateContact() {
  const fd = new FormData(form);
  state.contact = {
    firstName: (fd.get("firstName") || "").toString().trim(),
    email: (fd.get("email") || "").toString().trim(),
    consent: fd.get("consent") === "on"
  };
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.contact.email);
  if (!state.contact.firstName || !emailOk || !state.contact.consent) {
    setError("contact", "Add your first name and a valid email, and tick the box to see your profile.");
    return false;
  }
  setError("contact", "");
  return true;
}

// ---------------------------------------------------------------- Show result

function showResult() {
  const data = computeScores();
  form.hidden = true;
  resultView.hidden = false;
  assessment?.classList.add("is-result");
  progressText.textContent = "Profile";
  progressBar.style.width = "100%";
  resultView.innerHTML = buildResultHtml(data);
  modal?.scrollTo({ top: 0, behavior: "smooth" });

  requestAnimationFrame(() => {
    resultView.querySelectorAll(".dbar-fill").forEach((el) => {
      el.style.width = el.getAttribute("data-fill") + "%";
    });
  });

  resultView.querySelector("[data-pdf-result]")?.addEventListener("click", () => openResultPdf(data));

  track("audit_result_viewed", { constraint: data.constraint, overall: data.overall });

  const lead = {
    constraint: data.constraint,
    overall: data.overall,
    band: data.band.name,
    scores: data.scores,
    reflection: state.reflection,
    contact: { ...state.contact, timestamp: new Date().toISOString() }
  };
  try { localStorage.setItem("joshCapacityAuditLead", JSON.stringify(lead)); } catch {}

  window.kitSubscribe({
    email: state.contact.email,
    firstName: state.contact.firstName,
    source: "capacity-audit"
  });
}

// ---------------------------------------------------------------- Writing meter

function updateWritingMeter() {
  if (!reflectionInput) return;
  const words = reflectionInput.value.trim().split(/\s+/).filter(Boolean).length;
  const levels = [
    { min: 0, label: "A line or two", hint: "Name what feels most out of balance right now. It stays private and sharpens the read." },
    { min: 8, label: "Good", hint: "Add what you have already tried, or what would change if this were handled." },
    { min: 20, label: "Clear", hint: "That gives a real picture. Enough to make the result specific to you." },
    { min: 35, label: "Strong", hint: "Plenty to work with. You can move on whenever you are ready." }
  ];
  const active = levels.reduce((cur, lvl) => (words >= lvl.min ? lvl : cur), levels[0]);
  if (writingLabel) writingLabel.textContent = active.label;
  if (writingCount) writingCount.textContent = String(words);
  if (writingHint) writingHint.textContent = active.hint;
  if (writingBar) writingBar.style.width = `${Math.min(words / 35, 1) * 100}%`;
}

// ---------------------------------------------------------------- Wire up

if (assessment && form) {
  renderScales();
  updateWritingMeter();
  setStep(1);

  document.querySelectorAll("[data-open-assessment]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      modal.showModal();
      document.body.classList.add("assessment-open");
      track("audit_opened");
    });
  });

  document.querySelector("[data-close-assessment]")?.addEventListener("click", () => {
    modal.close();
    document.body.classList.remove("assessment-open");
  });

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.close();
      document.body.classList.remove("assessment-open");
    }
  });

  modal?.addEventListener("close", () => document.body.classList.remove("assessment-open"));

  form.querySelectorAll("[data-next]").forEach((button) => {
    button.addEventListener("click", () => {
      if (validateStep(state.step)) setStep(Math.min(state.step + 1, TOTAL_STEPS));
    });
  });

  form.querySelectorAll("[data-prev]").forEach((button) => {
    button.addEventListener("click", () => setStep(Math.max(state.step - 1, 1)));
  });

  reflectionInput?.addEventListener("input", () => {
    setError("reflection", "");
    updateWritingMeter();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (validateContact()) {
      track("audit_submitted");
      showResult();
    }
  });
}
