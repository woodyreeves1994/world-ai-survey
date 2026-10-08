const { test } = require('node:test');
const assert = require('node:assert/strict');
const M = require('../survey-model');
const ids = a => M.route(a).map(q => q.id);

test('work routes distinguish employment, study and neither', () => {
  for (const context of ['neither', 'private']) {
    assert.ok(!ids({context}).includes('work-changed'));
    assert.ok(!ids({context}).includes('replace-worry'));
    assert.ok(!ids({context}).includes('one-day-week'));
  }
  assert.ok(ids({context: 'studying'}).includes('work-changed'));
  assert.ok(!ids({context: 'studying'}).includes('replace-worry'));
  assert.ok(ids({context: 'working'}).includes('replace-worry'));
});
test('follow-ups activate on relevant answers, including the boundary values', () => {
  const a = {context: 'working', 'work-changed': ['output'], feelings: ['anxiety'], dependency: 'much', agency: 'pressure', grief: 'unsure', truth: 45, meaning: 55};
  for (const id of ['work-pressure', 'support', 'missed-tools', 'pressure-source', 'memory-boundary', 'truth-support', 'meaning-anchor']) assert.ok(ids(a).includes(id), id);
  assert.ok(!ids({truth: 46, meaning: 54, 'keep-up': 64}).includes('truth-support'));
  assert.ok(!ids({truth: 46, meaning: 54, 'keep-up': 64}).includes('support'));
  assert.ok(ids({'keep-up': 65}).includes('support'));
  assert.ok(ids({'self-worth': 65}).includes('meaning-anchor'));
});
test('changing an upstream answer removes now-irrelevant answers transitively', () => {
  const changed = M.reconcile({context: 'neither', 'work-changed': ['output'], 'work-pressure': ['security'], 'replace-worry': 'machine', 'one-day-week': 'more', feelings: ['hope'], support: ['slower'], dependency: 'none', 'missed-tools': ['coding'], grief: null, 'memory-boundary': ['consent'], truth: 90, 'truth-support': 'labels'});
  assert.deepEqual(Object.keys(changed).sort(), ['context', 'dependency', 'feelings', 'grief', 'truth']);
});
test('limited selections reject an extra answer and allow deselection', () => {
  const q = M.byId.feelings;
  assert.deepEqual(M.selectMulti(q, ['hope', 'fear', 'curiosity'], 'anxiety'), {values: ['hope', 'fear', 'curiosity'], limited: true});
  assert.deepEqual(M.selectMulti(q, ['hope', 'fear', 'curiosity'], 'fear').values, ['hope', 'curiosity']);
  assert.equal(M.hasAnswer(q, ['hope', 'fear', 'curiosity', 'anxiety']), false);
});
test('none answers are exclusive in both directions, unlimited selections stay unlimited', () => {
  const q = M.byId['human-boundary'];
  assert.deepEqual(M.selectMulti(q, ['doctor', 'teacher'], 'none').values, ['none']);
  assert.deepEqual(M.selectMulti(q, ['none'], 'doctor').values, ['doctor']);
  const all = q.options.filter(o => o.value !== 'none').map(o => o.value);
  assert.equal(M.hasAnswer(q, all), true);
  assert.equal(M.hasAnswer(q, [...all, 'none']), false);
});
test('only optional questions accept a skip; missing slider values stay missing', () => {
  assert.equal(M.hasAnswer(M.byId.grief, null), true);
  assert.equal(M.hasAnswer(M.byId.builders, null), true);
  assert.equal(M.hasAnswer(M.byId.pace, null), false);
  assert.equal(M.hasAnswer(M.byId.truth, undefined), false);
  assert.equal(M.hasAnswer(M.byId.truth, 0), true);
  assert.equal(M.hasAnswer(M.byId.truth, 100), true);
  assert.equal(M.hasAnswer(M.byId.truth, 101), false);
  assert.ok(M.report({}).dimensions.every(d => d.value === null));
});
test('indices preserve direction, zero values, and meaningful evidence', () => {
  const low = M.report({pace: 'slow', 'keep-up': 0, dependency: 'none', 'choice-vs-control': 0, 'human-boundary': ['none'], 'art-value': 'feeling'});
  assert.deepEqual(low.dimensions.map(d => d.value), [0, 0, 0, 0]);
  const high = M.report({pace: 'danger', 'keep-up': 100, dependency: 'essential', 'choice-vs-control': 100, 'human-boundary': ['doctor', 'therapist', 'teacher', 'manager', 'adviser', 'collaborator', 'partner'], 'art-value': 'authorship'});
  assert.deepEqual(high.dimensions.map(d => d.value), [100, 100, 100, 100]);
  assert.ok(high.dimensions.every(d => d.explanation && d.source.length));
});
test('the report changes with answers and acknowledges mixed emotions', () => {
  const mixed = M.report({feelings: ['hope', 'anxiety'], dependency: 'much', agency: 'little', 'choice-vs-control': 90});
  assert.match(mixed.title, /Hope/);
  assert.ok(mixed.tensions.some(t => t.title === 'Possibility & unease'));
  assert.ok(mixed.tensions.some(t => t.title === 'Useful, but not entirely optional'));
  const different = M.report({pace: 'danger', 'keep-up': 90, feelings: ['fear']});
  assert.notEqual(different.title, mixed.title);
});
