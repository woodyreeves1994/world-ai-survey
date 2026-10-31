begin;
alter table public.world_ai_responses drop constraint world_ai_responses_survey_version_check;
alter table public.world_ai_responses add constraint world_ai_responses_survey_version_check check(survey_version in (6,7));
alter table public.world_ai_responses drop constraint world_ai_responses_indices_check;
alter table public.world_ai_responses add constraint world_ai_responses_indices_check check(jsonb_typeof(indices)='object' and (survey_version=7 or indices ?& array['pressure','reliance','ownership','presence']));
alter table public.world_ai_responses add column research_metadata jsonb not null default '{}'::jsonb check(jsonb_typeof(research_metadata)='object');
comment on table public.world_ai_responses is 'Private consented responses. V6 legacy questionnaire; V7 Life with AI. Compare only within questionnaire version. Tests are excluded from research views.';
create table public.world_ai_questionnaire_items (
 survey_version smallint not null, question_id text not null, definition jsonb not null,
 primary key(survey_version,question_id), check(jsonb_typeof(definition)='object')
);
alter table public.world_ai_questionnaire_items enable row level security;
revoke all on public.world_ai_questionnaire_items from public,anon,authenticated;
grant select,insert,update on public.world_ai_questionnaire_items to service_role;
create policy questionnaire_no_client_reads on public.world_ai_questionnaire_items for select to anon,authenticated using(false);

-- Keep the original summary explicitly legacy-only. Do not mix unrelated scores.
create or replace view public.world_ai_results_summary with(security_invoker=true) as
select count(*) as total_responses,
 count(*) filter(where received_at>=now()-interval '24 hours') as responses_last_24h,
 round(avg(duration_seconds)::numeric/60,1) as average_minutes,
 round(avg((indices->>'pressure')::numeric),1) as average_change_pressure,
 round(avg((indices->>'reliance')::numeric),1) as average_reliance,
 round(avg((indices->>'ownership')::numeric),1) as average_decision_ownership,
 round(avg((indices->>'presence')::numeric),1) as average_human_presence,
 min(received_at) as first_response,max(received_at) as latest_response
from public.world_ai_responses where not is_test and survey_version=6;
create or replace view public.world_ai_completed_responses with(security_invoker=true) as
select receipt,received_at,consented_at,survey_version,duration_seconds,answer_count,responses,answer_atlas,route,indices,result_title,research_metadata
from public.world_ai_responses where not is_test;
create or replace view public.world_ai_answers with(security_invoker=true) as
select r.receipt,r.received_at,q.value->>'id' as question_id,q.value->>'question' as question,q.value->>'answer' as answer,
 (q.value->>'skipped')::boolean as skipped,r.survey_version,q.value->>'module' as topic_module,q.value->'value' as raw_answer
from public.world_ai_responses r cross join lateral jsonb_array_elements(r.answer_atlas) q where not r.is_test;
create or replace view public.world_ai_answer_counts with(security_invoker=true) as
with base as (
 select r.receipt,r.survey_version,e.key as question_id,e.value from public.world_ai_responses r
 cross join lateral jsonb_each(r.responses) e where not r.is_test and e.value<>'null'::jsonb and e.key<>'builders'
), denominators as (
 select survey_version,question_id,count(*) as respondents_for_question from base group by survey_version,question_id
), options as (
 select survey_version,question_id,option.value #>> '{}' as answer from base
 cross join lateral jsonb_array_elements(case when jsonb_typeof(base.value)='array' then base.value else jsonb_build_array(base.value) end) option
)
select o.question_id,o.answer,count(*) as response_count,d.respondents_for_question,
 round(100.0*count(*)/d.respondents_for_question,1) as percentage,o.survey_version
from options o join denominators d using(survey_version,question_id) group by o.survey_version,o.question_id,o.answer,d.respondents_for_question;

