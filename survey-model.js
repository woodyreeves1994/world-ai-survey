(function(root){
  'use strict';
  const version=7, questionnaire='life-with-ai-2026-10-31';
  const o=(value,label)=>({value,label});
  const options=pairs=>pairs.map(([value,label])=>o(value,label));
  const unsure=o('unsure','I’m not sure'), privateAnswer=o('private','Prefer not to answer');
  const scale=(labels,extra=[])=>[...labels.map((label,i)=>o(String(i),label)),...extra,unsure];
  const impact=extra=>scale(['Very negative','Somewhat negative','Neither positive nor negative','Somewhat positive','Very positive'],extra);
  const comfort=()=>scale(['Very uncomfortable','Somewhat uncomfortable','Neither comfortable nor uncomfortable','Somewhat comfortable','Very comfortable']);
  const frequency=extra=>scale(['Never','Rarely','Sometimes','Often','Very often'],extra);
  const recent=a=>['daily','several','weekly','less'].includes(a['use-frequency']);
  const working=a=>Array.isArray(a['life-context'])&&a['life-context'].some(v=>['employed','self-employed'].includes(v));
  const single=(id,title,art,opts,more={})=>({id,title,art,type:'single',options:opts,...more});
  const multi=(id,title,art,pairs,more={})=>({id,title,art,type:'multi',options:[...options(pairs),unsure],exclusive:['none','unsure','private','not-applicable'],...more});
  const core=[
    multi('feelings','When you think about AI becoming part of everyday life, which feelings come up?','feelings',[
      ['curious','Curious'],['hopeful','Hopeful'],['excited','Excited'],['reassured','Reassured'],['uncertain','Uncertain'],['worried','Worried'],['overwhelmed','Overwhelmed'],['frustrated','Frustrated'],['indifferent','Indifferent'],['other','Something else']],{max:3}),
    single('pace','How does the pace of AI development feel to you?','q-pace',options([['slow-much','Much too slow'],['slow-little','A little too slow'],['right','About right'],['fast-little','A little too fast'],['fast-much','Much too fast'],['unsure','I’m not sure']])),
    single('use-frequency','In the past 30 days, how often have you deliberately used an AI tool?','calendar',options([['daily','Every day or almost every day'],['several','Several days a week'],['weekly','About once a week'],['less','Less than once a week'],['previous','Not in the past 30 days, but previously'],['never','Never'],['unsure','I’m not sure whether something I used counts']])),
    multi('life-context','Which are part of your life at the moment?','desk',[
      ['employed','Paid employment'],['self-employed','Self-employment'],['study','Study'],['looking','Looking for work'],['caring','Unpaid caring'],['retired','Retirement'],['unable','Unable to work'],['other','Something else'],['private','Prefer not to answer']],{optional:true}),
    multi('uses','What have you used AI for in the past 30 days?','q-missed-tools',[
      ['work','Work'],['learning','Studying or learning'],['writing','Writing or communicating'],['creative','Making images, music or other creative work'],['coding','Coding'],['home','Household organisation'],['shopping','Shopping or travel'],['money','Money matters'],['health','Physical health information'],['support','Emotional support'],['caring','Parenting or caring'],['entertainment','Entertainment'],['other','Something else']],{when:recent}),
    multi('barriers','What, if anything, keeps you from using AI more often?','doors',[
      ['enough','I already use it as much as I want'],['no-need','I don’t need it'],['myself','I prefer doing things myself'],['start','I don’t know where to start'],['trust','I don’t trust the answers'],['privacy','Privacy concerns'],['cost','Cost'],['access','Difficulty accessing or using the tools'],['rules','Rules at work or school'],['ethics','Ethical or environmental concerns'],['other','Something else'],['none','Nothing']],{exclusive:['enough','none','unsure']}),
    multi('benefits','In the past 30 days, what has using AI helped you do?','q-work-changed',[
      ['time','Save time'],['understand','Understand something'],['quality','Improve something I made'],['ideas','Come up with ideas'],['money','Spend less money'],['access','Do something I otherwise found difficult'],['supported','Feel supported'],['enjoy','Enjoy myself'],['other','Something else'],['none','None of these']],{when:recent}),
    multi('drawbacks','In the past 30 days, which of these have happened when you used AI?','running',[
      ['wrong','I received an answer I later found was wrong'],['fix','I spent extra time checking or fixing its output'],['privacy','I shared information I later regretted sharing'],['confidence','I felt less confident doing something without it'],['time','I spent longer using it than I intended'],['upset','Its response upset me'],['other','Something else went wrong'],['none','None of these']],{when:recent}),
    single('personal-now','So far, what effect do you think AI has had on your life overall?','compass',impact([o('no-effect','I haven’t noticed an effect')])),
    single('personal-future','Over the next three years, what effect do you expect AI to have on your life?','q-meaning-anchor',impact([o('no-effect','I don’t expect an effect')])),
    single('checking','How confident are you that you can judge when an AI answer needs checking?','q-truth-support',scale(['Not at all confident','Slightly confident','Moderately confident','Very confident','Extremely confident'],[o('not-enough','I haven’t used AI enough to say')])),
    single('choice','How much choice do you feel you have about whether AI is part of your everyday life?','unplugged',scale(['No choice','A little choice','Some choice','A lot of choice','Complete choice'])),
    multi('support','What would help you feel better equipped for life with AI?','q-support',[
      ['explain','Clearer explanations'],['lessons','Practical lessons'],['person','Someone I can ask for help'],['cost','More affordable tools'],['access','Tools that are easier for me to use'],['rules','Clearer rules at work or school'],['safeguards','Stronger safeguards'],['human','The option to use a human service'],['none','Nothing right now'],['other','Something else']],{max:3}),
    single('alone','In the past 30 days, how often have you felt alone in how you feel about AI?','q-replace-worry',frequency([o('not-thought','I haven’t thought about AI'),privateAnswer]),{optional:true}),
    multi('human-involvement','For which of these would you want a person involved, even if AI were available?','tea',[
      ['medical','Medical care'],['emotional','Emotional support'],['teaching','Teaching'],['money','Important financial decisions'],['job','Decisions about my job'],['services','Public-service decisions affecting me'],['creative','Creative collaboration'],['care','Caring for someone I love'],['none','None of these'],['depends','It depends on the situation']],{exclusive:['none','depends','unsure']}),
    single('privacy','How comfortable would you feel sharing personal information with an AI service to get more tailored help?','q-memory-boundary',[...comfort().slice(0,5),o('depends','It depends on the information'),unsure]),
    multi('protections','Which protections would matter most to you when organisations use AI?','chess',[
      ['told','Being told when AI is involved'],['data','Control over my personal information'],['appeal','A human I can appeal to'],['errors','Independent checks for errors'],['fairness','Checks for unfair treatment'],['responsibility','Clear responsibility when something goes wrong'],['opt-out','The option not to use AI'],['none','None of these'],['other','Something else']],{max:3}),
    multi('priorities','Where would you most like AI to make a positive difference?','q-power-priority',[
      ['health','Healthcare'],['education','Education'],['costs','Everyday costs'],['work','Working conditions'],['access','Accessibility and independence'],['care','Caring for people'],['services','Public services'],['science','Scientific discovery'],['environment','The environment'],['creative','Creative expression'],['other','Something else'],['none','Nowhere in particular']],{max:3}),
    single('society-future','Over the next three years, what effect do you expect AI to have on society overall?','q-pressure-source',impact([o('no-effect','I don’t expect an effect')])),
    single('extra-hour','Imagine AI gave you an extra hour each day, with no loss of income. What would you most want to do with it?','hammock',options([['people','Spend time with people'],['rest','Rest'],['outside','Exercise or get outdoors'],['make','Make something'],['learn','Learn something'],['care','Care for someone'],['earn','Earn more'],['admin','Catch up on life admin'],['other','Something else'],['unsure','I’m not sure']]))
  ];
  const modules=[
    {id:'work',name:'Work and income',eligible:working,questions:[
      multi('work-changes','In the past three months, what has changed at work that you believe is linked to AI?','q-work-pressure',[
        ['time','Tasks take less time'],['output','More output is expected'],['responsibilities','New responsibilities'],['fewer','Fewer tasks are available'],['opportunities','New opportunities'],['hours','Changes to paid hours'],['earnings','Changes to earnings'],['none','No change']]),
      single('work-income','Over the next three years, do you expect AI to make your ability to earn a living better or worse?','mirror',scale(['Much worse','Somewhat worse','Neither better nor worse','Somewhat better','Much better'],[o('no-effect','No effect')]))]},
    {id:'learning',name:'Learning and skills',questions:[
      single('learning-practice','When you use AI to learn something, how often do you try doing it yourself afterwards?','painting',scale(['Never','Rarely','Sometimes','Often','Always'],[o('not-used','I haven’t used it for learning')])),
      single('learning-confidence','What effect, if any, has AI had on your confidence in learning something new?','mirror',scale(['Much less confident','Somewhat less confident','No effect','Somewhat more confident','Much more confident'],[o('not-used','I haven’t used it for learning')]))]},
    {id:'health',name:'Health and wellbeing',questions:[
      multi('health-uses','In the past three months, have you used AI for any of these?','q-health',[
        ['information','Physical health information'],['appointment','Preparing for a medical appointment'],['understanding','Understanding health information'],['emotional','Emotional support'],['none','None of these'],['private','Prefer not to answer']],{optional:true}),
      single('health-worry','How comfortable would you feel discussing a personal worry with an AI chatbot?','q-wellbeing',[...comfort(),privateAnswer],{optional:true})]},
    {id:'relationships',name:'Relationships and caring',questions:[
      single('relationships-talk','In the past three months, has time spent talking with AI changed how much you talk with other people?','q-connection',scale(['Much less','Somewhat less','No change','Somewhat more','Much more'],[o('not-used','I haven’t talked with AI'),privateAnswer]),{optional:true}),
      multi('caring-tasks','For which caring tasks would you consider using AI?','garden',[
        ['organising','Organising care'],['information','Explaining information'],['activities','Suggesting activities'],['communication','Helping with communication'],['companionship','Providing companionship'],['none','None'],['not-applicable','Not relevant to me']])]},
    {id:'home-money',name:'Home and money',questions:[
      single('home-effort','What effect has AI had on the effort it takes you to manage everyday tasks?','garden',scale(['Much more effort','Somewhat more effort','No effect','Somewhat less effort','Much less effort'],[o('not-used','I haven’t used it for this')])),
      single('money-advice','How comfortable would you feel using AI advice when making an important money decision?','q-work-pressure',comfort())]},
    {id:'creativity',name:'Creativity and identity',questions:[
      single('creative-frequency','What effect has AI had on how often you make things for enjoyment?','painting',scale(['Much less often','Somewhat less often','No change','Somewhat more often','Much more often'],[o('not-applicable','I don’t do this')])),
      single('identity','If AI could do something you take pride in better than you, how much would that change how you value yourself?','mirror',scale(['Not at all','A little','Somewhat','Quite a lot','A great deal'],[privateAnswer]),{optional:true})]},
    {id:'public-life',name:'Information and public life',questions:[
      single('information-check','In the past three months, how often have you checked something because you suspected it was AI-generated?','newspaper',frequency()),
      single('human-review','If AI helped make an important public-service decision about you, how important would the right to a human review be?','q-work-pressure',scale(['Not at all important','Slightly important','Moderately important','Very important','Extremely important']))]},
    {id:'fairness',name:'Fairness and the environment',questions:[
      single('financial-benefits','Who do you expect to benefit most financially from AI over the next three years?','q-work-pressure',options([['few','Mainly a small number of people and organisations'],['even','Benefits spread fairly evenly'],['worse-off','Mainly people currently worse off'],['none','No substantial financial benefit'],['other','Another outcome'],['unsure','I’m not sure']])),
      single('environment','How much should AI’s environmental impact influence decisions about where it is used?','garden',scale(['Not at all','A little','Somewhat','Quite a lot','A great deal']))]}
  ];
  modules.forEach(m=>m.questions.forEach(q=>q.module=m.id));
  const countryCodes='AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');
  const regionNames=new Intl.DisplayNames(['en'],{type:'region'});
  const profile=[
    single('country','Which country or territory do you live in?','map',[...countryCodes.map(code=>o(code,regionNames.of(code))).sort((a,b)=>a.label.localeCompare(b.label)),o('other','Another country or territory'),privateAnswer],{type:'select',optional:true}),
    single('age','What is your age group?','memory',options([['18-24','18–24'],['25-34','25–34'],['35-44','35–44'],['45-54','45–54'],['55-64','55–64'],['65-74','65–74'],['75+','75+'],['private','Prefer not to answer']]),{optional:true}),
    single('finances','How comfortably does your household manage financially at the moment?','q-wallet',scale(['Very comfortably','Fairly comfortably','Just getting by','Finding it fairly difficult','Finding it very difficult'],[privateAnswer]),{optional:true}),
    {id:'builders',title:'What is one thing you want the people shaping AI to understand about your life?',art:'letter',type:'text',optional:true,placeholder:'Something you hope they will understand…'}
  ];
  const questions=[...core,...modules.flatMap(m=>m.questions),...profile];
  const byId=Object.fromEntries(questions.map(q=>[q.id,q]));
  // Stable seeded shuffle: Back never rerolls a topic; eligibility depends only on life context.
  function allocation(answers,seed=0){
    let n=seed>>>0;
    const random=()=>{n=(n+0x6D2B79F5)>>>0;let t=n;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
    const order=modules.map(m=>m.id);
    for(let i=order.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
    const eligible=modules.filter(m=>!m.eligible||m.eligible(answers)).map(m=>m.id);
    return {module:order.find(id=>eligible.includes(id)),eligible,probability:1/eligible.length,seed:seed>>>0,method:'seeded-shuffle-v1'};
  }
  const route=(answers,seed=0)=>{const topic=allocation(answers,seed).module;return questions.filter(q=>(!q.when||q.when(answers))&&(!q.module||q.module===topic));};
  function reconcile(answers,seed=0){const allowed=new Set(route(answers,seed).map(q=>q.id));return Object.fromEntries(Object.entries(answers).filter(([id])=>allowed.has(id)));}
  function hasAnswer(q,answer){
    if(answer===null)return !!q.optional;
    if(answer===undefined)return false;
    if(q.type==='text')return typeof answer==='string'&&answer.trim().length>0&&answer.length<=4000;
    if(q.type==='multi')return Array.isArray(answer)&&answer.length>0&&(!q.max||answer.length<=q.max)&&new Set(answer).size===answer.length&&answer.every(v=>q.options.some(o=>o.value===v))&&(!answer.some(v=>(q.exclusive||[]).includes(v))||answer.length===1);
    return q.options.some(o=>o.value===answer);
  }
  function selectMulti(q,current,value){const selected=Array.isArray(current)?current:[];if(selected.includes(value))return {values:selected.filter(v=>v!==value),limited:false};if((q.exclusive||[]).includes(value))return {values:[value],limited:false};const values=selected.filter(v=>!(q.exclusive||[]).includes(v));if(q.max&&values.length>=q.max)return {values:selected,limited:true};return {values:[...values,value],limited:false};}
  function label(q,answer){if(answer===null||answer===undefined)return 'Skipped';if(q.type==='text')return answer;return (Array.isArray(answer)?answer:[answer]).map(v=>q.options.find(o=>o.value===v)?.label||v).join(' · ');}
  function report(input,seed=0){
    const answers=reconcile(input,seed),feelings=answers.feelings||[];
    const positive=feelings.some(f=>['curious','hopeful','excited','reassured'].includes(f));
    const negative=feelings.some(f=>['uncertain','worried','overwhelmed','frustrated'].includes(f));
    const title=positive&&negative?'Possibility, with mixed feelings.':positive?'Curious about what comes next.':negative?'Making room for how change feels.':'A perspective of my own.';
    return {title,dimensions:[],answers,route:route(answers,seed).map(q=>q.id),perspectives:[
      ['EVERYDAY AI',label(byId['use-frequency'],answers['use-frequency'])],
      ['LIFE SO FAR',label(byId['personal-now'],answers['personal-now'])],
      ['LOOKING AHEAD',label(byId['personal-future'],answers['personal-future'])]
    ]};
  }
  const api={version,questionnaire,questions,byId,modules,allocation,route,reconcile,hasAnswer,selectMulti,label,report,recent};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SurveyModel=api;
})(typeof window!=='undefined'?window:globalThis);
