# Human / AI — The World AI Survey

[Open the survey](https://woodyreeves1994.github.io/world-ai-survey/) · [View study results](https://woodyreeves1994.github.io/world-ai-survey/results-admin.html)

## Visual release 7

Solid midnight blue, vertically centred questions, Libre Caslon Text headings and Roboto controls. Seventeen original ink drawings are traced into editable SVG paths, with coral accents and subtle detail animation. See [ARTWORK.md](ARTWORK.md) for the drawing workflow and font choice. Adaptive routing and richer personal results are retained: a 28-question bank produces routes of 18–28 questions. The data protocol remains version 6.

## Response collection

At the end, participants choose whether to submit their answers and optional reflection, or view their personal results privately. The submission endpoint validates every active question, recomputes the result indices, and saves to separate `world_ai_*` tables in the existing Life Wizard Supabase project. Retrying a submission reference does not create a second record.

The [results page](https://woodyreeves1994.github.io/world-ai-survey/results-admin.html) links to private Supabase tables for completed submissions, readable answers, a study summary, and per-question answer counts. Sign in with a Supabase account that has access to the project. Records are not available to public survey visitors or ordinary Life Wizard app users. Responses from older browser-only versions were never collected centrally.

Database setup, access checks, and existing Life Wizard security advisories are documented in [database/README.md](database/README.md).

## Run and check

This is a static site with no browser JavaScript dependencies. Serve this folder with a static HTTP server. Google Fonts is optional; Georgia and Arial are available as fallbacks.

```sh
node --test tests/*.test.js
```

`survey-model.js` contains the questions, branching and personal results. `database/validation.js` independently validates submissions. `database/edge-function.ts` runs on Supabase; the client uses a publishable app key, while privileged credentials stay in the server runtime.

## Hosting

GitHub Pages serves the root of the existing default branch, `codex/publish-v4`; the branch name is retained from the initial deployment. `.nojekyll` disables Jekyll processing. Push updates to that branch to republish.

Submission and personal results were checked through model tests, DOM integration checks and the live database API. A fresh visual browser check was unavailable because browser access approval timed out.
