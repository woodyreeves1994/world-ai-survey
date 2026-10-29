create table public.world_ai_results_subscribers (
  email text primary key check (length(email) between 3 and 254 and email = lower(btrim(email))),
  consented_at timestamptz not null default now(),
  consent_version text not null default 'study_findings_v1',
  is_test boolean not null default false
);
alter table public.world_ai_results_subscribers enable row level security;
revoke all on public.world_ai_results_subscribers from public,anon,authenticated;
grant select,insert,delete on public.world_ai_results_subscribers to service_role;
create policy world_ai_subscribers_no_client_reads on public.world_ai_results_subscribers for select to anon,authenticated using(false);
create view public.world_ai_results_email_list with (security_invoker=true) as
select email,consented_at,consent_version from public.world_ai_results_subscribers where not is_test;
revoke all on public.world_ai_results_email_list from public,anon,authenticated;
grant select on public.world_ai_results_email_list to service_role;
comment on table public.world_ai_results_subscribers is 'Optional opt-in for one World AI Survey findings email. Kept separately from answers, with no response receipt or identity link. No automated email delivery is configured.';
