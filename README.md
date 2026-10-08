# Human / AI — The World Survey

Live site: https://woodyreeves1994.github.io/world-ai-survey/

## Edition 05

A warm editorial survey with responsive controls and twenty original cartoon SVG scenes. Illustrations show everyday objects and people connected to the question; animation is gentle, optional, and respects reduced-motion preferences.

The question bank contains 28 questions. Each person follows a route of 18–28 questions based on their circumstances and previous answers. Seven focused follow-ups explore work pressure, support, reliance, choice, memory, trust, and meaning. Changing an earlier answer removes follow-up answers that no longer belong on the route. Multi-select questions have explicit limits, and “none” options are exclusive. The memory question and final written reflection can be skipped.

Results include four descriptive indices with transparent calculations and answer evidence, a personalised introduction, relevant tensions, chosen boundaries and priorities, a desired future, and a complete answer atlas. Participants can download the fieldnotes as JSON or print them. These indices are reflections, not validated psychological scales or diagnoses.

## Run and verify

No build process or external JavaScript dependencies are required. Open `index.html` or serve this folder with a static HTTP server.

Run the branching and results checks with:

```sh
node --test tests/survey-model.test.js
```

## Files

- `index.html` — page structure and font loading
- `styles.css` — editorial layout, responsive controls, motion and print styles
- `survey-model.js` — question bank, branching, answer validation and results
- `illustrations.js` — twenty native SVG scenes
- `app.js` — accessible interactions, navigation, fieldnotes and exports

## Hosting and data

GitHub Pages serves the root of the default branch, `codex/publish-v4`. The branch name is retained from the original V4 deployment. `.nojekyll` disables Jekyll processing; pushing updates to the branch republishes the site.

Answers are held in browser memory only. They are not uploaded, persisted after reloading, or collected centrally. Google Fonts is the only external resource; the interface has local serif and sans-serif fallbacks. Collecting study responses would require a separate backend and appropriate participant information.