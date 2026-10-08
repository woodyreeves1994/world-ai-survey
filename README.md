# Human / AI — The World AI Survey

## V4 deployment

Live survey: https://woodyreeves1994.github.io/world-ai-survey/

This repository publishes the HTML, CSS, and JavaScript from `world-ai-survey-v4.zip` unchanged. GitHub Pages serves the root of the default branch; `.nojekyll` disables Jekyll processing. Push site updates to that branch to republish.

Responses and result calculations stay in the participant's browser. Participants can download their responses as JSON; there is no central response collection service.

The original archive documentation follows.

A cinematic, adaptive survey prototype exploring the psychological and social experience of rapid AI acceleration.

## V3 changes
- Expanded from 12 surface-level questions to a 55-question research bank.
- Participants see roughly 38–45 questions depending on branching.
- New themes: acceleration, work, self-worth, intelligence, usefulness, autonomy, dependency, creativity, relationships, loneliness, truth, memory, grief, power, difficulty, meaning and future expectations.
- Uses trade-offs, forced choices, spectra, scenarios, multi-selects and written reflections rather than relying on standard agreement scales.
- Answer selection updates in place, so choosing an option no longer re-renders or flashes the full scene.
- New SVG editorial illustrations and animation system.
- Dynamic high-contrast header/progress treatment for light and dark scenes.
- Reduced-motion support via OS preference and manual toggle.
- Strong keyboard focus, skip link, live announcements, Enter-to-continue and Escape-to-go-back.
- Compact desktop layouts target one-question-per-viewport on standard laptop displays; mobile prioritises readability and permits vertical overflow where needed.
- Results are expressed as tensions rather than a simplistic optimist/pessimist label.

## Run
Open `index.html` directly in a modern browser. No build process is required.

## Production recommendations
For a public study, move the prototype to React/Next.js and store anonymous responses in a properly consented research backend. Add sampling controls, localisation, demographic weighting, privacy notices, research ethics review, analytics, resilience for partial responses, and a live results/report layer.
