const questions = [
  {
    id: 'pace',
    section: '01 / ACCELERATION',
    title: 'How does the current pace of AI development feel to you?',
    type: 'single',
    options: [
      'Too slow — I want progress to move faster',
      'About right',
      'A little faster than I am comfortable with',
      'Much faster than I am comfortable with',
      'Dangerously fast'
    ],
    theme: 'light',
    bg: 'var(--paper)',
    accent: 'var(--gold)',
    visual: 'orbits'
  },
  {
    id: 'keep-up',
    section: '01 / ACCELERATION',
    title: 'How psychologically able do you feel to keep pace with AI change?',
    type: 'slider',
    minLabel: 'I feel able to keep up',
    maxLabel: 'It feels impossible to keep up',
    start: 40,
    theme: 'light',
    bg: 'var(--mist)',
    accent: 'var(--blue)',
    visual: 'signals'
  },
  {
    id: 'future-picture',
    section: '01 / ACCELERATION',
    title: 'When you imagine life 10 years from now, how easy is it to picture AI’s role in it?',
    type: 'slider',
    minLabel: 'Easy to picture',
    maxLabel: 'Almost impossible to picture',
    start: 48,
    theme: 'dark',
    bg: 'var(--ink)',
    accent: 'var(--violet)',
    visual: 'horizon'
  },
  {
    id: 'work-changed',
    section: '02 / WORK',
    title: 'What has AI already changed in your working life?',
    type: 'multi',
    maxSelect: 5,
    hint: 'Select up to 5',
    options: [
      'I finish some tasks much faster',
      'Work I used to do is now automated',
      'More output is expected from me',
      'My role has changed',
      'I have had to learn new skills',
      'My team needs fewer people',
      'New kinds of roles have appeared',
      'Nothing meaningful has changed yet'
    ],
    theme: 'light',
    bg: 'var(--mint)',
    accent: 'var(--teal)',
    visual: 'workflow'
  },
  {
    id: 'replace-worry',
    section: '02 / WORK',
    title: 'Which worries you more?',
    type: 'duel',
    options: [
      { title: 'Being replaced by AI', desc: 'A machine becomes cheaper and better than I am.' },
      { title: 'Being replaced by someone who uses AI better than I do', desc: 'Another person becomes dramatically more capable with it.' }
    ],
    labels: ['A', 'B'],
    theme: 'dark',
    bg: 'var(--ink)',
    accent: 'var(--cyan)',
    visual: 'fork'
  },
  {
    id: 'one-day-week',
    section: '02 / WORK',
    title: 'If AI let you finish a week of work in one day, what do you think would actually happen next?',
    type: 'single',
    options: [
      'I would work far less',
      'My employer would expect far more from me',
      'My role would expand into new work',
      'The job itself would fundamentally change',
      'I genuinely do not know'
    ],
    theme: 'light',
    bg: 'var(--rose-soft)',
    accent: 'var(--pink)',
    visual: 'clock'
  },
  {
    id: 'self-worth',
    section: '03 / IDENTITY',
    title: 'If AI became better than you at most intellectual tasks, how much would that affect your sense of self-worth?',
    type: 'slider',
    minLabel: 'It would not change how I value myself',
    maxLabel: 'It would deeply shake my sense of self',
    start: 50,
    theme: 'light',
    bg: 'var(--sky)',
    accent: 'var(--blue)',
    visual: 'identity'
  },
  {
    id: 'feelings',
    section: '03 / IDENTITY',
    title: 'Which feelings are strongest when you think about increasingly powerful AI?',
    type: 'multi',
    maxSelect: 3,
    hint: 'Select up to 3',
    options: [
      'Excitement',
      'Curiosity',
      'Hope',
      'Anxiety',
      'Fear',
      'Overwhelm',
      'Optimism',
      'Powerlessness'
    ],
    theme: 'dark',
    bg: 'var(--deep-violet)',
    accent: 'var(--gold)',
    visual: 'pulse'
  },
  {
    id: 'dependency',
    section: '04 / DEPENDENCY',
    title: 'If every AI tool disappeared tomorrow, what would happen to your work or study?',
    type: 'single',
    options: [
      'I would barely notice',
      'I would be slightly less productive',
      'I would be considerably less productive',
      'Parts of my work would become difficult',
      'I would struggle to do my current role'
    ],
    theme: 'light',
    bg: 'var(--sand)',
    accent: 'var(--orange)',
    visual: 'network'
  },
  {
    id: 'agency',
    section: '05 / AGENCY',
    title: 'How much real choice do you feel you have about using AI?',
    type: 'single',
    options: [
      'A great deal of choice',
      'Quite a lot of choice',
      'Some choice, but growing pressure',
      'Very little choice',
      'Almost no real choice at all'
    ],
    theme: 'light',
    bg: 'var(--paper)',
    accent: 'var(--gold)',
    visual: 'rings'
  },
  {
    id: 'choice-vs-control',
    section: '05 / AGENCY',
    title: 'If AI could reliably tell you which personal decision would lead to the best outcome, what would matter more to you?',
    type: 'slider',
    minLabel: 'Making the best decision',
    maxLabel: 'Knowing the decision was truly mine',
    start: 52,
    theme: 'dark',
    bg: 'var(--ink)',
    accent: 'var(--teal)',
    visual: 'balance'
  },
  {
    id: 'human-boundary',
    section: '06 / HUMAN CONNECTION',
    title: 'In which of these roles would you still strongly prefer a human, even if the AI were more capable?',
    type: 'multi',
    hint: 'Select as many as apply',
    options: [
      'Doctor',
      'Therapist',
      'Teacher',
      'Manager',
      'Financial adviser',
      'Creative collaborator',
      'Romantic partner',
      'None of these — capability matters more to me'
    ],
    theme: 'light',
    bg: 'var(--mint)',
    accent: 'var(--teal)',
    visual: 'constellation'
  },
  {
    id: 'art-value',
    section: '06 / HUMAN CONNECTION',
    title: 'When it comes to art, which matters more to you?',
    type: 'duel',
    options: [
      { title: 'How it was made', desc: 'Authorship, effort and human experience matter most.' },
      { title: 'How it makes me feel', desc: 'If it moves me, the source matters less.' }
    ],
    labels: ['A', 'B'],
    theme: 'light',
    bg: 'var(--paper)',
    accent: 'var(--pink)',
    visual: 'duet'
  },
  {
    id: 'grief',
    section: '06 / HUMAN CONNECTION',
    title: 'If AI could recreate the voice and manner of someone you had lost, would you want to speak to it?',
    type: 'single',
    options: [
      'Definitely yes',
      'Probably yes',
      'I am unsure',
      'Probably not',
      'Definitely not'
    ],
    theme: 'dark',
    bg: 'var(--ink)',
    accent: 'var(--violet)',
    visual: 'memory'
  },
  {
    id: 'truth',
    section: '07 / TRUTH',
    title: 'How confident are you that you can tell whether something online is real or AI-generated?',
    type: 'slider',
    minLabel: 'Not confident at all',
    maxLabel: 'Very confident',
    start: 42,
    theme: 'dark',
    bg: 'var(--ink)',
    accent: 'var(--cyan)',
    visual: 'truth'
  },
  {
    id: 'control-worry',
    section: '08 / POWER',
    title: 'Which possibility worries you more?',
    type: 'duel',
    options: [
      { title: 'AI itself becomes too powerful', desc: 'The systems exceed our ability to understand or control them.' },
      { title: 'A small number of people control very powerful AI', desc: 'The concentration of power is the deeper risk.' }
    ],
    labels: ['A', 'B'],
    theme: 'dark',
    bg: 'var(--deep-navy)',
    accent: 'var(--gold)',
    visual: 'power'
  },
  {
    id: 'meaning',
    section: '09 / MEANING',
    title: 'If AI removed most paid work from your life, which would that future feel closer to?',
    type: 'slider',
    minLabel: 'Freedom',
    maxLabel: 'Meaninglessness',
    start: 50,
    theme: 'dark',
    bg: 'var(--ink)',
    accent: 'var(--violet)',
    visual: 'mountain'
  },
  {
    id: 'future',
    section: '10 / THE FUTURE',
    title: 'Which future would you most want to live in?',
    type: 'single',
    options: [
      'AI remains mainly a tool that supports human work',
      'Humans and powerful AI work closely side by side',
      'AI performs most work and people work far less',
      'AI becomes more capable than humans in almost every field',
      'None of these feels right to me'
    ],
    theme: 'light',
    bg: 'var(--sky)',
    accent: 'var(--blue)',
    visual: 'future'
  },
  {
    id: 'builders',
    section: '11 / YOUR VOICE',
    title: 'What do you most want the people building powerful AI to understand about being human?',
    type: 'text',
    placeholder: 'Write the one thing you would want them to hear.',
    theme: 'dark',
    bg: 'var(--ink)',
    accent: 'var(--gold)',
    visual: 'message'
  }
];

