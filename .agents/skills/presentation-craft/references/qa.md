# QA, delivery, and file hygiene

The deck is not done when the last slide is built. It is done when the rendered deck passes the tests below.

## The review loop

1. **Render every slide** to an image or PDF. Do not review in the authoring view.
2. **Inspect fresh.** Look at the rendered output, not the source. If possible, have someone else or a subagent review it without seeing the construction.
3. **List defects by severity:** content, legibility, alignment, polish. Fix the content and legibility first.
4. **Fix in the source**, not by hand-editing the exported file.
5. **Re-render only the changed slides**, then do a final full pass.
6. **Stop when no user-visible defect remains.** Do not keep polishing after the deck is clear and clean.

The most common defect is text overflow or text cut off at a box or slide boundary. Check it first.

## The tests

### Title-only test

Read only the slide titles, in order. Do they tell a complete argument? If not, fix the ghost deck.

### Three-second test

Show each slide for three seconds. Can a viewer state its point? If not, the hierarchy or the title is weak.

### Squint test

Squint at the slide. The most important element should still dominate. If everything blurs into equal weight, increase contrast or remove elements.

### Thumbnail test

View the whole deck as thumbnails. It should look like one system: consistent margins, type, color, and motif, with enough layout variety to avoid monotony.

### Back-of-the-room test

Stand several feet from the screen, or view at 50% zoom. If you cannot read the smallest text, it is too small.

### Grayscale test

Turn off color. The hierarchy, labels, and chart distinctions should still make sense. If not, color is doing too much work.

### Timer test

Rehearse aloud with a timer. If you run over, cut slides or words. Do not speed up.

### Projector test

Test on the actual projector or display if possible. Contrast, color, and font rendering can change. Have a PDF backup.

### Sound-off test

For recorded or virtual decks, watch with the sound off. The slides should still communicate the structure and key points.

## Content QA

- [ ] The throughline is stated in one sentence.
- [ ] Each slide has one idea.
- [ ] Every title is a claim, not a label.
- [ ] The title sequence tells the story.
- [ ] Every factual claim has evidence.
- [ ] Numbers match the source and are traceable.
- [ ] Sources and dates are present.
- [ ] No typos, placeholder text, or unfinished sentences.
- [ ] The order flows; transitions make sense.
- [ ] The talk fits the time; each slide is about a minute or less.
- [ ] The ask or next step is explicit.
- [ ] The appendix covers likely questions.
- [ ] The opening earns attention; the close asks for action.

### Placeholder sweep

Search the rendered text for:

- `lorem`, `ipsum`
- `TODO`, `TBD`, `XXX`
- `[insert`, `click to add`
- `This slide`, `sample text`
- Names of template authors or old clients
- Empty placeholders and unused images

Fix every hit before declaring the deck done.

## Design QA

- [ ] The three-second test passes for every slide.
- [ ] The squint test passes; one element dominates.
- [ ] The thumbnail test passes; the deck looks like one system.
- [ ] Everything aligns to the grid.
- [ ] Margins are at least 0.5".
- [ ] Gaps are consistent: 0.3" or 0.5".
- [ ] No text overflows a box or the slide edge.
- [ ] No overlapping elements.
- [ ] No element sits closer than 0.3" to another unless intentionally grouped.
- [ ] Contrast passes: 4.5:1 body, 3:1 large text and graphics.
- [ ] Fonts are consistent; no accidental fallback.
- [ ] Type sizes follow the scale; no tiny body text.
- [ ] Images are sharp, not stretched, and consistently treated.
- [ ] Icons are one family and labeled where needed.
- [ ] No template artifacts, accent stripes, or decorative bars.
- [ ] No text-only content slides; every content slide has a visual anchor.
- [ ] Layout patterns vary; the system stays constant.
- [ ] Cards and columns are equal height and aligned.
- [ ] The footer or source line does not collide with content.
- [ ] The final slide contains the ask, not "Thank you".

## Data QA

- [ ] The chart type fits the question.
- [ ] The chart title states the insight.
- [ ] The highlighted element is the insight.
- [ ] Axes, units, and scale are correct.
- [ ] Bar charts start at zero.
- [ ] No 3D, bevels, or misleading area.
- [ ] Dual axes are labeled and justified.
- [ ] Source and date are present.
- [ ] Totals add up; percentages sum to 100 where expected.
- [ ] Time ranges are honest and consistent.
- [ ] Outliers and missing data are explained or visible.
- [ ] The table matches the chart.
- [ ] The chart is readable at thumbnail size.
- [ ] There is a data table in the appendix for precision or accessibility.

## Accessibility QA

- [ ] Contrast passes in the actual render.
- [ ] Body text is at least 18 pt for live talks; titles at least 36 pt.
- [ ] Color is not the only carrier of meaning.
- [ ] Every informative image, chart, and diagram has alt text.
- [ ] Video has captions; audio has a transcript.
- [ ] Slide titles are unique and descriptive for screen readers.
- [ ] Reading order is logical.
- [ ] Language is plain; jargon is defined.
- [ ] No flashing or rapid animation.
- [ ] The deck survives the grayscale test.
- [ ] An accessible PDF or alternative is available when needed.

## File QA

- [ ] Text is editable, not an image of text.
- [ ] Charts and tables are native where the tool supports them, or there is a clear reason they are images.
- [ ] Fonts are embedded or known to be installed on the target machine.
- [ ] Images and media are embedded, not linked to local files.
- [ ] Links work.
- [ ] Speaker notes are present and saved.
- [ ] Slide size and aspect ratio are consistent.
- [ ] File size is reasonable for email or upload.
- [ ] Masters and layouts are intact; no broken placeholders.
- [ ] The file opens on a clean machine or a second device.
- [ ] A PDF backup exists.
- [ ] The file is named with a version and date, e.g. `project-deck-v3-2026-10-22.pptx`.
- [ ] The editable master is kept separate from the distribution PDF.

