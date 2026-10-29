# Ink illustration update

Seventeen original drawings were generated with the built-in image-generation tool, then traced into two-colour SVG contour paths using VTracer. They are inspired by the expressive ink illustrations on the Saltus website; none of the Saltus illustrations or font files are copied into this project.

The full prompt set is in `assets/ink/prompts.json`. Editable standalone SVGs are in `assets/ink/`. `illustrations.js` contains the same paths for synchronous, inline rendering with the site's motion switch. The pace, work-task and conversation scenes reuse the running, desk and tea illustrations respectively. Original raster drawings are included in the downloadable artwork source package.

The colour separation changes navy ink to cream for legibility on the solid midnight background. Coral accents remain. Disconnected water droplets, cup steam and watch hands have separate groups for subtle CSS animation. Every scene has a brief arrival animation and softly varying accent opacity. The manual motion switch and system reduced-motion preference disable animation.

## Typography

Saltus's public CSS specifies TiemposHeadlineWeb for headings and Roboto for body text. The owner selected a free substitute for the licensed headline font: Libre Caslon Text. Roboto is used for body text and controls. Both are loaded from Google Fonts with `display=swap`; Georgia and Arial are fallbacks. A properly licensed Tiempos webfont can be substituted later.

## Layout

The page background is solid `#101f35`; light question themes are disabled. Questions and controls centre vertically in the available viewport space when they fit, and grow naturally when their content needs scrolling. Mobile artwork sits below the controls to keep the answer targets prominent.

The data protocol remains version 6; this is a visual release, displayed as Survey 07. No response schema or scoring changes.
# Release 12 additions

The existing 17 illustrations are preserved. Eleven new original drawings replace repeated uses: pace, work changes, work fairness, replacement worries, support, missed tools, sources of pressure, memory boundaries, checking sources, public priorities, and purpose. Their generation prompts are in `assets/ink/question-prompts-v12.json`; the editable two-colour paths are `assets/ink/q-*.svg`. `question-illustrations.js` maps only those eleven question IDs. The remaining questions retain their existing artwork.
