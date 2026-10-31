(() => {
  'use strict';
  const M = window.SurveyModel;
  const Art = window.SurveyArt;
  const main = document.querySelector('#survey');
  const announcer = document.querySelector('#announcer');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const newSeed=()=>crypto.getRandomValues(new Uint32Array(1))[0];
  const state = { mode: 'intro', currentId: null, answers: {}, topicSeed:newSeed(), adultConfirmed:false, quotePermission:false, reduced: motionPreference.matches, manualMotion: false, startedAt: Date.now(), receipt: null, contributed: false, submissionAttempted: false };
  const route=()=>M.route(state.answers,state.topicSeed);
  const reconcile=()=>M.reconcile(state.answers,state.topicSeed);
  let activeSwipe = null;
  let navigating = false;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
  const announce = message => { announcer.textContent = message; };
  const figure = art => `<figure class="figure" aria-hidden="true"><div class="art-stage">${Art.render(art)}</div></figure>`;
  function focusTitle() {
    requestAnimationFrame(() => { main.querySelector('h1, h2')?.focus({ preventScroll: true }); });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function resetContribution() { state.startedAt=Date.now();state.receipt=null;state.contributed=false;state.submissionAttempted=false;state.topicSeed=newSeed();state.quotePermission=false; }
  function progress() {
    document.body.dataset.theme='light';
    const path = route();
    const index = path.findIndex(q => q.id === state.currentId);
    const pct = ['results','submit'].includes(state.mode) ? 100 : state.mode === 'intro' ? 0 : Math.round(Math.max(0,index) / path.length * 100);
    document.querySelector('#progressFill').style.width = `${pct}%`;
    document.querySelector('#progress').setAttribute('aria-valuenow', pct);
    document.querySelector('#progress').setAttribute('aria-valuetext', state.mode === 'question' ? `Question ${index + 1} of ${path.length} on your current route` : `${pct}%`);
  }
  function intro(focus = false) {
    state.mode = 'intro';
    const saved = Object.keys(state.answers).length > 0;
    main.innerHTML = `<section class="scene intro-scene"><div class="intro-copy"><p class="eyebrow">Life with AI</p><h1 tabindex="-1">Life is changing.<br> <em>How does it feel from where you are?</em></h1><p class="intro-lede">We’re bringing people’s experiences together to understand what is helping, what is difficult, and what we want next.</p><p class="intro-description">You don’t need to know much about AI—or use it—to take part. Mixed feelings are welcome. Here, AI means tools that generate answers, text, images or other content, and systems that make predictions, recommendations or decisions. We’ll distinguish tools you choose to use from AI used by organisations.</p><label class="adult-confirmation"><input id="adultConfirmed" type="checkbox" ${state.adultConfirmed?'checked':''}><span>I’m aged 18 or over.</span></label><div class="intro-actions"><button class="primary" id="startBtn" ${state.adultConfirmed?'':'disabled'}>${saved ? 'Continue your route' : 'BEGIN THE SURVEY'} <span aria-hidden="true">↗</span></button>${saved ? '<button class="text-button" id="freshBtn">Start fresh</button>' : '<span class="time-note">Around 25 questions<br>Take it at your own pace.</span>'}</div></div>${figure('tea')}</section>`;
    document.querySelector('#adultConfirmed').addEventListener('change',event=>{state.adultConfirmed=event.target.checked;document.querySelector('#startBtn').disabled=!state.adultConfirmed;document.querySelector('#freshBtn')?.toggleAttribute('disabled',!state.adultConfirmed);});
    document.querySelector('#startBtn').addEventListener('click', () => {
      if(!saved) state.startedAt=Date.now();
      if(!state.adultConfirmed)return;
      const first = route().find(q => !M.hasAnswer(q, state.answers[q.id]));
      if (saved && !first) return finish();
      state.currentId = saved && route().some(q => q.id === state.currentId) ? state.currentId : (first || M.questions[0]).id;
      question();
    });
    document.querySelector('#freshBtn')?.addEventListener('click', () => { if(!state.adultConfirmed)return;state.answers = {}; resetContribution(); state.currentId = M.questions[0].id; question(); });
    progress();
    if (focus) focusTitle();
  }
  function instruction(q) {
    if (q.type === 'multi') return q.max ? `Choose up to ${q.max}` : 'Choose as many as apply';
    if (q.type === 'duel') return 'Choose the one closer to how you feel';
    if (q.type === 'slider') return 'Choose the answer closest to how you feel';
    if (q.type === 'text') return 'Your words. As much or as little as you like.';
    return 'Choose one';
  }
  function controls(q) {
    const answer = state.answers[q.id];
    if(q.type==='select')return `<select class="country-select" id="selectAnswer" aria-labelledby="questionTitle"><option value="">Choose your country or territory</option>${q.options.map(o=>`<option value="${escape(o.value)}" ${o.value===answer?'selected':''}>${escape(o.label)}</option>`).join('')}</select>`;
    if (q.type === 'text') return `<textarea id="textAnswer" aria-labelledby="questionTitle" maxlength="4000" placeholder="${escape(q.placeholder)}">${escape(answer)}</textarea><div class="text-count"><span>A thought, a feeling, a message.</span><span id="textCount">${typeof answer === 'string' ? answer.length : 0} / 4000</span></div>`;
    const multi = q.type === 'multi';
    const duel = q.type === 'duel';
    return `<div class="choices ${multi ? 'choice-grid' : ''} ${duel ? 'duel-grid' : ''}" role="${multi ? 'group' : 'radiogroup'}" aria-labelledby="questionTitle" aria-describedby="answerInstruction">${(q.responseOptions || q.options).map((option, index) => {
      const selected = multi ? (answer || []).includes(option.value) : answer === option.value;
      const tab = multi || selected || (answer == null && index === 0) ? 0 : -1;
      return `<button class="choice ${duel ? 'duel-choice' : ''} ${(q.exclusive || []).includes(option.value) ? 'choice-wide' : ''}" type="button" role="${multi ? 'checkbox' : 'radio'}" aria-checked="${selected}" tabindex="${tab}" data-value="${escape(option.value)}">${duel ? `<span class="duel-top"><span class="choice-letter">${index ? 'B' : 'A'}</span><span class="selection-mark" aria-hidden="true">✓</span></span><span class="choice-text">${escape(option.label)}</span>` : `<span class="choice-text">${escape(option.label)}</span><span class="selection-mark" aria-hidden="true">✓</span>`}</button>`;
    }).join('')}</div>`;
  }
  function question() {
    state.mode = 'question';
    state.answers = reconcile();
    const path = route();
    const q = M.byId[state.currentId];
    const index = path.findIndex(item => item.id === q.id);
    main.innerHTML = `<section class="scene question-scene" data-question-id="${q.id}"><div class="question-copy"><h2 id="questionTitle" tabindex="-1">${escape(q.title)}</h2><div class="answer-instruction" id="answerInstruction"><span>${instruction(q)}</span>${q.optional ? '<span class="optional-note">OPTIONAL</span>' : q.type === 'multi' ? '<span id="selectionCount">0 selected</span>' : ''}</div><div class="answer-area">${controls(q)}</div><p class="answer-note" id="answerNote" aria-live="polite"></p><div class="question-actions"><button class="back-button" id="backBtn" aria-label="Previous question"><span aria-hidden="true">←</span> Back</button><div class="next-actions">${q.optional ? `<button class="text-button skip-button" id="skipBtn">${q.type === 'text' ? 'Skip this reflection' : 'Skip this question'}</button>` : ''}<button class="primary" id="nextBtn">${index === path.length - 1 ? 'See my results' : 'Continue'} <span aria-hidden="true">→</span></button></div></div></div>${figure(q.art)}</section>`;
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
      } else state.answers[q.id] = q.responseOptions ? Number(button.dataset.value) : button.dataset.value;
      state.answers = reconcile();
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
    const textarea = document.querySelector('#textAnswer');
    textarea?.addEventListener('input', () => { state.answers[q.id] = textarea.value; document.querySelector('#textCount').textContent = `${textarea.value.length} / 4000`; paint(q); });
    document.querySelector('#selectAnswer')?.addEventListener('change',event=>{state.answers[q.id]=event.target.value||undefined;paint(q);});
    document.querySelector('#nextBtn').addEventListener('click', next);
    document.querySelector('#backBtn').addEventListener('click', back);
    document.querySelector('#skipBtn')?.addEventListener('click', () => { state.answers[q.id] = null; state.answers = reconcile(); next(); });
    paint(q);
    progress();
    focusTitle();
    announce(`Question ${index + 1}. ${q.title}`);
  }
  function paint(q) {
    const answer = state.answers[q.id];
    const selected = Array.isArray(answer) ? answer : [answer];
    const buttons = [...main.querySelectorAll('[data-value]')];
    buttons.forEach((button, index) => {
      const checked = selected.includes(q.responseOptions ? Number(button.dataset.value) : button.dataset.value);
      button.setAttribute('aria-checked', checked);
      if (q.type !== 'multi') button.tabIndex = checked || (answer == null && index === 0) ? 0 : -1;
    });
    document.querySelector('#nextBtn').disabled = !M.hasAnswer(q, answer);
    if (q.type === 'multi' && document.querySelector('#selectionCount')) document.querySelector('#selectionCount').textContent = `${(answer || []).length}${q.max ? ` / ${q.max}` : ''} selected`;
    document.querySelector('#answerNote').textContent = '';
  }
  function swipe(render, direction = 1) {
    if (state.reduced) { render(); return; }
    navigating = true;
    main.inert = true;
    document.querySelector('#homeBtn').disabled = true;
    document.documentElement.dataset.swipe = direction > 0 ? 'forward' : 'back';
    const release = () => {
      activeSwipe = null; navigating = false; main.inert = false;
      document.querySelector('#homeBtn').disabled = false;
      delete document.documentElement.dataset.swipe;
      focusTitle();
    };
    // Native snapshots move the entire viewport, including its paper background,
    // instead of sliding individual controls or briefly fading the new page.
    if (typeof document.startViewTransition === 'function') {
      try {
        activeSwipe = document.startViewTransition(render);
        activeSwipe.finished.then(release, release);
        return;
      } catch { /* Older embedded browsers can expose an unavailable API. */ }
    }
    render();
    const scene = main.querySelector('.scene');
    if (!scene?.animate) { release(); return; }
    const animation = scene.animate([
      { transform: 'translateX(' + (direction * 100) + 'vw)' },
      { transform: 'translateX(0)' }
    ], { duration: 340, easing: 'cubic-bezier(.65,0,.25,1)' });
    activeSwipe = { skipTransition: () => animation?.cancel?.() };
    if (animation?.finished) animation.finished.then(release, release);
    else release();
  }
  function next() {
    if (navigating) return;
    const q = M.byId[state.currentId];
    if (!M.hasAnswer(q, state.answers[q.id])) return;
    const path = route();
    const index = path.findIndex(item => item.id === q.id);
    if (index === path.length - 1) return swipe(finish);
    state.currentId = path[index + 1].id;
    swipe(question);
  }
  function back() {
    if (navigating) return;
    const path = route();
    const index = path.findIndex(q => q.id === state.currentId);
    if (index <= 0) return swipe(() => intro(true), -1);
    state.currentId = path[index - 1].id;
    swipe(question, -1);
  }
  function finish() {
    if(window.SurveySubmission?.enabled&&!state.contributed) return contribution();
    results();
  }
  function contribution() {
    state.mode='submit';
    if(!state.receipt) state.receipt=window.SurveySubmission.createReceipt();
    main.innerHTML=`<section class="scene submit-scene"><div><p class="eyebrow">YOUR HUMAN PERSPECTIVE</p><h1 tabindex="-1">Make your perspective count.</h1><p class="submit-copy">Your perspective can help build a shared picture of life with AI.</p><p class="submit-copy">If you contribute, your answers, optional background information and reflection will be stored privately and can be read by the survey owner to prepare the report. No name is required. Please leave identifying details out of your reflection. You can sign up separately for the findings after sending your answers.</p><label class="consent-label"><input type="checkbox" id="shareConsent"><span>I agree to share these answers, including my written reflection if I added one, for this survey.</span></label>${typeof state.answers.builders === 'string' && state.answers.builders.trim() ? '<label class="consent-label"><input type="checkbox" id="quotePermission"><span>You may include a non-identifying excerpt of my written reflection in the public report. (Optional)</span></label>' : ''}<div class="submit-actions"><button class="primary" id="submitAnswers" disabled>Send answers & see results <span aria-hidden="true">→</span></button><button class="text-button" id="editBeforeSubmit">Back to my answers</button></div><p class="submit-status" id="submitStatus" role="status"></p></div>${figure('letter','Your perspective matters')}</section>`;
    const consent=document.querySelector('#shareConsent');
    const submit=document.querySelector('#submitAnswers');
    const status=document.querySelector('#submitStatus');
    consent.addEventListener('change',()=>{submit.disabled=!consent.checked;});
    document.querySelector('#editBeforeSubmit').addEventListener('click',()=>{state.currentId=route().at(-1).id;question();});
    submit.addEventListener('click',async()=>{
      if(!consent.checked||submit.disabled)return;
      const locked=[...main.querySelectorAll('button,input'),document.querySelector('#homeBtn')];
      locked.forEach(control=>{control.disabled=true;});
      status.textContent='Saving your contribution…';state.submissionAttempted=true;
      try {
        await window.SurveySubmission.save({responses:state.answers,receipt:state.receipt,startedAt:state.startedAt,topicSeed:state.topicSeed,adultConfirmed:state.adultConfirmed,quotePermission:document.querySelector('#quotePermission')?.checked===true});
        state.contributed=true;results();
      } catch(error) {
        status.textContent=(error.message||'We could not confirm your submission.')+' Retrying uses the same reference and won’t create a duplicate.';
        locked.forEach(control=>{control.disabled=false;});submit.disabled=!consent.checked;
      } finally {document.querySelector('#homeBtn').disabled=false;}
    });
    progress();focusTitle();
  }
  function results() {
    const path = route();
    const missing = path.find(q => !M.hasAnswer(q, state.answers[q.id]));
    if (missing) { state.currentId = missing.id; return question(); }
    state.mode = 'results';
    const r = M.report(state.answers,state.topicSeed);
    window.TelescopicFinish.mount({main,report:r,receipt:state.receipt,contributed:state.contributed});
    progress(); focusTitle(); announce('Your personal results are ready.');
  }
  function motion() {
    if (state.reduced) activeSwipe?.skipTransition?.();
    document.documentElement.classList.toggle('reduce-motion', state.reduced);
    document.querySelector('#motionBtn').setAttribute('aria-pressed', state.reduced);
    document.querySelector('#motionLabel').textContent = state.reduced ? 'Motion off' : 'Motion on';
    document.querySelector('#motionBtn').setAttribute('aria-label', state.reduced ? 'Resume animations' : 'Pause animations');
    document.querySelector('#motionBtn').title = state.reduced ? 'Resume animations' : 'Pause animations';
  }
  document.querySelector('#motionBtn').addEventListener('click', () => { state.manualMotion = true; state.reduced = !state.reduced; motion(); announce(state.reduced ? 'Motion off' : 'Motion on'); });
  motionPreference.addEventListener('change', event => { if (!state.manualMotion) { state.reduced = event.matches; motion(); } });
  document.querySelector('#homeBtn').addEventListener('click', () => intro(true));
  document.addEventListener('keydown', event => {
    if (state.mode !== 'question' || event.defaultPrevented || event.isComposing) return;
    if (event.key === 'Enter' && !event.target.closest('button, input, select, textarea, a, summary')) { event.preventDefault(); next(); }
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