let state = {
  index: -1,
  answers: {},
  sound: false,
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

const survey = document.querySelector('#survey');
const progressFill = document.querySelector('#progressFill');
const progressLabel = document.querySelector('#progressLabel');
const progressPct = document.querySelector('#progressPct');
const navHint = document.querySelector('#navHint');
const topbar = document.querySelector('#topbar');
const announcer = document.querySelector('#announcer');
const motionBtn = document.querySelector('#motionBtn');
const soundBtn = document.querySelector('#soundBtn');
const homeBtn = document.querySelector('#homeBtn');

const visuals = {
  orbits: () => `
    <svg class="scene-svg orbit-svg" viewBox="0 0 560 420" aria-hidden="true">
      <g class="v-soft">
        <circle cx="278" cy="210" r="120" class="ring solid" />
        <circle cx="278" cy="210" r="165" class="ring dashed" />
      </g>
      <path d="M92 310c76-94 142-82 204-38 62 42 106 9 171-69" class="swoop" />
      <circle cx="204" cy="224" r="26" class="sun-dot" />
      <circle cx="202" cy="224" r="10" class="sun-core" />
      <circle cx="328" cy="120" r="9" class="orbit-dot move-orbit" />
      <circle cx="120" cy="298" r="7" class="orbit-dot" />
      <circle cx="441" cy="96" r="7" class="orbit-dot" />
      <text x="278" y="370" text-anchor="middle">CAN WE KEEP UP?</text>
    </svg>`,
  signals: () => `
    <svg class="scene-svg bars-svg" viewBox="0 0 560 420" aria-hidden="true">
      <rect x="76" y="286" width="44" height="58" rx="22" class="bar b1" />
      <rect x="150" y="242" width="44" height="102" rx="22" class="bar b2" />
      <rect x="224" y="192" width="44" height="152" rx="22" class="bar b3" />
      <rect x="298" y="142" width="44" height="202" rx="22" class="bar b4" />
      <rect x="372" y="104" width="44" height="240" rx="22" class="bar b5" />
      <path d="M74 322C170 254 244 236 328 182c44-29 92-65 122-108" class="signal-line" />
      <circle cx="452" cy="70" r="14" class="signal-dot" />
      <text x="74" y="382">KEEPING PACE</text>
      <text x="406" y="382" text-anchor="end">FALLING BEHIND</text>
    </svg>`,
  workflow: () => `
    <svg class="scene-svg workflow-svg" viewBox="0 0 560 420" aria-hidden="true">
      <rect x="78" y="76" width="140" height="78" rx="26" class="card flow-card card-a" />
      <rect x="78" y="170" width="140" height="78" rx="26" class="card flow-card card-b" />
      <rect x="78" y="264" width="140" height="78" rx="26" class="card flow-card card-c" />
      <circle cx="332" cy="210" r="94" class="core" />
      <circle cx="332" cy="210" r="54" class="core-inner" />
      <path d="M218 116h86" class="pipe p1" />
      <path d="M218 210h86" class="pipe p2" />
      <path d="M218 304h86" class="pipe p3" />
      <rect x="394" y="135" width="92" height="34" rx="17" class="tag" />
      <rect x="394" y="193" width="108" height="34" rx="17" class="tag" />
      <rect x="394" y="251" width="84" height="34" rx="17" class="tag" />
    </svg>`,
  fork: () => `
    <svg class="scene-svg fork-svg" viewBox="0 0 560 420" aria-hidden="true">
      <circle cx="280" cy="106" r="36" class="fork-node" />
      <path d="M280 142v82" class="fork-stem" />
      <path d="M280 224L140 340" class="fork-branch left-branch" />
      <path d="M280 224l140 116" class="fork-branch right-branch" />
      <circle cx="140" cy="340" r="28" class="fork-end left" />
      <circle cx="420" cy="340" r="28" class="fork-end right" />
      <text x="140" y="390" text-anchor="middle">AI</text>
      <text x="420" y="390" text-anchor="middle">AI USERS</text>
    </svg>`,
  clock: () => `
    <svg class="scene-svg clock-svg" viewBox="0 0 560 420" aria-hidden="true">
      <circle cx="280" cy="210" r="124" class="clock-face" />
      <circle cx="280" cy="210" r="166" class="clock-shadow-ring" />
      <path d="M280 210V138" class="clock-hand long" />
      <path d="M280 210l62 36" class="clock-hand short" />
      <circle cx="280" cy="210" r="11" class="clock-pin" />
      <circle cx="404" cy="146" r="12" class="accent-orb" />
      <text x="280" y="372" text-anchor="middle">TIME SAVED ≠ TIME RETURNED</text>
    </svg>`,
  identity: () => `
    <svg class="scene-svg identity-svg" viewBox="0 0 560 420" aria-hidden="true">
      <path d="M214 142c-28 0-52 25-52 56 0 69 62 124 118 160 56-36 118-91 118-160 0-31-24-56-52-56-25 0-47 16-66 38-19-22-41-38-66-38Z" class="heart-shell"/>
      <circle cx="280" cy="214" r="52" class="mind-core" />
      <circle cx="280" cy="214" r="21" class="mind-core inner" />
      <circle cx="198" cy="214" r="10" class="node" />
      <circle cx="362" cy="214" r="10" class="node" />
      <path d="M208 214h52" class="mind-link" />
      <path d="M300 214h52" class="mind-link" />
    </svg>`,
  pulse: () => `
    <svg class="scene-svg pulse-svg" viewBox="0 0 560 420" aria-hidden="true">
      <circle cx="280" cy="210" r="118" class="pulse-ring pr1" />
      <circle cx="280" cy="210" r="84" class="pulse-ring pr2" />
      <circle cx="280" cy="210" r="50" class="pulse-ring pr3" />
      <path d="M116 214h82l26-48 38 98 38-70 28 40h116" class="pulse-line" />
    </svg>`,
  network: () => `
    <svg class="scene-svg network-svg" viewBox="0 0 560 420" aria-hidden="true">
      <circle cx="162" cy="154" r="28" class="net-node n1" />
      <circle cx="278" cy="98" r="22" class="net-node n2" />
      <circle cx="400" cy="154" r="32" class="net-node n3" />
      <circle cx="194" cy="286" r="24" class="net-node n4" />
      <circle cx="344" cy="296" r="38" class="net-node n5" />
      <path d="M190 144l66-34M304 106l70 34M180 176l18 82M224 286l84 6M332 274l44-92" class="net-link" />
      <circle cx="344" cy="296" r="76" class="net-halo" />
    </svg>`,
  rings: () => `
    <svg class="scene-svg rings-svg" viewBox="0 0 560 420" aria-hidden="true">
      <circle cx="280" cy="210" r="58" class="ring-center" />
      <circle cx="280" cy="210" r="104" class="ring wide" />
      <circle cx="280" cy="210" r="152" class="ring dashed" />
      <circle cx="280" cy="210" r="8" class="ring-center-dot" />
      <circle cx="280" cy="58" r="12" class="orbit-dot move-vertical" />
      <circle cx="432" cy="210" r="12" class="orbit-dot move-horizontal" />
    </svg>`,
  balance: () => `
    <svg class="scene-svg balance-svg" viewBox="0 0 560 420" aria-hidden="true">
      <path d="M280 92v204" class="balance-post" />
      <path d="M168 136h224" class="balance-beam" />
      <path d="M210 136l-34 74" class="balance-wire" />
      <path d="M350 136l34 74" class="balance-wire" />
      <path d="M176 210h68" class="balance-pan" />
      <path d="M316 210h68" class="balance-pan" />
      <circle cx="210" cy="210" r="36" class="balance-disc left" />
      <circle cx="350" cy="210" r="36" class="balance-disc right" />
      <text x="210" y="216" text-anchor="middle">BEST</text>
      <text x="350" y="216" text-anchor="middle">MINE</text>
    </svg>`,
  constellation: () => `
    <svg class="scene-svg constellation-svg" viewBox="0 0 560 420" aria-hidden="true">
      <circle cx="130" cy="122" r="10" class="star" />
      <circle cx="212" cy="82" r="8" class="star" />
      <circle cx="308" cy="134" r="12" class="star" />
      <circle cx="394" cy="98" r="10" class="star" />
      <circle cx="438" cy="202" r="8" class="star" />
      <circle cx="338" cy="274" r="12" class="star" />
      <circle cx="222" cy="312" r="10" class="star" />
      <circle cx="126" cy="260" r="8" class="star" />
      <path d="M130 122l82-40 96 52 86-36 44 104-100 72-116 38-96-52z" class="constellation-line" />
      <circle cx="280" cy="198" r="120" class="constellation-ring" />
    </svg>`,
  duet: () => `
    <svg class="scene-svg duet-svg" viewBox="0 0 560 420" aria-hidden="true">
      <path d="M156 260c0-60 48-108 108-108 50 0 82 32 108 70 14 21 36 38 70 38 0-61-49-110-110-110-43 0-77 18-108 52-31-34-65-52-108-52-61 0-110 49-110 110 34 0 56-17 70-38 26-38 58-70 108-70Z" class="duet-shape" />
      <circle cx="214" cy="194" r="20" class="duet-node" />
      <circle cx="346" cy="194" r="20" class="duet-node" />
      <path d="M214 194h132" class="duet-link" />
    </svg>`,
  memory: () => `
    <svg class="scene-svg memory-svg" viewBox="0 0 560 420" aria-hidden="true">
      <circle cx="226" cy="208" r="94" class="memory-orb left" />
      <circle cx="334" cy="208" r="94" class="memory-orb right" />
      <circle cx="226" cy="208" r="36" class="memory-core" />
      <circle cx="334" cy="208" r="36" class="memory-core" />
      <path d="M250 208h60" class="memory-link" />
      <circle cx="280" cy="120" r="10" class="memory-spark" />
      <circle cx="396" cy="298" r="8" class="memory-spark" />
      <circle cx="160" cy="298" r="8" class="memory-spark" />
    </svg>`,
  truth: () => `
    <svg class="scene-svg truth-svg" viewBox="0 0 560 420" aria-hidden="true">
      <rect x="102" y="84" width="356" height="252" rx="34" class="screen-frame" />
      <path d="M280 100v220" class="truth-split" />
      <path d="M138 164c44-34 94-41 142-8" class="truth-mark left" />
      <path d="M280 156c48-32 98-25 142 10" class="truth-mark right" />
      <path d="M158 256c36 20 70 20 102 0" class="truth-mark left" />
      <path d="M300 256c36 20 70 20 102 0" class="truth-mark right" />
      <rect x="122" y="106" width="316" height="208" rx="24" class="scan" />
    </svg>`,
  power: () => `
    <svg class="scene-svg power-svg" viewBox="0 0 560 420" aria-hidden="true">
      <circle cx="280" cy="210" r="110" class="power-ring" />
      <circle cx="280" cy="210" r="62" class="power-core" />
      <path d="M280 100v-36M280 356v-36M170 210h-36M426 210h-36M202 132l-26-26M384 314l-26-26M384 106l-26 26M202 288l-26 26" class="power-ray" />
      <circle cx="280" cy="210" r="10" class="power-node" />
    </svg>`,
  mountain: () => `
    <svg class="scene-svg mountain-svg" viewBox="0 0 560 420" aria-hidden="true">
      <path d="M104 316l110-150 70 90 52-68 120 128" class="mountain-line" />
      <path d="M144 316c40-68 74-126 74-126s34 58 76 126" class="mountain-fill left" />
      <path d="M268 316c28-47 68-104 68-104s40 57 82 104" class="mountain-fill right" />
      <path d="M194 194h66" class="trail left" />
      <path d="M330 214h66" class="trail right" />
      <circle cx="194" cy="194" r="8" class="trail-dot" />
      <circle cx="396" cy="214" r="8" class="trail-dot" />
    </svg>`,
  future: () => `
    <svg class="scene-svg future-svg" viewBox="0 0 560 420" aria-hidden="true">
      <circle cx="280" cy="132" r="74" class="future-sun" />
      <circle cx="280" cy="132" r="122" class="future-halo" />
      <path d="M128 350c44-80 92-130 152-130s108 50 152 130" class="future-arc" />
      <path d="M244 218L156 350" class="future-road left" />
      <path d="M316 218l88 132" class="future-road right" />
      <path d="M280 218v132" class="future-road center" />
    </svg>`,
  message: () => `
    <svg class="scene-svg message-svg" viewBox="0 0 560 420" aria-hidden="true">
      <rect x="112" y="90" width="336" height="206" rx="32" class="message-box" />
      <path d="M222 296l-18 40 52-40" class="message-tail" />
      <path d="M160 150h238M160 190h198M160 230h142" class="message-line" />
      <circle cx="410" cy="120" r="13" class="message-dot" />
    </svg>`
};

function announce(text) {
  announcer.textContent = '';
  requestAnimationFrame(() => { announcer.textContent = text; });
}

function beep() {
  if (!state.sound) return;
  const A = window.AudioContext || window.webkitAudioContext;
  if (!A) return;
  const ctx = beep.ctx || (beep.ctx = new A());
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 540;
  gain.gain.setValueAtTime(0.02, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.09);
}

function getQuestionCount() {
  return questions.length;
}

function setProgress() {
  if (state.index < 0) {
    progressLabel.textContent = 'INTRO';
    progressPct.textContent = '0%';
    progressFill.style.width = '0%';
    return;
  }
  const pct = Math.round(((state.index + 1) / getQuestionCount()) * 100);
  progressLabel.textContent = questions[state.index].section;
  progressPct.textContent = `${pct}%`;
  progressFill.style.width = `${pct}%`;
}

function setTopbarTone(theme) {
  topbar.classList.remove('tone-dark', 'tone-light');
  topbar.classList.add(theme === 'dark' ? 'tone-dark' : 'tone-light');
}

function bodyClass(theme) {
  document.body.classList.toggle('theme-dark-ui', theme === 'dark');
}

function renderIntro() {
  state.index = -1;
  setTopbarTone('dark');
  bodyClass('dark');
  setProgress();
  navHint.style.opacity = '.55';
  survey.innerHTML = `
    <section class="scene scene-dark intro-scene scene-enter" style="background: linear-gradient(180deg, #071225 0%, #091934 100%); --accent: var(--gold);">
      <div class="scene-noise"></div>
      <div class="scene-inner intro-inner">
        <div class="copy intro-copy">
          <p class="eyebrow">THE WORLD AI SURVEY</p>
          <h1>How does it feel to live through<br><span>the age of accelerating intelligence?</span></h1>
          <p class="lede">A high-quality interactive survey exploring work, identity, trust, agency, relationships, meaning and the future people actually want.</p>
          <div class="intro-pills">
            <span>18 questions</span>
            <span>~ 7 minutes</span>
            <span>Anonymous prototype</span>
          </div>
          <button class="next-btn hero-btn" id="startBtn">BEGIN THE SURVEY <span>→</span></button>
        </div>
        <div class="visual hero-visual">${visuals.orbits()}</div>
      </div>
    </section>`;
  document.querySelector('#startBtn').onclick = () => {
    beep();
    state.index = 0;
    renderQuestion();
  };
  announce('Survey introduction');
}

function answerUI(q) {
  const saved = state.answers[q.id];
  if (q.type === 'single') {
    return `
      <div class="answers ${q.options.length > 5 ? 'answers-tight' : ''}">
        ${q.options.map((o, i) => `
          <button class="choice-card ${saved === o ? 'selected' : ''}" type="button" data-option="${i}">
            <span class="choice-label">${o}</span>
            <span class="choice-check" aria-hidden="true"></span>
          </button>`).join('')}
      </div>`;
  }
  if (q.type === 'multi') {
    const selected = Array.isArray(saved) ? saved : [];
    return `
      ${q.hint ? `<p class="control-hint" id="hint-${q.id}">${q.hint}</p>` : ''}
      <div class="answers ${q.options.length > 6 ? 'answers-2col' : ''}">
        ${q.options.map((o, i) => `
          <button class="choice-card choice-card-multi ${selected.includes(o) ? 'selected' : ''}" type="button" data-option="${i}" aria-describedby="${q.hint ? `hint-${q.id}` : ''}">
            <span class="choice-label">${o}</span>
            <span class="choice-check" aria-hidden="true"></span>
          </button>`).join('')}
      </div>`;
  }
  if (q.type === 'duel') {
    return `
      <div class="duel-grid">
        ${q.options.map((o, i) => `
          <button class="duel-card ${saved === i ? 'selected' : ''}" type="button" data-duel="${i}">
            <span class="duel-badge">${q.labels?.[i] || String.fromCharCode(65 + i)}</span>
            <span class="duel-title">${o.title}</span>
            <span class="duel-desc">${o.desc}</span>
          </button>`).join('')}
      </div>`;
  }
  if (q.type === 'slider') {
    const value = saved ?? q.start ?? 50;
    return `
      <div class="slider-wrap">
        <div class="slider-value"><span id="value-${q.id}">${value}</span></div>
        <input class="mega-slider" type="range" min="0" max="100" step="1" value="${value}" data-slider="${q.id}" aria-label="${q.title}">
        <div class="slider-labels">
          <span class="slider-end left">${q.minLabel}</span>
          <span class="slider-end right">${q.maxLabel}</span>
        </div>
      </div>`;
  }
  if (q.type === 'text') {
    return `
      <div class="text-wrap">
        <textarea class="text-answer" id="textAnswer" placeholder="${q.placeholder}" rows="7">${saved || ''}</textarea>
      </div>`;
  }
  return '';
}

function canContinue(q) {
  const a = state.answers[q.id];
  if (q.type === 'text') return typeof a === 'string' && a.trim().length > 0;
  if (q.type === 'multi') return Array.isArray(a) && a.length > 0;
  return a !== undefined && a !== null;
}

function renderQuestion() {
  const q = questions[state.index];
  setTopbarTone(q.theme === 'dark' ? 'dark' : 'light');
  bodyClass(q.theme === 'dark' ? 'dark' : 'light');
  setProgress();
  const total = getQuestionCount();
  survey.innerHTML = `
    <section class="scene ${q.theme === 'dark' ? 'scene-dark' : ''} scene-enter" style="background:${q.bg}; --accent:${q.accent};">
      <div class="scene-grid"></div>
      <div class="scene-inner">
        <div class="copy">
          <div class="scene-meta">
            <p class="eyebrow">QUESTION ${state.index + 1} / ${total}</p>
            <p class="eyebrow section-name">${q.section}</p>
          </div>
          <h2>${q.title}</h2>
          ${answerUI(q)}
          <div class="answer-actions">
            <button class="next-btn" id="nextBtn" type="button" ${canContinue(q) ? '' : 'disabled'}>${state.index === total - 1 ? 'SEE MY SNAPSHOT' : 'CONTINUE'} <span>→</span></button>
            ${state.index > 0 ? `<button class="back-btn" id="backBtn" type="button">← Back</button>` : ''}
          </div>
        </div>
        <div class="visual">${visuals[q.visual] ? visuals[q.visual]() : visuals.orbits()}</div>
      </div>
    </section>`;
  wireQuestion(q);
  announce(`Question ${state.index + 1}: ${q.title}`);
}

function refreshContinue(q) {
  const btn = document.querySelector('#nextBtn');
  if (!btn) return;
  btn.disabled = !canContinue(q);
}

function toggleOptionButton(btn, on) {
  btn.classList.toggle('selected', on);
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
}

function wireQuestion(q) {
  const nextBtn = document.querySelector('#nextBtn');
  const backBtn = document.querySelector('#backBtn');

  document.querySelectorAll('[data-option]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = q.options[Number(btn.dataset.option)];
      beep();
      if (q.type === 'single') {
        state.answers[q.id] = value;
        document.querySelectorAll('[data-option]').forEach((b) => toggleOptionButton(b, b === btn));
      } else {
        const current = Array.isArray(state.answers[q.id]) ? [...state.answers[q.id]] : [];
        const exists = current.includes(value);
        const nextValues = exists ? current.filter((x) => x !== value) : [...current, value];
        if (!exists && q.maxSelect && nextValues.length > q.maxSelect) {
          announce(`You can select up to ${q.maxSelect}`);
          btn.classList.add('shake');
          setTimeout(() => btn.classList.remove('shake'), 320);
          return;
        }
        state.answers[q.id] = nextValues;
        toggleOptionButton(btn, !exists);
      }
      refreshContinue(q);
    });
  });

  document.querySelectorAll('[data-duel]').forEach((btn) => {
    btn.addEventListener('click', () => {
      beep();
      const choice = Number(btn.dataset.duel);
      state.answers[q.id] = choice;
      document.querySelectorAll('[data-duel]').forEach((b) => {
        b.classList.toggle('selected', b === btn);
      });
      refreshContinue(q);
    });
  });

  const slider = document.querySelector('[data-slider]');
  if (slider) {
    const valueEl = document.querySelector(`#value-${q.id}`);
    const setSliderPaint = (value) => {
      slider.style.setProperty('--value', `${value}%`);
      if (valueEl) valueEl.textContent = value;
    };
    setSliderPaint(slider.value);
    slider.addEventListener('input', () => {
      state.answers[q.id] = Number(slider.value);
      setSliderPaint(slider.value);
      refreshContinue(q);
    });
    if (state.answers[q.id] === undefined) state.answers[q.id] = Number(slider.value);
  }

  const ta = document.querySelector('#textAnswer');
  if (ta) {
    ta.addEventListener('input', () => {
      state.answers[q.id] = ta.value;
      refreshContinue(q);
    });
  }

  nextBtn.addEventListener('click', () => {
    if (!canContinue(q)) return;
    next();
  });
  if (backBtn) backBtn.addEventListener('click', prev);
}

