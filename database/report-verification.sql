-- Uses isolated temporary copies only. Production test flags never change.
begin;
create temporary table verification_responses as select * from public.world_ai_responses
where receipt in ('4c3956f4-adc3-444e-9a91-21542e3b72f5','73e36cb1-fab8-4162-a278-7f637135b0d0') and is_test;
update verification_responses set is_test=false;
do $$
declare definition text; n bigint;
begin
 if (select count(*) from verification_responses)<>2 then raise exception 'Missing reserved fixtures'; end if;
 definition:=pg_get_viewdef('public.world_ai_v7_question_bases'::regclass,true);
 definition:=replace(replace(definition,'public.world_ai_responses','pg_temp.verification_responses'),'FROM world_ai_responses','FROM pg_temp.verification_responses');
 definition:=replace(definition,'JOIN world_ai_responses','JOIN pg_temp.verification_responses');
 execute 'create temporary view verification_bases as '||definition;
 definition:=pg_get_viewdef('public.world_ai_v7_answer_breakdown'::regclass,true);
 definition:=replace(replace(definition,'public.world_ai_responses','pg_temp.verification_responses'),'FROM world_ai_responses','FROM pg_temp.verification_responses');
 definition:=replace(replace(definition,'public.world_ai_v7_question_bases','pg_temp.verification_bases'),'JOIN world_ai_v7_question_bases','JOIN pg_temp.verification_bases');
 execute 'create temporary view verification_breakdown as '||definition;
 if not exists(select from verification_bases where question_id='uses' and shown=1 and answered=1 and not_shown=1) then raise exception 'Wrong recent-user denominator'; end if;
 if not exists(select from verification_bases where question_id='country' and shown=2 and skipped=2 and answered=0) then raise exception 'Wrong optional skip denominator'; end if;
 if not exists(select from verification_breakdown where question_id='feelings' and answer_code='curious' and response_count=2 and percent_of_answered=100) then raise exception 'Wrong multi-select count'; end if;
 if not exists(select from verification_breakdown where question_id='health-worry' and shown=0 and percent_of_answered is null) then raise exception 'Missing empty-topic handling'; end if;
 select count(*) into n from public.world_ai_v7_responses where receipt in ('4c3956f4-adc3-444e-9a91-21542e3b72f5','73e36cb1-fab8-4162-a278-7f637135b0d0');
 if n<>0 then raise exception 'QA records leaked into research view'; end if;
end $$;
rollback;