create view public.world_ai_v7_responses with(security_invoker=true) as
select receipt,received_at,consented_at,duration_seconds,answer_count,
 research_metadata->>'questionnaire' as questionnaire,
 research_metadata->'allocation'->>'module' as topic_module,
 (research_metadata->'allocation'->>'probability')::numeric as topic_probability,
 research_metadata->'allocation'->'eligible' as eligible_topics,
 responses->>'country' as country,responses->>'age' as age_group,responses->'life-context' as life_context,
 responses->>'finances' as household_finances,responses->>'use-frequency' as use_frequency,
 responses->>'personal-now' as personal_effect_now,responses->>'personal-future' as personal_expectation,
 responses->>'society-future' as society_expectation,
 (research_metadata->>'quote_permission')::boolean as quote_permission,
 responses,answer_atlas,route,research_metadata
from public.world_ai_responses where survey_version=7 and not is_test;

create view public.world_ai_v7_question_bases with(security_invoker=true) as
select c.question_id,c.definition->>'title' as question,c.definition->>'module' as topic_module,
 count(r.receipt) as total_submissions,
 count(r.receipt) filter(where c.question_id=any(r.route)) as shown,
 count(r.receipt) filter(where c.question_id=any(r.route) and r.responses->c.question_id='null'::jsonb) as skipped,
 count(r.receipt) filter(where c.question_id=any(r.route) and r.responses->c.question_id<>'null'::jsonb) as answered,
 count(r.receipt) filter(where not(c.question_id=any(r.route))) as not_shown
from public.world_ai_questionnaire_items c left join public.world_ai_responses r on r.survey_version=7 and not r.is_test
where c.survey_version=7 group by c.question_id,c.definition;

create view public.world_ai_v7_answer_breakdown with(security_invoker=true) as
with selections as (
 select r.receipt,a.key as question_id,v.value #>> '{}' as value from public.world_ai_responses r
 cross join lateral jsonb_each(r.responses) a
 cross join lateral jsonb_array_elements(case when jsonb_typeof(a.value)='array' then a.value else jsonb_build_array(a.value) end) v
 where r.survey_version=7 and not r.is_test and a.value<>'null'::jsonb and a.key<>'builders'
)
select c.question_id,c.definition->>'title' as question,opt.value->>'value' as answer_code,opt.value->>'label' as answer,
 count(s.receipt) as response_count,b.shown,b.skipped,b.answered,
 round(100.0*count(s.receipt)/nullif(b.answered,0),1) as percent_of_answered,
 round(100.0*count(s.receipt)/nullif(b.shown,0),1) as percent_of_shown
from public.world_ai_questionnaire_items c
cross join lateral jsonb_array_elements(c.definition->'options') opt
join public.world_ai_v7_question_bases b on b.question_id=c.question_id
left join selections s on s.question_id=c.question_id and s.value=opt.value->>'value'
where c.survey_version=7 group by c.question_id,c.definition,opt.value,b.shown,b.skipped,b.answered;

create view public.world_ai_v7_topic_summary with(security_invoker=true) as
select research_metadata->'allocation'->>'module' as topic_module,count(*) as completed_responses,
 round(avg(duration_seconds)/60.0,1) as average_minutes,
 min(received_at) as first_response,max(received_at) as latest_response
from public.world_ai_responses where survey_version=7 and not is_test group by research_metadata->'allocation'->>'module';

create view public.world_ai_v7_quotable_reflections with(security_invoker=true) as
select receipt,received_at,responses->>'builders' as reflection
from public.world_ai_responses where survey_version=7 and not is_test
 and research_metadata->>'quote_permission'='true' and jsonb_typeof(responses->'builders')='string';
comment on view public.world_ai_v7_quotable_reflections is 'Permission for non-identifying excerpts only. Review and remove identifying details before publication.';
revoke all on public.world_ai_v7_responses,public.world_ai_v7_question_bases,public.world_ai_v7_answer_breakdown,public.world_ai_v7_topic_summary,public.world_ai_v7_quotable_reflections from public,anon,authenticated;
grant select on public.world_ai_v7_responses,public.world_ai_v7_question_bases,public.world_ai_v7_answer_breakdown,public.world_ai_v7_topic_summary,public.world_ai_v7_quotable_reflections to service_role;
commit;
