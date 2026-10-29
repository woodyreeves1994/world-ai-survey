(function(root) {
  'use strict';
  function validateSubmission(body, model) {
    if (!body || body.version !== 6 || body.consent !== true) return {error:'Consent is required.'};
    if (typeof body.receipt !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.receipt)) return {error:'Invalid submission reference.'};
    if (!body.responses || Array.isArray(body.responses) || typeof body.responses !== 'object') return {error:'Invalid responses.'};
    if (Object.keys(body.responses).some(id => !Object.hasOwn(model.byId,id))) return {error:'Unknown question.'};
    const answers=model.reconcile(body.responses);
    const route=model.route(answers);
    for (const q of route) {
      const answer=answers[q.id];
      if (!model.hasAnswer(q,answer)) return {error:'Please complete the questions on your route.'};
      if (q.type==='text' && typeof answer==='string' && answer.length>4000) return {error:'Your reflection is too long.'};
      if (q.type==='slider' && !Number.isInteger(answer)) return {error:'Invalid slider answer.'};
      if (Array.isArray(answer) && new Set(answer).size!==answer.length) return {error:'Duplicate selections.'};
    }
    const report=model.report(answers);
    return {record:{receipt:body.receipt,survey_version:6,duration_seconds:Number.isInteger(body.durationSeconds)?Math.max(0,Math.min(86400,body.durationSeconds)):null,answer_count:route.filter(q=>answers[q.id]!==null).length,responses:answers,answer_atlas:route.map(q=>({id:q.id,question:q.title,answer:model.label(q,answers[q.id]),skipped:answers[q.id]===null})),route:route.map(q=>q.id),indices:Object.fromEntries(report.dimensions.map(d=>[d.key,d.value])),result_title:report.title,is_test:false}};
  }
  if (typeof module!=='undefined'&&module.exports) module.exports={validateSubmission};
  else root.WorldAISubmissionValidation={validateSubmission};
})(typeof window!=='undefined'?window:globalThis);
