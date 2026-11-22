---
name: presentation-craft
description: "Use when creating, editing, reviewing, or delivering any slide deck or presentation — pitch decks, keynotes, business or consulting reviews, academic and technical talks, training, sales decks, and .pptx/.potx/.ppt/.odp/.key/Google Slides files. Covers audience and narrative, slide writing, visual design, data visualization, accessibility, QA, and delivery."
---

# Presentation Craft

A deck is a visual argument, not a document. The audience should leave with one idea and one next step. Design serves the argument; it is not the argument.

This skill is tool-agnostic. Apply it before, during, and after whatever authoring tool you use. The principles matter; the software does not.

## Route by task

| Task | Start here |
|---|---|
| Create a new deck | Workflow below, then [narrative](references/narrative.md) and [design](references/design.md) |
| Fix the story or titles | [narrative](references/narrative.md) |
| Improve layout, type, or color | [design](references/design.md) |
| Fix charts or tables | [data-viz](references/data-viz.md) |
| Review or QA a deck | [qa](references/qa.md) |
| Edit an existing deck or template | [Working with existing decks](references/qa.md#working-with-existing-decks-and-templates) |
| Fill in a brief and storyboard | [worksheet](templates/worksheet.md) |

## The five tests

A deck is ready only when it passes all five:

1. **Throughline** — you can state the deck's argument in one sentence.
2. **Ghost deck** — reading only the slide titles tells the whole story.
3. **Three-second** — a distracted viewer gets each slide's point in three seconds.
4. **One-minute** — each slide takes about one minute to present.
5. **Back of the room** — the smallest text and faintest contrast are readable at the back of the room.

If a test fails, fix the story or the slide. Do not polish around a failure.

## Workflow

### 1. Brief the deck

Establish, or infer and state:

- **Audience** — who is in the room, what they know, what they care about, what they resist.
- **Decision or action** — what should change after the talk.
- **Context** — live talk, read-ahead, recorded video, workshop, investor meeting, defense.
- **Time** — how many minutes, including Q&A.
- **Format** — screen, print, PDF, projected, virtual, handout.
- **Brand/template** — existing system to follow, or freedom to create one.
- **Sources** — data, documents, interviews, existing decks.
- **Constraints** — accessibility, confidentiality, language, file format.
- **Success metric** — the one thing the audience must remember or do.

Ask only for what you cannot infer. If you proceed on assumptions, say so.

**Done when:** you can name the audience, the decision/action, the time limit, and the single thing the audience must remember.

### 2. Write the throughline

One sentence:

> By the end, **[audience]** should **[think / feel / do]** because **[evidence]**.

A good throughline is specific enough that a reasonable person could disagree with it. "A platform for engineering students" is a description. "Local engineering students will buy more from nearby shops if price, stock, and compatibility are compared in one basket view" is an argument.

Then choose an argument shape: answer-first, SCQA, problem–solution–proof, or what-is / what-could-be. See [narrative](references/narrative.md#argument-shapes).

**Done when:** the sentence makes a claim, names the audience, and implies the evidence.

### 3. Build the ghost deck

Write one action title per slide, in order. No design, no charts, no bullets. Read the titles aloud.

- If the titles do not tell the story, the deck does not have one.
- If a title is a label ("Overview", "Results"), rewrite it as a claim.
- If a title needs "and" or "but", split the slide.
- Aim for 10–15 titles for a 10–15 minute talk. One slide ≈ one minute.

**Done when:** the title sequence alone is a coherent argument.

### 4. Storyboard the evidence

For each title, decide:

- the one piece of evidence that proves it;
- the visual form that makes it obvious;
- the source and date;
- the sentence you will say that is not written on the slide.

One idea per slide. If you need two visuals, you probably need two slides. If the evidence is a table, ask whether a chart or a single number would make the point faster.

**Done when:** every content slide has a title, one visual anchor, and a source for any factual claim.

### 5. Design the system

Decide five tokens before building:

1. **Grid** — 16:9, 0.5" margins, 12 columns.
2. **Type** — at most two families; a fixed scale.
3. **Color** — one dominant, one support, one accent; contrast checked.
4. **Imagery** — one treatment (full-bleed, duotone, cutout, diagram).
5. **Motif** — one repeatable element (numbering, frames, icon style).

See [design](references/design.md).

**Done when:** a new slide can be built without making a new design decision.

### 6. Build the deck

- Use the master/layouts for repeated elements.
- Keep text, charts, tables, and diagrams editable.
- Put narration in speaker notes, not on the slide.
- Use native charts and tables where the tool supports them.
- Add alt text as you go.
- Build an appendix for questions, detail, and backup.
- Save the editable master and export a PDF.

**Done when:** every slide is editable, every content slide is sourced, and the speaker notes cover the full talk.

### 7. QA and deliver

Run the review loop in [qa](references/qa.md): render every slide → inspect fresh → fix in the source → re-render changed slides.

Check content, design, data, accessibility, file, and delivery. Export a PDF backup. Rehearse with a timer.

**Done when:** no user-visible defect remains and the talk fits the time.

## The non-negotiables

1. **One audience, one throughline, one ask.** A deck for everyone is for no one.
2. **Answer first.** Titles state conclusions, not topics.
3. **One idea per slide.** If the title needs "and", split it.
4. **Every slide needs a visual anchor.** Image, chart, diagram, stat, or shape. Text-only slides are forgettable.
5. **Write for the back of the room.** Big type, high contrast, few words.
6. **Design with a system.** Grid, type scale, palette, motif. Consistency is credibility.
7. **Color with meaning.** 60-30-10; one accent for the key insight. Never color for decoration.
8. **Show data honestly.** No 3D, no truncated bar axes, no dual-axis tricks. Annotate the insight.
9. **Remove what does not serve the argument.** Every element competes for attention.
10. **Rehearse the transitions and the close.** The ending is the ask, not "Thank you".
11. **QA the rendered deck.** The source is not the deliverable; the screen is.
12. **Keep it editable and ship a backup.** Editable master plus PDF.

## Slide patterns

Choose the pattern that makes the idea obvious. Vary patterns across the deck, but keep the system constant.

| Pattern | Use when | Structure |
|---|---|---|
| **Statement** | One big idea needs room | Full-bleed color or image; one sentence; almost nothing else |
| **Split** | Explain and show | 55/45 text and image, diagram, or chart |
| **Cards** | 3–5 parallel points | Equal cards with a short label and one supporting line |
| **Stat** | One number is the argument | Very large number; one-line context; source |
| **Compare** | Before/after, us/them, option A/B | Two columns judged on the same criteria |
| **Process** | A sequence of 3–5 steps | Numbered steps with short labels and arrows |
| **Timeline** | History, roadmap, milestones | Horizontal line with 4–6 dated moments |
| **Diagram** | System, architecture, flow | One clear flow; labeled boxes; minimal arrows |
| **Chart** | Quantitative evidence | Action title, one highlighted insight, annotation, source |
| **Table** | Precise comparison | Few rows and columns; highlighted decision cell |
| **Quote** | Voice, testimonial, human proof | Large quote; name and role; no decoration |
| **Section** | Change of act | Big section number or title; minimal else |
| **Close** | Ask or next step | One sentence, owner, date, and what happens next |

## Deck types at a glance

| Type | Default spine | Length | Success looks like |
|---|---|---|---|
| **Pitch** | purpose → problem → solution → why now → market → product → traction → model → competition → team → ask | 10–12 | Investor asks for the next meeting |
| **Business/consulting review** | answer → 3 messages → evidence → risks → ask | 8–12 + appendix | Decision made in the room |
| **Academic/technical** | motivation → gap → approach → method → results → implications | 10–15 for 10–15 min | Audience can restate the contribution |
| **Keynote** | hook → tension → 3 acts → new bliss → call to action | 15–25 for 18 min | Audience remembers one idea |
| **Training** | objectives → concept → demo → practice → feedback → recap | 15–30 for 1 hour | Learner can do the task |
| **Sales** | insight → problem → solution → proof → ROI → next step | 8–12 | Buyer agrees to a next step |
| **Board/exec** | decision → 3 messages → evidence → risks → ask | 5–8 + appendix | Decision made |
| **Internal update** | headline → progress → metrics → risks → asks | 5–8 | Team knows what changed and what to do |
| **Project demo** | hook → demo → architecture → results → roadmap → ask | 8–12 | Audience understands what it does and why it matters |

Full structures and common mistakes: [deck types](references/narrative.md#deck-types).

## Failure modes

| Instead of | Do |
|---|---|
| Title "Overview" | Action title: "Three forces are reshaping the market" |
| Paragraphs on a slide | One idea plus a visual anchor |
| A feature list | The benefit, the evidence, and the so-what |
| The default template | A deliberate system: grid, type, palette, motif |
| An accent line under every title | Whitespace and type hierarchy |
| A final "Thank you" slide | A specific ask, owner, and date |
| 3D, pie, or dual-axis charts | An honest, simple chart with annotation |
| Tiny footer text and logos | Cut it, or move it to the appendix |
| Centered body text | Left-aligned, ragged-right text |
| Every slide the same layout | Vary the pattern; keep the system |
| Animations everywhere | Reveal sequence only; subtle and fast |
| Generic stock handshakes and lightbulbs | Real product, real people, real diagrams |
| Every color at equal weight | 60-30-10 with one accent |
| A data dump | A "so what" annotation on every data slide |
| A logo on every slide | Brand through color, type, and motif |
| 50 slides for 10 minutes | 10–12 slides, then cut again |
| Reading the slides aloud | Speak the argument; the slides support it |

## Working with existing decks and templates

1. **Audit before editing.** Extract all text and speaker notes; render every slide; list layouts, masters, fonts, colors, and image treatments.
2. **Find the argument.** Read the titles in order. If the story is weak, fix the ghost deck before touching design.
3. **Preserve the brand.** Use the template's theme colors, fonts, and layouts. Do not fight the system unless rebranding is the task.
4. **Map content to layouts.** Choose the layout that fits the evidence. Do not force a new idea into a layout built for something else.
5. **Edit content, not decoration.** Keep placeholders and native elements editable. Do not flatten text into images.
6. **Replace, don't leave residue.** Remove placeholder text, unused images, orphaned shapes, and empty groups when you delete content.
7. **Split overflow.** If a slide has too much content, split it into two slides rather than shrinking type below the readable minimum.
8. **Re-run the QA.** Template edits fail in the same places as new decks: overflow, contrast, alignment, and leftover placeholders.

More: [working with existing decks](references/qa.md#working-with-existing-decks-and-templates).

## Output contract

For a full deck build, deliver:

1. A one-sentence throughline.
2. A title-only ghost deck.
3. A slide-by-slide plan: title, evidence, visual, source, minutes.
4. The editable deck file.
5. A PDF export.
6. Speaker notes.
7. A short QA note: what was checked and what remains.

For a quick edit or review, deliver the fixed deck, the PDF if useful, and a concise list of defects found and fixed. Do not bury the user in process.

## References

- [Narrative and slide writing](references/narrative.md) — throughline, story shapes, deck types, action titles, speaker notes.
- [Visual design](references/design.md) — grid, type, color, layout patterns, imagery, motion, accessibility.
- [Data visualization](references/data-viz.md) — chart choice, annotation, tables, integrity, chart QA.
- [QA and delivery](references/qa.md) — tests, checklists, file hygiene, existing decks, rehearsal.
- [Deck worksheet](templates/worksheet.md) — brief, throughline, ghost deck, slide spec, design tokens, sign-off.

## Foundations

The guidance here draws on Barbara Minto's Pyramid Principle, Nancy Duarte's story structure, Garr Reynolds' *Presentation Zen*, Edward Tufte's data-ink principles, Cole Nussbaumer Knaflic's *Storytelling with Data*, Richard Mayer's multimedia-learning principles, the Financial Times Visual Vocabulary, and WCAG 2.1 contrast guidance.
