create schema if not exists world_ai_private;
revoke all on schema world_ai_private from public, anon, authenticated;
grant usage on schema world_ai_private to service_role;
create table public.world_ai_responses (
  receipt uuid primary key,
  received_at timestamptz not null default now(),
  consented_at timestamptz not null default now(),
  survey_version smallint not null check (survey_version = 6),
  duration_seconds integer check (duration_seconds between 0 and 86400),
  answer_count smallint not null check (answer_count between 1 and 28),
  responses jsonb not null check (jsonb_typeof(responses) = 'object' and octet_length(responses::text) <= 30000),
  route text[] not null check (cardinality(route) between 18 and 28),
  indices jsonb not null check (jsonb_typeof(indices) = 'object' and indices ?& array['pressure','reliance','ownership','presence']),
  result_title text not null,
  is_test boolean not null default false
);
create index world_ai_responses_received_idx on public.world_ai_responses(received_at desc) where is_test = false;
alter table public.world_ai_responses enable row level security;
revoke all on public.world_ai_responses from public, anon, authenticated;
grant select, insert, update, delete on public.world_ai_responses to service_role;
create policy world_ai_responses_no_client_reads on public.world_ai_responses for select to anon, authenticated using (false);
create table world_ai_private.submission_limits (
  actor_hash text not null check (length(actor_hash) = 64),
  window_start timestamptz not null,
  hits integer not null default 1,
  primary key (actor_hash, window_start)
);
alter table world_ai_private.submission_limits enable row level security;
revoke all on world_ai_private.submission_limits from public, anon, authenticated;
grant select, insert, update, delete on world_ai_private.submission_limits to service_role;
create function public.world_ai_consume_limit(p_actor text) returns boolean language sql volatile security invoker set search_path = '' as $$
  with hit as (
    insert into world_ai_private.submission_limits(actor_hash,window_start,hits)
    values(p_actor,date_bin(interval '15 minutes',now(),timestamptz '2000-01-01'),1)
    on conflict(actor_hash,window_start) do update set hits=world_ai_private.submission_limits.hits+1
    returning hits
  ) select max(hits)<=12 from hit;
$$;
revoke all on function public.world_ai_consume_limit(text) from public, anon, authenticated;
grant execute on function public.world_ai_consume_limit(text) to service_role;
create view public.world_ai_results_summary with (security_invoker = true) as
select count(*) as total_responses,
 count(*) filter (where received_at >= now()-interval '24 hours') as responses_last_24h,
 round(avg(duration_seconds)::numeric/60,1) as average_minutes,
 round(avg((indices->>'pressure')::numeric),1) as average_change_pressure,
 round(avg((indices->>'reliance')::numeric),1) as average_reliance,
 round(avg((indices->>'ownership')::numeric),1) as average_decision_ownership,
 round(avg((indices->>'presence')::numeric),1) as average_human_presence,
 min(received_at) as first_response, max(received_at) as latest_response
from public.world_ai_responses where not is_test;
create view public.world_ai_answer_counts with (security_invoker = true) as
with base as (
 select r.receipt,e.key as question_id,e.value
 from public.world_ai_responses r cross join lateral jsonb_each(r.responses) e
 where not r.is_test and e.value<>'null'::jsonb and e.key<>'builders'
), denominators as (
 select question_id,count(*) as respondents_for_question from base group by question_id
), options as (
 select question_id, option.value #>> '{}' as answer
 from base cross join lateral jsonb_array_elements(case when jsonb_typeof(base.value)='array' then base.value else jsonb_build_array(base.value) end) option
)
select o.question_id,o.answer,count(*) as response_count,d.respondents_for_question,
 round(100.0*count(*)/d.respondents_for_question,1) as percentage
from options o join denominators d using(question_id)
group by o.question_id,o.answer,d.respondents_for_question;
revoke all on public.world_ai_results_summary,public.world_ai_answer_counts from public,anon,authenticated;
grant select on public.world_ai_results_summary,public.world_ai_answer_counts to service_role;
comment on table public.world_ai_responses is 'World AI Survey V6. Server-validated, consented submissions only. Read in Supabase Studio; no public or app-user read privileges.';
comment on view public.world_ai_answer_counts is 'Counts per answered question. Multi-select percentages can sum to more than 100. Test submissions and written reflections are excluded.';