### File hygiene

- Prefer native text, shapes, charts, and tables over screenshots.
- Use the speaker-notes field, not a text box on the slide.
- Embed images and fonts where possible; test the fallback.
- Keep one source of truth for the deck; do not circulate multiple editable versions.
- Export a PDF for review and distribution.
- Test the PDF on a phone and on the target projector.
- If the deck contains video, embed it and provide a backup slide with stills.
- If the deck contains links, check them in the exported PDF.

## Delivery QA

- [ ] Rehearse aloud at least twice.
- [ ] Time the full talk, including transitions.
- [ ] Cut at least 20% of the words or slides after the first rehearsal.
- [ ] Memorize the opening and closing.
- [ ] Practice the transitions between sections.
- [ ] Prepare for the three most likely questions.
- [ ] Build backup slides for detail, data, and objections.
- [ ] Test the projector, adapter, remote, and audio.
- [ ] Have a PDF backup and a local copy.
- [ ] Have a glass of water and a printed outline.
- [ ] Arrive early and test the room.

### Rehearsal method

1. **Run 1:** full talk, no stopping, timer on. Note where you stumble or run long.
2. **Cut:** remove slides, words, and examples that do not serve the throughline.
3. **Run 2:** full talk, timer on. Practice the transitions and the close.
4. **Run 3:** record yourself or present to one person. Watch for filler, pace, and eye contact.
5. **Final:** run the opening and closing until they are natural.

Do not memorize a full script unless the format demands it. Memorize the structure and the first and last sentences.

## Delivery fundamentals

- Stand where you can see both the screen and the audience.
- Make eye contact; do not turn your back to read the slide.
- Speak slower than feels natural, and pause after key points.
- Use gestures to direct attention to the evidence, not to fill silence.
- Vary pace and volume; avoid filler words and repeated throat-clearing.
- Move with purpose; do not pace or sway.
- Hold questions until the end unless the format invites interruption.
- End on the ask, not on "thank you."

## Q&A

- **Repeat the question** in one sentence so the room hears it and you confirm you understood.
- **Answer in one sentence first**, then give evidence. Do not start with a long preamble.
- **Keep answers under 60 seconds.** If the topic needs more, offer to continue after the session.
- **If you do not know,** say so, and say when and how you will follow up. Do not bluff.
- **If the question is hostile,** acknowledge the concern, answer the part you can, and bridge to your evidence.
- **If the question is off-topic,** answer briefly and bridge back to the decision.
- **Use the appendix.** If a detailed chart or table exists, go to it rather than describing it from memory.
- **Watch the time.** Leave 3–5 minutes for questions; do not let one question consume the close.

Prepare the three most likely questions and one backup slide for each.

## Virtual and recorded delivery

- Look at the camera, not the screen, when making the key point.
- Use larger type than a live deck; compression and small windows shrink everything.
- Share a window or a slide show, not your entire desktop.
- Test audio, camera, and screen sharing before the call.
- Turn off notifications and silence your phone.
- Speak slightly slower; pause after key points.
- Provide captions or a transcript when the platform supports it.
- Record a backup version if the live demo might fail.
- For recorded decks, use the sound-off test: the slides should still communicate the structure without narration.

## Working with existing decks and templates

### Audit

1. Extract all text, tables, notes, and comments.
2. Render every slide to an image.
3. List the layouts, masters, fonts, colors, and image treatments.
4. Identify the existing argument: read the titles in order.
5. Find placeholder text, broken links, missing fonts, low-resolution images, and orphaned elements.

### Preserve the system

- Use the template's theme colors, fonts, and layouts.
- Do not introduce a new font or palette unless rebranding is the task.
- Keep the master and layouts intact; edit the slides.
- Match the existing image treatment and icon style.
- Keep the same slide size and aspect ratio.

### Edit content

- Choose the layout that fits the evidence, not the one that happens to be nearby.
- Keep text and charts editable; do not flatten them into images.
- Replace placeholder text; do not leave sample names or old clients.
- When deleting a content block, delete its image, icon, and empty group too.
- If a slide has too much content, split it rather than shrinking below the readable minimum.
- If a template slot does not fit the content (four team members for three people), remove the entire unused group and rebalance the layout.
- Preserve the template's spacing and alignment; do not nudge things by eye.

### Combining and splitting

- **Combining decks:** unify the theme, fonts, colors, slide size, and master before merging. Rebuild slides that fight the combined system.
- **Splitting decks:** keep the master, update slide numbers and section dividers, remove unused layouts, and check links and notes.
- **Converting formats:** test fonts, charts, animations, video, and links after conversion. Export a PDF and compare it to the original.

### Re-QA

Template edits fail in the same places as new decks:

- overflow after text replacement;
- title underlines or decorations misaligned when a title wraps;
- leftover placeholder text;
- low-contrast icons on a new background;
- orphaned images after a content block is deleted;
- inconsistent fonts after copy-paste.

Run the full QA checklist again. Do not assume the template guarantees quality.

## Final sign-off

Before delivering, confirm:

- [ ] The throughline is clear.
- [ ] The title-only read tells the story.
- [ ] Every slide passes the three-second test.
- [ ] No text overflow, overlap, or misalignment.
- [ ] Contrast and font size are accessible.
- [ ] Data is correct and honest.
- [ ] Sources and dates are present.
- [ ] No placeholder text or template artifacts.
- [ ] Speaker notes are complete.
- [ ] The file opens cleanly and a PDF backup exists.
- [ ] The talk fits the time.
- [ ] The close makes a specific ask.

If any item fails, fix it before sending the deck.
