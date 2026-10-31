const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
const M=require('../database/legacy-model-v6');
test('all 28 questions have distinct drawings, with only 11 replacements',()=>{
  const context=vm.createContext({window:{}});
  for(const file of ['illustrations.js','question-illustrations.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
  const art=context.window.SurveyArt;
  const keys=M.questions.map(q=>art.render(art.questionKey(q.id)||q.art).match(/data-illustration="([^"]+)"/)[1]);
  assert.equal(new Set(keys).size,28);
  assert.equal(keys.filter(k=>k.startsWith('q-')).length,11);
  assert.equal(keys[M.questions.findIndex(q=>q.id==='human-boundary')],'tea');
  assert.equal(keys[M.questions.findIndex(q=>q.id==='grief')],'memory');
  assert.equal(keys[M.questions.findIndex(q=>q.id==='future')],'garden');
});
