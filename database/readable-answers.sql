alter table public.world_ai_responses add column answer_atlas jsonb not null default '[]'::jsonb check (jsonb_typeof(answer_atlas)='array');
create policy world_ai_limits_no_client_reads on world_ai_private.submission_limits for select to anon,authenticated using(false);
create view public.world_ai_answers with(security_invoker=true) as
select r.receipt,r.received_at,q.value->>'id' as question_id,q.value->>'question' as question,q.value->>'answer' as answer,(q.value->>'skipped')::boolean as skipped
from public.world_ai_responses r cross join lateral jsonb_array_elements(r.answer_atlas) q where not r.is_test;
revoke all on public.world_ai_answers from public,anon,authenticated;
grant select on public.world_ai_answers to service_role;