function next() {
  beep();
  if (state.index < questions.length - 1) {
    state.index += 1;
    renderQuestion();
  } else {
    renderResults();
  }
}

function prev() {
  beep();
  if (state.index <= 0) return;
  state.index -= 1;
  renderQuestion();
}

function clamp01(v) {
  return Math.max(0, Math.min(100, Math.round(v)));
}

function scoreFromAnswers() {
  const acceleration = clamp01(((state.answers['keep-up'] ?? 50) + ((state.answers.pace || '').includes('Dangerously') ? 28 : (state.answers.pace || '').includes('Much faster') ? 20 : (state.answers.pace || '').includes('little faster') ? 12 : 4)));
  const feelings = Array.isArray(state.answers.feelings) ? state.answers.feelings : [];
  const unease = clamp01((state.answers['self-worth'] ?? 50) * 0.45 + (feelings.some((x) => ['Anxiety', 'Fear', 'Overwhelm', 'Powerlessness'].includes(x)) ? 26 : 10));
  const agency = clamp01(100 - (state.answers['choice-vs-control'] ?? 50));
  const humanBoundary = clamp01(((Array.isArray(state.answers['human-boundary']) ? state.answers['human-boundary'].length : 0) / 8) * 100);
  return { acceleration, unease, agency, humanBoundary };
}

