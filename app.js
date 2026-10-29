(() => {
  'use strict';
  const M = window.SurveyModel;
  const Art = window.SurveyArt;
  const main = document.querySelector('#survey');
  const announcer = document.querySelector('#announcer');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const state = { mode: 'intro', currentId: null, answers: {}, reduced: motionPreference.matches, manualMotion: false, startedAt: Date.now(), receipt: null, contributed: false, submissionAttempted: false };
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
  const announce = message => { announcer.textContent = message; };
  const figure = (art, label = 'An illustrated fieldnote') => `<figure class="figure"><div class="figure-top"><span>HUMAN OBSERVATIONS</span><span aria-hidden="true">↗</span></div><div class="art-stage">${Art.render(art)}</div><figcaption><span class="figure-number">${escape(label)}</span><em>${escape(Art.caption(art))}</em></figcaption></figure>`;
  function focusTitle() {
    requestAnimationFrame(() => { main.querySelector('h1, h2')?.focus({ preventScroll: true }); });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function resetContribution() { state.startedAt=Date.now();state.receipt=null;state.contributed=false;state.submissionAttempted=false; }
  function progress() {
    document.body.dataset.theme='dark';
    const path = M.route(state.answers);
    const index = path.findIndex(q => q.id === state.currentId);
    const done = path.filter(q => M.hasAnswer(q, state.answers[q.id])).length;
    const pct = state.mode === 'results' ? 100 : state.mode === 'intro' ? 0 : Math.min(99, Math.round(done / path.length * 100));
    document.querySelector('#progressLabel').textContent = state.mode === 'intro' ? 'A survey of being human' : state.mode === 'results' ? 'Your personal results' : M.byId[state.currentId].chapter;
    document.querySelector('#progressCount').textContent = state.mode === 'intro' ? 'SURVEY 01' : state.mode === 'results' ? 'COMPLETE' : `${index + 1} / ${path.length}`;
    document.querySelector('#progressFill').style.width = `${pct}%`;
    document.querySelector('#progress').setAttribute('aria-valuenow', pct);
    document.querySelector('#progress').setAttribute('aria-valuetext', state.mode === 'question' ? `Question ${index + 1} of ${path.length} on your current route` : `${pct}%`);
    document.querySelector('#footerHint').textContent = state.mode === 'question' ? 'Enter to continue · Esc to go back' : 'Choose to contribute at the end.';
  }
  function intro(focus = false) {
    state.mode = 'intro';
    const saved = Object.keys(state.answers).length > 0;
    main.innerHTML = `<section class="scene intro-scene"><div class="intro-copy"><p class="eyebrow"><span class="small-star" aria-hidden="true">✳</span> THE WORLD AI SURVEY</p><h1 tabindex="-1">How does life with AI <em>really feel to you?</em></h1><p class="intro-lede">Excited, uncertain, or somewhere in between: you don’t have to make sense of change alone.</p><p class="intro-description">This first survey explores how AI is changing our lives. Take a moment to reflect on work, identity, relationships and the future. If you choose to share your answers, you’ll help build a picture of how people really feel.</p><div class="intro-actions"><button class="primary" id="startBtn">${saved ? 'Continue your route' : 'BEGIN THE SURVEY'} <span aria-hidden="true">↗</span></button>${saved ? '<button class="text-button" id="freshBtn">Start fresh</button>' : '<span class="time-note">About 8–10 minutes<br>Take it at your own pace.</span>'}</div><div class="intro-notes"><span>01 &nbsp; A route shaped by you</span><span>02 &nbsp; Your own personal fieldnotes</span><span>03 &nbsp; Share only when you choose</span></div></div>${figure('tea', 'A shared human experience / 01')}</section>`;
    document.querySelector('#startBtn').addEventListener('click', () => {
      if(!saved) state.startedAt=Date.now();
      const first = M.route(state.answers).find(q => !M.hasAnswer(q, state.answers[q.id]));
      if (saved && !first) return finish();
      state.currentId = saved && M.route(state.answers).some(q => q.id === state.currentId) ? state.currentId : (first || M.questions[0]).id;
      question();
    });
    document.querySelector('#freshBtn')?.addEventListener('click', () => { state.answers = {}; resetContribution(); state.currentId = M.questions[0].id; question(); });
    progress();
    if (focus) focusTitle();
  }
  function instruction(q) {
    if (q.type === 'multi') return q.max ? `Choose up to ${q.max}` : 'Choose as many as apply';
    if (q.type === 'duel') return 'Choose the one closer to how you feel';
    if (q.type === 'slider') return 'Find your place on the spectrum';
    if (q.type === 'text') return 'Your words. As much or as little as you like.';
    return 'Choose one';
  }
  function controls(q) {
    const answer = state.answers[q.id];
    if (q.type === 'slider') {
      const value = typeof answer === 'number' ? answer : 50;
      return `<div class="spectrum" style="--value:${value}%"><div class="spectrum-head"><span>YOUR POSITION</span><output id="sliderValue" for="answerSlider">${value}<small> / 100</small></output></div><input id="answerSlider" type="range" min="0" max="100" step="1" value="${value}" aria-labelledby="questionTitle" aria-describedby="sliderEnds"><div class="spectrum-ends" id="sliderEnds"><span><b>0</b>${escape(q.left)}</span><span><b>100</b>${escape(q.right)}</span></div><div class="spectrum-tools"><button class="nudge" id="minusBtn" aria-label="Decrease by ten">−</button><button class="text-button middle-button" id="middleBtn">${typeof answer === 'number' ? 'Set to the middle' : 'Choose the middle'}</button><button class="nudge" id="plusBtn" aria-label="Increase by ten">+</button></div></div>`;
    }
    if (q.type === 'text') return `<textarea id="textAnswer" aria-labelledby="questionTitle" maxlength="4000" placeholder="${escape(q.placeholder)}">${escape(answer)}</textarea><div class="text-count"><span>A thought, a feeling, a message.</span><span id="textCount">${typeof answer === 'string' ? answer.length : 0} / 4000</span></div>`;
    const multi = q.type === 'multi';
    const duel = q.type === 'duel';
    return `<div class="choices ${multi ? 'choice-grid' : ''} ${duel ? 'duel-grid' : ''}" role="${multi ? 'group' : 'radiogroup'}" aria-labelledby="questionTitle" aria-describedby="answerInstruction">${q.options.map((option, index) => {
      const selected = multi ? (answer || []).includes(option.value) : answer === option.value;
      const tab = multi || selected || (!answer && index === 0) ? 0 : -1;
      return `<button class="choice ${duel ? 'duel-choice' : ''} ${(q.exclusive || []).includes(option.value) ? 'choice-wide' : ''}" type="button" role="${multi ? 'checkbox' : 'radio'}" aria-checked="${selected}" tabindex="${tab}" data-value="${escape(option.value)}">${duel ? `<span class="duel-top"><span class="choice-letter">${index ? 'B' : 'A'}</span><span class="selection-mark" aria-hidden="true">✓</span></span><span class="choice-text">${escape(option.label)}</span>` : `<span class="choice-text">${escape(option.label)}</span><span class="selection-mark" aria-hidden="true">✓</span>`}</button>`;
    }).join('')}</div>`;
  }
  function question() {
    state.mode = 'question';
    state.answers = M.reconcile(state.answers);
    const path = M.route(state.answers);
    const q = M.byId[state.currentId];
    const index = path.findIndex(item => item.id === q.id);
    main.innerHTML = `<section class="scene question-scene" data-question-id="${q.id}"><div class="question-copy"><div class="question-meta"><p class="eyebrow">${escape(q.chapter)}</p><span class="question-number">${String(index + 1).padStart(2, '0')}</span></div>${q.branch ? `<p class="branch-note"><span aria-hidden="true">↳</span> ${escape(q.branch)}</p>` : ''}<h2 id="questionTitle" tabindex="-1">${escape(q.title)}</h2><div class="answer-instruction" id="answerInstruction"><span>${instruction(q)}</span>${q.optional ? '<span class="optional-note">OPTIONAL</span>' : q.type === 'multi' ? '<span id="selectionCount">0 selected</span>' : ''}</div><div class="answer-area">${controls(q)}</div><p class="answer-note" id="answerNote" aria-live="polite"></p><div class="question-actions"><button class="back-button" id="backBtn" aria-label="Previous question"><span aria-hidden="true">←</span> Back</button><div class="next-actions">${q.optional ? `<button class="text-button skip-button" id="skipBtn">${q.type === 'text' ? 'Skip this reflection' : 'Skip this question'}</button>` : ''}<button class="primary" id="nextBtn">${index === path.length - 1 ? 'See my results' : 'Continue'} <span aria-hidden="true">→</span></button></div></div></div>${figure(q.art, `Fieldnote / ${String(index + 1).padStart(2, '0')}`)}</section>`;
    const group = main.querySelector('.choices');
    group?.addEventListener('click', event => {
      const button = event.target.closest('[data-value]');
      if (!button) return;
      if (q.type === 'multi') {
        const selection = M.selectMulti(q, state.answers[q.id], button.dataset.value);
        if (selection.limited) {
          document.querySelector('#answerNote').textContent = `You’ve chosen ${q.max}. Deselect one to choose another.`;
          announce(`Choose up to ${q.max}. Deselect an answer first.`);
          return;
        }
        state.answers[q.id] = selection.values;
      } else state.answers[q.id] = button.dataset.value;
      state.answers = M.reconcile(state.answers);
      paint(q);
    });
    if (group && q.type !== 'multi') group.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const buttons = [...group.querySelectorAll('[data-value]')];
      const index = buttons.indexOf(document.activeElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1) + buttons.length) % buttons.length;
      buttons[next].click(); buttons[next].focus();
    });
    const slider = document.querySelector('#answerSlider');
    if (slider) {
      const change = value => { state.answers[q.id] = Math.max(0, Math.min(100, Number(value))); state.answers = M.reconcile(state.answers); slider.value = state.answers[q.id]; paint(q); };
      slider.addEventListener('input', () => change(slider.value));
      document.querySelector('#minusBtn').addEventListener('click', () => change(Number(slider.value) - 10));
      document.querySelector('#plusBtn').addEventListener('click', () => change(Number(slider.value) + 10));
      document.querySelector('#middleBtn').addEventListener('click', () => change(50));
    }
    const textarea = document.querySelector('#textAnswer');
    textarea?.addEventListener('input', () => { state.answers[q.id] = textarea.value; document.querySelector('#textCount').textContent = `${textarea.value.length} / 4000`; paint(q); });
    document.querySelector('#nextBtn').addEventListener('click', next);
    document.querySelector('#backBtn').addEventListener('click', back);
    document.querySelector('#skipBtn')?.addEventListener('click', () => { state.answers[q.id] = null; state.answers = M.reconcile(state.answers); next(); });
    paint(q);
    focusTitle();
    announce(`Question ${index + 1}. ${q.title}`);
  }
  function paint(q) {
    const answer = state.answers[q.id];
    const selected = Array.isArray(answer) ? answer : [answer];
    const buttons = [...main.querySelectorAll('[data-value]')];
    buttons.forEach((button, index) => {
      const checked = selected.includes(button.dataset.value);
      button.setAttribute('aria-checked', checked);
      if (q.type !== 'multi') button.tabIndex = checked || (!answer && index === 0) ? 0 : -1;
    });
    document.querySelector('#nextBtn').disabled = !M.hasAnswer(q, answer);
    if (q.type === 'multi') document.querySelector('#selectionCount').textContent = `${(answer || []).length}${q.max ? ` / ${q.max}` : ''} selected`;
    if (q.type === 'slider') {
      const value = typeof answer === 'number' ? answer : 50;
      document.querySelector('#sliderValue').innerHTML = `${value}<small> / 100</small>`;
      document.querySelector('.spectrum').style.setProperty('--value', `${value}%`);
      document.querySelector('.figure').style.setProperty('--answer-shift', `${(value - 50) / 14}deg`);
      document.querySelector('#middleBtn').textContent = typeof answer === 'number' ? 'Set to the middle' : 'Choose the middle';
    }
    document.querySelector('#answerNote').textContent = '';
    progress();
  }
  function next() {
    const q = M.byId[state.currentId];
    if (!M.hasAnswer(q, state.answers[q.id])) return;
    const path = M.route(state.answers);
    const index = path.findIndex(item => item.id === q.id);
    if (index === path.length - 1) return finish();
    state.currentId = path[index + 1].id;
    question();
  }
  function back() {
    const path = M.route(state.answers);
    const index = path.findIndex(q => q.id === state.currentId);
    if (index <= 0) return intro(true);
    state.currentId = path[index - 1].id;
    question();
  }
  function finish() {
    if(window.SurveySubmission?.enabled&&!state.contributed) return contribution();
    results();
  }
  function contribution() {
    state.mode='submit';
    if(!state.receipt) state.receipt=window.SurveySubmission.createReceipt();
    main.innerHTML=`<section class="scene submit-scene"><div><p class="eyebrow">YOUR HUMAN PERSPECTIVE</p><h1 tabindex="-1">Make your perspective count.</h1><p class="submit-copy">Your personal results are ready. You can also add your perspective to a shared picture of how people are experiencing life with AI.</p><p class="submit-copy">If you contribute, your survey answers and optional written reflection will be stored in our Supabase database and can be read by the survey owner. We don’t ask for your name or email. Please leave identifying details out of your reflection.</p><label class="consent-label"><input type="checkbox" id="shareConsent"><span>I agree to share these answers, including my written reflection if I added one, for this survey.</span></label><div class="submit-actions"><button class="primary" id="submitAnswers" disabled>Send answers & see results <span aria-hidden="true">→</span></button><button class="text-button" id="privateResults">See results without sending</button><button class="text-button" id="editBeforeSubmit">Back to my answers</button></div><p class="submit-status" id="submitStatus" role="status"></p></div>${figure('letter','Your perspective matters')}</section>`;
    const consent=document.querySelector('#shareConsent');
    const submit=document.querySelector('#submitAnswers');
    const status=document.querySelector('#submitStatus');
    consent.addEventListener('change',()=>{submit.disabled=!consent.checked;});
    document.querySelector('#privateResults').addEventListener('click',results);
    document.querySelector('#editBeforeSubmit').addEventListener('click',()=>{state.currentId=M.route(state.answers).at(-1).id;question();});
    submit.addEventListener('click',async()=>{
      if(!consent.checked||submit.disabled)return;
      const locked=[...main.querySelectorAll('button,input'),document.querySelector('#homeBtn')];
      locked.forEach(control=>{control.disabled=true;});
      status.textContent='Saving your contribution…';state.submissionAttempted=true;
      try {
        await window.SurveySubmission.save({responses:state.answers,receipt:state.receipt,startedAt:state.startedAt});
        state.contributed=true;results();
      } catch(error) {
        status.textContent=(error.message||'We could not confirm your submission.')+' Retrying uses the same reference and won’t create a duplicate.';
        locked.forEach(control=>{control.disabled=false;});submit.disabled=!consent.checked;
        document.querySelector('#privateResults').textContent='See my results now';
      } finally {document.querySelector('#homeBtn').disabled=false;}
    });
    progress();document.querySelector('#progressLabel').textContent='YOUR CONTRIBUTION';document.querySelector('#progressCount').textContent='READY';focusTitle();
  }
  function results() {
    const path = M.route(state.answers);
    const missing = path.find(q => !M.hasAnswer(q, state.answers[q.id]));
    if (missing) { state.currentId = missing.id; return question(); }
    state.mode = 'results';
    const r = M.report(state.answers);
    const answered = path.filter(q => state.answers[q.id] !== null).length;
    const receiptNote=state.contributed?'<strong>Your contribution is saved.</strong> Reference: '+escape(state.receipt):state.submissionAttempted?'<strong>Submission not confirmed.</strong> Some answers may have arrived. Reference: '+escape(state.receipt):'<strong>Private results.</strong> You haven’t sent these answers to the study.';
    main.innerHTML = `<article class="results scene"><div class="report-hero"><div><p class="eyebrow">YOUR HUMAN / AI RESULTS / SURVEY 01</p><h1 tabindex="-1">${escape(r.title)}</h1><p class="report-summary">${escape(r.summary)}</p><div class="report-meta"><span>${answered} answers</span><span>${path.length - answered} skipped</span><span>One human perspective</span></div><div class="receipt-note">${receiptNote}</div></div>${figure('letter', 'A portrait, not a label')}</div><section class="report-section"><div class="section-heading"><span class="eyebrow">01 / YOUR LANDSCAPE</span><h2>Four places your answers landed.</h2><p>Descriptive indices from your answers, not a diagnosis or a validated psychological test.</p></div><div class="dimension-grid">${r.dimensions.map(d => `<div class="dimension-card"><div class="dimension-head"><h3>${d.name}</h3><span>${d.value ?? '—'}<small> / 100</small></span></div><div class="dimension-track" aria-label="${d.name}: ${d.value ?? 'not answered'} out of 100"><span style="width:${d.value ?? 0}%"></span></div><div class="dimension-ends"><span>${d.left}</span><span>${d.right}</span></div><details><summary>Why this appears</summary><p>${escape(d.explanation)}</p>${d.source.filter(id => state.answers[id] !== undefined).map(id => `<p class="evidence"><strong>${escape(M.byId[id].title)}</strong><br>${escape(M.label(M.byId[id], state.answers[id]))}</p>`).join('')}</details></div>`).join('')}</div></section><section class="report-section"><div class="section-heading"><span class="eyebrow">02 / THE INTERESTING PART</span><h2>The things you hold together.</h2></div><div class="tension-grid">${r.tensions.map((t, i) => `<div class="tension-card"><span class="tension-number">0${i + 1}</span><h3>${escape(t.title)}</h3><p>${escape(t.body)}</p></div>`).join('')}</div></section><section class="report-section priorities-section"><div class="section-heading"><span class="eyebrow">03 / IN YOUR OWN TERMS</span><h2>The boundaries & priorities you chose.</h2></div><div class="priorities-grid">${r.priorities.map(p => `<div class="priority-card"><h3>${escape(p.question)}</h3><ul>${p.labels.map(label => `<li>${escape(label)}</li>`).join('')}</ul></div>`).join('')}</div></section><section class="future-note"><p class="eyebrow">04 / THE FUTURE YOU WANT</p><h2>${escape(r.future || 'A future still open to possibility.')}</h2>${r.voice ? `<blockquote><p>“${escape(r.voice)}”</p><cite>Your note to the people building AI</cite></blockquote>` : '<p class="no-voice">You left your final reflection open. There is room to come back to it.</p>'}</section><section class="report-section"><details class="answer-atlas"><summary>Your answer atlas <span>${path.length} questions on your route</span></summary><dl>${path.map(q => `<div><dt>${escape(q.title)}</dt><dd>${escape(M.label(q, state.answers[q.id]))}</dd></div>`).join('')}</dl></details><div class="report-actions"><button class="primary" id="exportBtn">Download my results <span aria-hidden="true">↓</span></button><button class="secondary" id="printBtn">Print results</button><button class="text-button" id="reviewBtn">Review my answers</button><button class="text-button" id="restartBtn">Start again</button></div><p class="report-footnote">These results reflect this moment, and your views can change. Your contribution status and reference are shown above.</p></section></article>`;
    document.querySelector('#exportBtn').addEventListener('click', () => {
      const payload = { survey: 'Human / AI', version: 6, submission: {confirmed:state.contributed,receipt:state.receipt}, created: new Date().toISOString(), responses: r.answers, route: r.route, fieldnotes: {title: r.title, summary: r.summary, dimensions: r.dimensions, tensions: r.tensions, priorities: r.priorities, future: r.future, voice: r.voice}, answerAtlas: path.map(q => ({id: q.id, question: q.title, answer: M.label(q, state.answers[q.id]), skipped: state.answers[q.id] === null})) };
      const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json'}));
      const link = document.createElement('a'); link.href = url; link.download = 'human-ai-results-v6.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    document.querySelector('#printBtn').addEventListener('click', () => window.print());
    document.querySelector('#reviewBtn').addEventListener('click', () => { if(state.contributed){const atlas=document.querySelector('.answer-atlas');atlas.open=true;atlas.scrollIntoView({behavior:state.reduced?'instant':'smooth'});return;} state.currentId = path[0].id; question(); });
    document.querySelector('#restartBtn').addEventListener('click', () => { state.answers = {}; resetContribution(); state.currentId = null; intro(true); });
    progress(); focusTitle(); announce('Your personal results are ready.');
  }
  function motion() {
    document.documentElement.classList.toggle('reduce-motion', state.reduced);
    document.querySelector('#motionBtn').setAttribute('aria-pressed', state.reduced);
    document.querySelector('#motionLabel').textContent = state.reduced ? 'Motion off' : 'Motion on';
  }
  document.querySelector('#motionBtn').addEventListener('click', () => { state.manualMotion = true; state.reduced = !state.reduced; motion(); announce(state.reduced ? 'Motion off' : 'Motion on'); });
  motionPreference.addEventListener('change', event => { if (!state.manualMotion) { state.reduced = event.matches; motion(); } });
  document.querySelector('#homeBtn').addEventListener('click', () => intro(true));
  document.addEventListener('keydown', event => {
    if (state.mode !== 'question' || event.defaultPrevented || event.isComposing) return;
    if (event.key === 'Enter' && !event.target.closest('button, input, textarea, a, summary')) { event.preventDefault(); next(); }
    if (event.key === 'Escape' && !event.target.closest('textarea')) { event.preventDefault(); back(); }
  });
  let printDetails = [];
  window.addEventListener('beforeprint', () => {
    printDetails = [...main.querySelectorAll('details')].map(detail => ({ detail, open: detail.open }));
    printDetails.forEach(({ detail }) => { detail.open = true; });
  });
  window.addEventListener('afterprint', () => printDetails.forEach(({ detail, open }) => { detail.open = open; }));
  motion(); intro();
})();
