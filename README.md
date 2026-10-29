# Telescopic — The AI survey

[Open Telescopic](https://woodyreeves1994.github.io/world-ai-survey/) · [Open the AI survey](https://woodyreeves1994.github.io/world-ai-survey/survey.html) · [View study results](https://woodyreeves1994.github.io/world-ai-survey/results-admin.html)

## Telescopic landing page

Visual release 9 introduces the Telescopic wordmark and optical symbol, a plain progress line, and a minimal copyright/Home footer. Question chapter badges, branch labels and illustration captions have been removed. Accessible progress announcements, motion controls, question routing and consent remain available.

The home page introduces the purpose of the survey series: helping people feel less alone through shared understanding of life changes. A large, fully clickable card opens the first AI survey at `survey.html`. `landing.css` and `landing.js` provide the responsive layout and accessible motion control. Add future surveys as links inside the existing `surveys` section; only the available AI survey is currently listed. The AI survey introduction uses the same welcoming purpose. Existing question routing, results and response collection are unchanged.

The landing page was verified live at 1280×720 and 390×844, including card navigation, starting the survey, returning to the collection, and switching animation off. The full card fits the compact desktop viewport. Neither layout has horizontal overflow; no browser errors were reported. All seven existing DOM submission/consent integration checks passed using the new `survey.html` entry point.

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

The visual release was checked on the live site at 1280×720, 1440×900 and 390×844. The complete 18-question mobile route reached private results without horizontal overflow or browser errors. The body background has no image or gradient throughout. Desktop question centring and the manual motion switch were verified. Fourteen model/submission tests and seven DOM integration checks passed. Database behaviour is unchanged from the previously verified version 6 integration; the visual checks did not submit test answers to the study.
