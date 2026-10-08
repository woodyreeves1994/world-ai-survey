(function (root) {
  'use strict';
  const o = (value, label) => ({ value, label });
  const work = a => ['working', 'studying', 'both'].includes(a.context);
  const concern = a => (a.feelings || []).some(v => ['anxiety', 'fear', 'overwhelm', 'powerlessness'].includes(v)) || a['keep-up'] >= 65;
  const questions = [
    { id: 'pace', chapter: 'Change', title: 'How does the pace of AI development feel to you?', art: 'pace', type: 'single', options: [o('slow', 'Too slow. I want progress to move faster.'), o('right', 'About right.'), o('uneasy', 'A little faster than I’m comfortable with.'), o('fast', 'Much faster than I’m comfortable with.'), o('danger', 'Dangerously fast.')] },
    { id: 'keep-up', chapter: 'Change', title: 'How easy is it for you to keep up with changes in AI?', art: 'running', type: 'slider', left: 'I can comfortably keep up', right: 'I feel completely left behind' },
    { id: 'future-picture', chapter: 'Change', title: 'How clearly can you picture the role AI will play in your life in ten years?', art: 'map', type: 'slider', left: 'Very clearly', right: 'I can’t picture it at all' },
    { id: 'context', chapter: 'Work & worth', title: 'What does your everyday life currently include?', art: 'desk', type: 'single', options: [o('working', 'Paid work'), o('studying', 'Study'), o('both', 'Both work and study'), o('neither', 'Neither at the moment'), o('private', 'I’d rather not say')] },
    { id: 'work-changed', chapter: 'Work & worth', title: 'What has AI already changed about your work or study?', art: 'tasks', type: 'multi', max: 5, exclusive: ['none'], when: work, options: [o('faster', 'I finish some tasks faster'), o('automated', 'Some of my tasks are now automated'), o('output', 'More output is expected from me'), o('role', 'My role has changed'), o('skills', 'I’ve had to learn new skills'), o('fewer', 'My team needs fewer people'), o('new', 'New opportunities have appeared'), o('none', 'Nothing meaningful has changed yet')] },
    { id: 'work-pressure', chapter: 'Work & worth', title: 'What would make AI’s effect on your work feel fairer?', art: 'calendar', type: 'multi', max: 3, branch: 'A little deeper on work', when: a => work(a) && (a['work-changed'] || []).some(v => ['output', 'automated', 'fewer'].includes(v)), options: [o('time', 'Giving some of the saved time back to people'), o('say', 'Having a say in how AI is introduced'), o('training', 'Time and support to learn'), o('security', 'Clearer job security'), o('benefits', 'Sharing the financial benefits'), o('limits', 'Limits on rising expectations')] },
    { id: 'replace-worry', chapter: 'Work & worth', title: 'Which possibility worries you more about your working future?', art: 'chairs', type: 'duel', when: a => ['working', 'both'].includes(a.context), options: [o('machine', 'AI doing my job better than I can'), o('person', 'Someone using AI to do my job better than I can')] },
    { id: 'one-day-week', chapter: 'Work & worth', title: 'If AI let you finish a week’s work in one day, what would most likely happen next?', art: 'calendar', type: 'single', when: work, options: [o('less', 'I’d get to work less'), o('more', 'I’d be expected to produce more'), o('expand', 'I’d take on different kinds of work'), o('change', 'The job itself would change'), o('unsure', 'I honestly don’t know')] },
    { id: 'self-worth', chapter: 'Work & worth', title: 'If AI outperformed you at most intellectual tasks, how much would it change the way you value yourself?', art: 'mirror', type: 'slider', left: 'My value would feel unchanged', right: 'My sense of self would be shaken' },
    { id: 'feelings', chapter: 'Work & worth', title: 'Which feelings come up most strongly when you think about powerful AI?', art: 'feelings', type: 'multi', max: 3, options: [o('excitement', 'Excitement'), o('curiosity', 'Curiosity'), o('hope', 'Hope'), o('anxiety', 'Anxiety'), o('fear', 'Fear'), o('overwhelm', 'Overwhelm'), o('optimism', 'Optimism'), o('powerlessness', 'Powerlessness')] },
    { id: 'support', chapter: 'Work & worth', title: 'What would help you feel more at ease with AI change?', art: 'tea', type: 'multi', branch: 'A little deeper on change', exclusive: ['unsure'], when: concern, options: [o('understanding', 'Clear explanations of what AI can and can’t do'), o('slower', 'A slower pace of change'), o('boundaries', 'Stronger limits and safeguards'), o('learning', 'Practical help to learn'), o('conversation', 'Space to talk honestly about it'), o('choice', 'The freedom to choose whether to use it'), o('unsure', 'I’m not sure yet')] },
    { id: 'dependency', chapter: 'Choice & control', title: 'If every AI tool disappeared tomorrow, how much would your work or everyday life be affected?', art: 'unplugged', type: 'single', options: [o('none', 'I’d barely notice'), o('little', 'Things would take a little longer'), o('some', 'I’d be considerably less productive'), o('much', 'Some things would become difficult'), o('essential', 'I’d struggle to manage things I currently do')] },
    { id: 'missed-tools', chapter: 'Choice & control', title: 'Which kinds of AI help would you miss most?', art: 'tasks', type: 'multi', max: 3, branch: 'A little deeper on reliance', when: a => ['some', 'much', 'essential'].includes(a.dependency), options: [o('writing', 'Writing and communicating'), o('research', 'Finding and understanding information'), o('making', 'Making things'), o('planning', 'Planning and organising'), o('coding', 'Coding and technical tasks'), o('thinking', 'Having something to think things through with')] },
    { id: 'agency', chapter: 'Choice & control', title: 'How free do you feel to choose whether you use AI?', art: 'doors', type: 'single', options: [o('free', 'Completely free to choose'), o('mostly', 'Mostly free to choose'), o('pressure', 'I have a choice, but the pressure is growing'), o('little', 'I have very little choice'), o('none', 'It barely feels like a choice at all')] },
    { id: 'pressure-source', chapter: 'Choice & control', title: 'Where does the pressure to use AI come from for you?', art: 'desk', type: 'multi', max: 3, branch: 'A little deeper on choice', when: a => ['pressure', 'little', 'none'].includes(a.agency), options: [o('employer', 'My employer or workplace'), o('study', 'My education or training'), o('peers', 'People around me'), o('competition', 'The need to stay competitive'), o('services', 'Services that make AI hard to avoid'), o('self', 'My own expectations of myself')] },
    { id: 'choice-vs-control', chapter: 'Choice & control', title: 'If AI knew which personal decision would work out best, what would matter more to you?', art: 'compass', type: 'slider', left: 'Getting the best outcome', right: 'Knowing the choice was truly mine' },
    { id: 'human-boundary', chapter: 'Human connection', title: 'Where would you still prefer a human, even if AI could do the task better?', art: 'tea', type: 'multi', exclusive: ['none'], options: [o('doctor', 'A doctor'), o('therapist', 'A therapist'), o('teacher', 'A teacher'), o('manager', 'A manager'), o('adviser', 'A financial adviser'), o('collaborator', 'A creative collaborator'), o('partner', 'A romantic partner'), o('none', 'None of these. Capability matters more to me.')] },
    { id: 'art-value', chapter: 'Human connection', title: 'When a piece of art moves you, which matters more?', art: 'painting', type: 'duel', options: [o('authorship', 'The human experience behind it'), o('feeling', 'The feeling it creates in me')] },
    { id: 'grief', chapter: 'Human connection', title: 'Would you want to speak to an AI recreation of someone you had lost?', art: 'memory', type: 'single', optional: true, options: [o('yes', 'Definitely'), o('probably', 'Probably'), o('unsure', 'I’m unsure'), o('unlikely', 'Probably not'), o('no', 'Definitely not')] },
    { id: 'memory-boundary', chapter: 'Human connection', title: 'What boundaries would you want around an AI recreation of a loved one?', art: 'memory', type: 'multi', max: 3, branch: 'A little deeper on memory', when: a => ['yes', 'probably', 'unsure'].includes(a.grief), options: [o('label', 'It must always be clear that it is a recreation'), o('consent', 'The person’s wishes must be respected'), o('family', 'The family must have a say'), o('limits', 'It must not replace my living relationships'), o('commercial', 'It must not be used to sell things to me'), o('stop', 'I must be able to stop and delete it')] },
    { id: 'truth', chapter: 'Trust & power', title: 'How confident are you that you can tell real content from AI-generated content online?', art: 'newspaper', type: 'slider', left: 'Not confident at all', right: 'Very confident' },
    { id: 'truth-support', chapter: 'Trust & power', title: 'What would most help you trust the things you see online?', art: 'newspaper', type: 'single', branch: 'A little deeper on trust', when: a => typeof a.truth === 'number' && a.truth <= 45, options: [o('source', 'Being able to check the original source'), o('labels', 'Clear labels on AI-generated content'), o('verification', 'Independent fact-checking'), o('education', 'Better tools for spotting misleading content'), o('unsure', 'I’m not sure anything would be enough')] },
    { id: 'control-worry', chapter: 'Trust & power', title: 'Which kind of power worries you more?', art: 'chess', type: 'duel', options: [o('systems', 'AI systems becoming too powerful to control'), o('owners', 'A few people controlling very powerful AI')] },
    { id: 'power-priority', chapter: 'Trust & power', title: 'What should matter most in the way powerful AI is governed?', art: 'chess', type: 'multi', max: 3, options: [o('oversight', 'Democratic oversight'), o('testing', 'Independent safety testing'), o('benefits', 'Sharing the benefits widely'), o('limits', 'Clear limits on harmful uses'), o('access', 'Access beyond a few large companies'), o('voice', 'A meaningful public voice')] },
    { id: 'meaning', chapter: 'A life ahead', title: 'If you no longer needed paid work, how would that future feel to you?', art: 'hammock', type: 'slider', left: 'Like freedom', right: 'Like a loss of meaning' },
    { id: 'meaning-anchor', chapter: 'A life ahead', title: 'What would give you a sense of purpose beyond being productive?', art: 'garden', type: 'multi', max: 3, branch: 'A little deeper on meaning', when: a => a.meaning >= 55 || a['self-worth'] >= 65, options: [o('care', 'Caring for other people'), o('create', 'Creating things'), o('learn', 'Learning and exploring'), o('challenge', 'Doing difficult things'), o('community', 'Belonging to a community'), o('nature', 'Spending time in nature'), o('work', 'Work I choose for myself')] },
    { id: 'future', chapter: 'A life ahead', title: 'Which future would you most want to live in?', art: 'garden', type: 'single', options: [o('tool', 'AI mainly supports human work'), o('together', 'Humans and powerful AI work side by side'), o('leisure', 'AI does most work and people work far less'), o('beyond', 'AI becomes more capable than us in almost every field'), o('other', 'None of these feels right to me')] },
    { id: 'builders', chapter: 'A life ahead', title: 'What is one thing you want AI’s builders to understand about being human?', art: 'letter', type: 'text', optional: true, placeholder: 'Something you hope they will remember…' }
  ];
  const byId = Object.fromEntries(questions.map(q => [q.id, q]));
  const route = answers => questions.filter(q => !q.when || q.when(answers));
  function reconcile(answers) {
    const clean = { ...answers };
    for (let n = 0; n < questions.length; n++) {
      const allowed = new Set(route(clean).map(q => q.id));
      const removed = Object.keys(clean).filter(id => !allowed.has(id));
      if (!removed.length) return clean;
      removed.forEach(id => delete clean[id]);
    }
    return clean;
  }
  function hasAnswer(q, answer) {
    if (answer === null) return !!q.optional;
    if (q.type === 'slider') return Number.isFinite(answer) && answer >= 0 && answer <= 100;
    if (q.type === 'text') return typeof answer === 'string' && answer.trim().length > 0;
    if (q.type === 'multi') return Array.isArray(answer) && answer.length > 0 && (!q.max || answer.length <= q.max) && answer.every(v => q.options.some(o => o.value === v)) && (!answer.some(v => (q.exclusive || []).includes(v)) || answer.length === 1);
    return q.options.some(o => o.value === answer);
  }
  function selectMulti(q, current, value) {
    const selected = Array.isArray(current) ? current : [];
    if (selected.includes(value)) return { values: selected.filter(v => v !== value), limited: false };
    if ((q.exclusive || []).includes(value)) return { values: [value], limited: false };
    const values = selected.filter(v => !(q.exclusive || []).includes(v));
    if (q.max && values.length >= q.max) return { values: selected, limited: true };
    return { values: [...values, value], limited: false };
  }
  function label(q, answer) {
    if (answer === null || answer === undefined) return 'Skipped';
    if (q.type === 'slider') return `${answer} / 100 · ${q.left} ↔ ${q.right}`;
    if (q.type === 'text') return answer;
    return (Array.isArray(answer) ? answer : [answer]).map(v => q.options.find(o => o.value === v)?.label || v).join(' · ');
  }
  const numeric = (a, id) => typeof a[id] === 'number' ? a[id] : null;
  const lookup = (a, id, values) => a[id] in values ? values[a[id]] : null;
  const mean = entries => { const available = entries.filter(v => v !== null); return available.length ? Math.round(available.reduce((a, b) => a + b, 0) / available.length) : null; };
  function report(input) {
    const a = reconcile(input);
    const pressure = mean([numeric(a, 'keep-up'), lookup(a, 'pace', {slow: 0, right: 25, uneasy: 55, fast: 80, danger: 100})]);
    const reliance = lookup(a, 'dependency', {none: 0, little: 25, some: 55, much: 80, essential: 100});
    const ownership = numeric(a, 'choice-vs-control');
    const roles = Array.isArray(a['human-boundary']) ? a['human-boundary'] : null;
    const presence = mean([roles ? (roles.includes('none') ? 0 : roles.length / 7 * 100) : null, lookup(a, 'art-value', {authorship: 100, feeling: 0})]);
    const feelings = a.feelings || [];
    const positive = feelings.some(v => ['hope', 'excitement', 'curiosity', 'optimism'].includes(v));
    const uneasy = feelings.some(v => ['anxiety', 'fear', 'overwhelm', 'powerlessness'].includes(v));
    let title = 'There is more than one feeling here.';
    let summary = 'Your answers make room for more than one way of thinking about AI. Your fieldnotes bring those preferences together without reducing you to a single label.';
    if (positive && uneasy) { title = 'Hope, with a few things held close.'; summary = 'You chose both possibility and unease. Those feelings can coexist: being interested in what AI offers does not mean feeling ready for every change it brings.'; }
    else if (positive && ownership >= 65) { title = 'Open to possibility. Still the author.'; summary = 'You see something to be curious or hopeful about, while placing a high value on making your own decisions. Your ideal future leaves people room to choose.'; }
    else if (pressure >= 65) { title = 'A little more room to catch up.'; summary = 'The pace of change feels demanding to you. Your answers point toward a future that makes space for people to understand, adapt and have a say.'; }
    else if (presence >= 65) { title = 'Some things are better with a person.'; summary = 'You give human presence or authorship considerable weight. Capability is part of the story, but your answers suggest it is not the whole story.'; }
    else if (reliance >= 65) { title = 'AI is already part of the everyday.'; summary = 'AI’s absence would make some of your current activities difficult. Your answers start from lived usefulness, alongside the choices and boundaries you want to keep.'; }
    else if (positive) { title = 'Curious about the life ahead.'; summary = 'Curiosity, hope or excitement appears in your answers. The rest of your fieldnotes show the particular conditions and preferences that sit alongside that openness.'; }
    const dimensions = [
      { key: 'pressure', name: 'Change pressure', value: pressure, left: 'Comfortable pace', right: 'Hard to keep up', source: ['pace', 'keep-up'], explanation: 'A simple average of your pace answer (0, 25, 55, 80 or 100) and your keep-up slider. Higher means more pressure from change.' },
      { key: 'reliance', name: 'Everyday reliance', value: reliance, left: 'Light touch', right: 'Hard to do without', source: ['dependency'], explanation: 'Your answer about losing access to AI, mapped in order to 0, 25, 55, 80 or 100. Higher means AI is harder for you to do without.' },
      { key: 'ownership', name: 'Decision ownership', value: ownership, left: 'Best outcome', right: 'My own choice', source: ['choice-vs-control'], explanation: 'Your decision slider exactly as you set it. Higher means you put more weight on the decision feeling truly yours.' },
      { key: 'presence', name: 'Human presence', value: presence, left: 'Capability first', right: 'People matter', source: ['human-boundary', 'art-value'], explanation: 'An average of the proportion of seven roles where you preferred a human, and your art answer (human authorship = 100; feeling created = 0). A descriptive index, not a validated scale.' }
    ];
    const tensions = [];
    if (positive && uneasy) tensions.push({ title: 'Possibility & unease', body: `You selected ${label(byId.feelings, a.feelings).toLowerCase()}. Your emotional picture includes both an invitation and a reason to be careful.` });
    if (reliance >= 55 && ['pressure', 'little', 'none'].includes(a.agency)) tensions.push({ title: 'Useful, but not entirely optional', body: 'AI makes a meaningful difference to your everyday life, while choosing whether to use it feels increasingly constrained.' });
    if (ownership >= 65) tensions.push({ title: 'An answer is not the same as a choice', body: 'Even if AI could find the best outcome, you leaned toward knowing the decision was yours. Agency carries value beyond efficiency.' });
    if (a['self-worth'] >= 65) tensions.push({ title: 'Capability & personal worth', body: 'Being outperformed would affect how you value yourself. That answer makes the question of human worth especially important in your fieldnotes.' });
    if (a.meaning <= 35) tensions.push({ title: 'Time back, life ahead', body: 'A life without the need for paid work feels closer to freedom for you. That opens a different question: what would you choose to do with that time?' });
    else if (a.meaning >= 65) tensions.push({ title: 'Less work, still a reason to get up', body: 'Losing the need for paid work feels closer to a loss of meaning for you. Purpose matters alongside the promise of time saved.' });
    if (a['control-worry']) tensions.push({ title: a['control-worry'] === 'owners' ? 'Who holds the keys?' : 'Keeping power answerable', body: a['control-worry'] === 'owners' ? 'You were more concerned about a few people controlling powerful AI than about AI’s own power. Concentration matters in the future you imagine.' : 'You were more concerned about systems becoming too powerful to control. The ability to keep AI understandable and answerable matters in the future you imagine.' });
    const priorities = ['work-pressure', 'support', 'human-boundary', 'memory-boundary', 'power-priority', 'meaning-anchor'].filter(id => Array.isArray(a[id]) && a[id].length).map(id => ({question: byId[id].title, labels: a[id].map(v => byId[id].options.find(o => o.value === v).label)}));
    return { title, summary, dimensions, tensions: tensions.slice(0, 3), priorities, future: a.future ? label(byId.future, a.future) : null, voice: typeof a.builders === 'string' ? a.builders : null, answers: a, route: route(a).map(q => q.id) };
  }
  const api = { questions, byId, route, reconcile, hasAnswer, selectMulti, label, report };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SurveyModel = api;
})(typeof window !== 'undefined' ? window : globalThis);
