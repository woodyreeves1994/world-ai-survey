# Life with AI — V7 reporting

Questionnaire ID: life-with-ai-2026-10-31. Exact question definitions, option codes and labels are in questionnaire-v7.json and the private world_ai_questionnaire_items table. The additive migration is life-with-ai-v7.sql. Deploy edge-function.ts with survey-model.js, validation.js, legacy-model-v6.js, legacy-validation-v6.js and deno.json. The endpoint continues accepting validated V6 submissions from existing open tabs.

Each V7 record stores raw answers, exact rendered question and option wording, question order, full route, explicit skip states, not-shown states, questionnaire/consent versions, adult confirmation, duration, topic seed, eligible topics, allocation method and assignment probability. The seed is created once per session and remains stable through Back. Editing life context can remove an ineligible work topic; stale answers are discarded. Recent use means daily, several days a week, weekly or less than weekly within 30 days; previous, never and unsure are routed past usage/benefit/drawback questions.

Use world_ai_v7_responses for participant-level cross-tabs and CSV exports. world_ai_v7_answer_breakdown includes zero-count options, labels, shown/answered bases and both percentage definitions. world_ai_v7_question_bases separates skipped from not shown. world_ai_v7_topic_summary shows topic coverage. The readable answers and general breakdown views include survey_version; filter before analysis. Legacy score summaries explicitly remain V6-only.

Interpretation: this is a self-selected public website sample, not a representative world poll. Topic assignment is random among eligible modules, not a random population sample. Work has a different eligible base; stored assignment probabilities support transparent conditional analysis. Do not treat missing modules as negative answers, or unsure / prefer-not-to-answer / no-effect / neutral as interchangeable. Multi-select percentages may exceed 100%. Avoid small-cell demographic claims. Associations are not causal effects; do not compare rewritten V7 questions directly against V6. No invented numeric indices are stored for V7. No completion-duration promise has been validated by a respondent pilot.

Written reflections are private. Public non-identifying quotations require the separate optional checkbox; world_ai_v7_quotable_reflections only includes affirmative permission. Review for identifying content before publication. Email consent is separate and emails are not joined to survey answers. Automated findings email delivery is not configured.

Verification: 29 model/validation/illustration tests plus 12 complete mocked UI routes; private RLS and view privileges checked. Two reserved fixtures (4c3956f4-adc3-444e-9a91-21542e3b72f5 and 73e36cb1-fab8-4162-a278-7f637135b0d0) were inserted with is_test=true before endpoint retry checks. report-verification.sql runs denominator assertions against temporary copies and rolls back. Production test flags never change. Automatic review rejected unflagged synthetic submissions, so no fresh unflagged production submission was used for testing. Existing unrelated Life Wizard function/auth advisories were not changed.

---

# Survey response storage

Results entry point: https://woodyreeves1994.github.io/world-ai-survey/results-admin.html

The existing Life Wizard Supabase project hosts separate `world_ai_*` objects. Apply `schema.sql`, followed by `readable-answers.sql` and `completed-responses.sql`, when recreating this setup. Actual applied migrations are recorded in Supabase.

- `world_ai_responses`: the raw submission, server-recomputed result indices, timestamp, consent timestamp, version and receipt.
- `world_ai_answers`: readable questions and answers, excluding test records.
- `world_ai_results_summary`: submission totals, activity and average indices, excluding test records.
- `world_ai_answer_counts`: answer distributions with an answered-question denominator; multi-select percentages can exceed 100.

Participants explicitly choose whether to contribute. They can view their personal results without sending any answers. Submissions are validated and scored again on the server. Retrying a receipt cannot create a second row. Anonymous clients and ordinary Life Wizard app users have no table read or direct insert privileges. Supabase Studio is the private viewing interface for project members with database access.

`world-ai-submit` is the only public write endpoint. Its platform JWT check is disabled because respondents do not sign in; the function itself checks the publishable app key, allowed browser origin, consent, payload size and answer validity. Per-actor submission limits are checked atomically. Rate-limit identifiers are daily HMAC hashes; raw IP addresses are not stored in the survey tables. Publishable keys identify the app and are intentionally public. Privileged credentials remain in Supabase’s Edge runtime.

## Verification

## Optional findings email list

The finish screen offers a separate, unchecked opt-in for one email with the study findings. `world-ai-results-signup` validates the email and consent, checks that the supplied survey receipt exists, applies the existing private rate limiter, and inserts a unique normalised email. Emails are stored in `world_ai_results_subscribers` without a receipt or response link. Client reads and direct writes are revoked, and RLS is enabled. `world_ai_results_email_list` is the private Studio/export view; it excludes test signups. Repeated signup requests are idempotent.

This collects a private mailing list; it does not send emails or configure an email delivery provider. Export the list when the collective findings are ready and send the promised study update. The reserved `example.invalid` QA address is marked as a test and excluded from the export view.

The submission screen requires explicit answer-sharing consent. The former private-results shortcut has been removed. A failed submission retains the answers and receipt for retry; it never claims that the contribution was saved.

The live API accepted a valid test submission and its retry, stored one row, and rejected missing consent, another origin, an invalid app key and an oversized body. Anonymous reads were rejected. Database privilege checks also denied reads to ordinary authenticated app users. Test rows are excluded from summary views.

Run local model and validation checks with `node --test tests/*.test.js`.

## Existing Life Wizard advisories

The project’s advisor also reported existing functions unrelated to the survey. Review them as a separate Life Wizard maintenance task:

- [Function search path](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable): `touch_household_member_updated_at`.
- [Anonymous execution of privileged functions](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable) and [authenticated execution](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable): the existing household/vault access helpers and trial subscription helper.
- [Leaked password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection): currently disabled in the existing project.

The survey uses neither those helpers nor Life Wizard user authentication. Its new records are protected by separate grants and row security.
