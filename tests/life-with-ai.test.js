const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
const M=require('../survey-model');const {validateSubmission}=require('../database/validation');
function complete(seed=1,overrides={}){let a={'use-frequency':'daily','life-context':['employed'],...overrides};for(let i=0;i<50;i++){const q=M.route(a,seed).find(q=>!M.hasAnswer(q,a[q.id]));if(!q)break;a[q.id]=q.optional?null:q.type==='multi'?[q.options[0].value]:q.options[0].value;}return a;}
function body(seed=1,overrides={}){return {version:7,consent:true,adultConfirmed:true,topicSeed:seed,receipt:'72522c2b-7db0-400c-9e35-14e7f2b981d7',responses:complete(seed,overrides),durationSeconds:420};}
test('all eight topics are reachable with exactly two questions and stable allocation',()=>{
 const topics=new Set();for(let seed=0;seed<100;seed++){const a=complete(seed),allocation=M.allocation(a,seed);topics.add(allocation.module);assert.equal(M.route(a,seed).filter(q=>q.module).length,2);assert.deepEqual(M.allocation({...a,feelings:['worried']},seed),allocation);assert.equal(M.route(a,seed).length,26);}assert.equal(topics.size,8);
});
test('work requires paid work; non-users skip recent use questions without losing topic coverage',()=>{
 const topics=new Set();for(let seed=0;seed<100;seed++){const a=complete(seed,{'use-frequency':'never','life-context':null});const route=M.route(a,seed);assert.equal(route.length,23);assert.ok(!route.some(q=>q.module==='work'));assert.ok(!route.some(q=>['uses','benefits','drawbacks'].includes(q.id)));topics.add(M.allocation(a,seed).module);}assert.equal(topics.size,7);
});
test('backtracking removes newly ineligible recent-use and topic answers',()=>{
 const seed=Array.from({length:100},(_,i)=>i).find(i=>M.allocation({'life-context':['employed']},i).module==='work');const a=complete(seed);a['use-frequency']='never';a['life-context']=['retired'];const clean=M.reconcile(a,seed);for(const id of ['uses','benefits','drawbacks','work-changes','work-income'])assert.ok(!Object.hasOwn(clean,id));
});
test('new responses store exact questionnaire, option labels, route, skip status and allocation',()=>{
 const b=body();b.indices={fake:100};b.topic='fake';b.is_test=true;b.quotePermission=true;
 const {record,error}=validateSubmission(b,M);assert.equal(error,undefined);assert.equal(record.survey_version,7);assert.deepEqual(record.indices,{});assert.equal(record.is_test,false);assert.equal(record.answer_atlas.length,26);assert.equal(record.research_metadata.questionnaire,M.questionnaire);assert.equal(record.research_metadata.question_status.country,'skipped');assert.equal(record.research_metadata.quote_permission,true);assert.equal(Object.keys(record.research_metadata.question_status).length,40);assert.ok(record.answer_atlas.find(q=>q.id==='feelings').options.length>5);
});
test('validation rejects missing consent, age confirmation, seed, required answers and invalid options',()=>{
 for(const patch of [{consent:false},{adultConfirmed:false},{topicSeed:-1},{topicSeed:1.5},{topicSeed:4294967296},{version:6}])assert.ok(validateSubmission({...body(),...patch},M).error);
 for(const [id,value] of [['life-context','employed'],['feelings',['curious','curious']],['feelings',['curious','hopeful','excited','reassured']],['benefits',['none','time']],['pace',45],['builders','x'.repeat(4001)],['country','FAKE']]){const b=body();b.responses[id]=value;assert.ok(validateSubmission(b,M).error,id);}
 const b=body();delete b.responses.pace;assert.ok(validateSubmission(b,M).error);b.responses.pace='right';b.responses.unknown='bad';assert.ok(validateSubmission(b,M).error);
});
test('not-shown answers cannot enter report; false quote consent is default',()=>{
 const b=body(3,{'use-frequency':'never','life-context':null});b.responses.uses=['work'];const r=validateSubmission(b,M).record;assert.ok(!Object.hasOwn(r.responses,'uses'));assert.equal(r.research_metadata.question_status.uses,'not_shown');assert.equal(r.research_metadata.quote_permission,false);
});
test('exclusive selections and optional skips work, including countries',()=>{
 const q=M.byId.barriers;assert.deepEqual(M.selectMulti(q,['cost'],'none').values,['none']);assert.deepEqual(M.selectMulti(q,['none'],'cost').values,['cost']);assert.equal(M.hasAnswer(M.byId.country,'GB'),true);assert.equal(M.hasAnswer(M.byId.country,null),true);assert.equal(M.hasAnswer(M.byId.pace,null),false);
});
test('every possible route has matched, non-repeating original drawings',()=>{
 const context=vm.createContext({window:{}});for(const f of ['illustrations.js','question-illustrations.js','life-illustrations.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),context);
 const seen=new Set();for(let seed=0;seed<100;seed++){const a=complete(seed),topic=M.allocation(a,seed).module;if(seen.has(topic))continue;seen.add(topic);const keys=M.route(a,seed).map(q=>{const markup=context.window.SurveyArt.render(q.art);assert.ok(markup.includes('data-illustration="'+q.art+'"'),q.id);return q.art;});assert.equal(new Set(keys).size,keys.length,topic);}
});
test('share summaries use direct responses without invented numeric indices',()=>{const r=M.report(complete());assert.deepEqual(r.dimensions,[]);assert.equal(r.perspectives[0][1],'Every day or almost every day');assert.equal(r.perspectives.length,3);});
test('allocation is reasonably spread in a deterministic large sample',()=>{const counts=Object.fromEntries(M.modules.map(m=>[m.id,0]));for(let i=0;i<8000;i++)counts[M.allocation({'life-context':['employed']},i).module]++;for(const n of Object.values(counts))assert.ok(n>850&&n<1150);});
