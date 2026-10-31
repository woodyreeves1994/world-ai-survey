const {test}=require('node:test');
const assert=require('node:assert/strict');
const M=require('../database/legacy-model-v6');

test('all six numeric questions offer five labelled, valid responses',()=>{
  const questions=M.questions.filter(q=>q.type==='slider');
  assert.equal(questions.length,6);
  for(const q of questions){
    assert.deepEqual(q.responseOptions.map(o=>o.value),[0,25,50,75,100]);
    for(const option of q.responseOptions){
      assert.equal(M.hasAnswer(q,option.value),true);
      assert.equal(M.label(q,option.value),option.label);
    }
  }
  assert.equal(M.label(M.byId['self-worth'],75),'Quite a lot');
  assert.match(M.label(M.byId['self-worth'],28),/28 \/ 100/,'Legacy numeric answers remain readable');
});

test('verbal response scores retain relevant follow-ups',()=>{
  const ids=answers=>M.route(answers).map(q=>q.id);
  assert.ok(ids({'keep-up':75}).includes('support'));
  assert.ok(!ids({'keep-up':25}).includes('support'));
  assert.ok(ids({'self-worth':75}).includes('meaning-anchor'));
  assert.ok(ids({truth:25}).includes('truth-support'));
  assert.ok(!ids({truth:75}).includes('truth-support'));
});
