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