function renderResults() {
  const s = scoreFromAnswers();
  progressLabel.textContent = 'COMPLETE';
  progressPct.textContent = '100%';
  progressFill.style.width = '100%';
  setTopbarTone('dark');
  bodyClass('dark');
  navHint.style.opacity = '0';
  survey.innerHTML = `
    <section class="scene scene-dark scene-enter" style="background: linear-gradient(180deg, #071225 0%, #0a1d3f 100%); --accent: var(--gold);">
      <div class="scene-noise"></div>
      <div class="scene-inner results-inner">
        <div class="copy">
          <p class="eyebrow">YOUR HUMAN / AI SNAPSHOT</p>
          <h2>You are not one simple opinion about AI.</h2>
          <p class="lede">These are not scientific diagnoses. They show the tensions your answers pulled toward most strongly.</p>
          <div class="result-grid">
            <div class="result-card"><span>Acceleration pressure</span><strong>${s.acceleration}</strong></div>
            <div class="result-card"><span>AI unease</span><strong>${s.unease}</strong></div>
            <div class="result-card"><span>Personal agency</span><strong>${s.agency}</strong></div>
            <div class="result-card"><span>Human boundary</span><strong>${s.humanBoundary}</strong></div>
          </div>
          <div class="answer-actions result-actions">
            <button class="next-btn" id="restartBtn" type="button">RETAKE THE SURVEY <span>↻</span></button>
            <button class="back-btn" id="exportBtn" type="button">Download my responses</button>
          </div>
        </div>
        <div class="visual">${visuals.future()}</div>
      </div>
    </section>`;
  document.querySelector('#restartBtn').addEventListener('click', () => {
    state.answers = {};
    renderIntro();
  });
  document.querySelector('#exportBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ created: new Date().toISOString(), responses: state.answers }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'human-ai-survey-response.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });
  announce('Survey complete. Your snapshot is ready.');
}

homeBtn.addEventListener('click', () => renderIntro());

soundBtn.addEventListener('click', (e) => {
  state.sound = !state.sound;
  e.currentTarget.textContent = state.sound ? 'SOUND ON' : 'SOUND OFF';
  e.currentTarget.setAttribute('aria-pressed', String(state.sound));
  beep();
});

motionBtn.addEventListener('click', (e) => {
  state.reduceMotion = !state.reduceMotion;
  document.body.classList.toggle('reduce-motion', state.reduceMotion);
  e.currentTarget.textContent = state.reduceMotion ? 'MOTION OFF' : 'MOTION ON';
  e.currentTarget.setAttribute('aria-pressed', String(state.reduceMotion));
  announce(state.reduceMotion ? 'Reduced motion enabled' : 'Motion enabled');
});

if (state.reduceMotion) {
  document.body.classList.add('reduce-motion');
  motionBtn.textContent = 'MOTION OFF';
  motionBtn.setAttribute('aria-pressed', 'true');
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && state.index > 0) prev();
  if (e.key === 'Enter' && state.index >= 0) {
    const q = questions[state.index];
    if (q && canContinue(q)) next();
  }
});

renderIntro();
