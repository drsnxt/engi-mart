# Visual design

Design is a system, not decoration. Decide the system once, then apply it everywhere. The audience should feel consistency before they notice any single slide.

## The five tokens

1. **Grid** — where things sit.
2. **Type** — the scale, family, and weight.
3. **Color** — the palette and its meaning.
4. **Imagery** — how photos, diagrams, and illustrations are treated.
5. **Motif** — the one repeatable element that makes the deck recognizable.

Write the tokens down before building. If a new slide requires a new decision, the system is incomplete.

## Composition

### Canvas

- **16:9** is the default: 13.333" × 7.5" (or 1920 × 1080 px).
- **4:3** only when the room or template demands it.
- Keep the same aspect ratio across the deck.

### Grid

- **Margins:** 0.5"–0.75" on all sides.
- **Columns:** 12 columns with 0.25"–0.3" gutters.
- **Title zone:** top 0.5"–1.4".
- **Body zone:** 1.6"–6.8".
- **Footer zone:** 7.0"–7.3".
- **Safe zone:** keep critical content 5% inside the edge; projection and screens crop differently.
- **One dominant alignment:** usually left. Use it for titles, body, and captions.
- **One focal point per slide.** The eye should know where to land first.
- **Whitespace is a design element**, not empty space to fill.
- **Text boxes carry internal padding.** Zero it when text must align with a shape, line, or icon.
- **Slide numbers:** bottom-right, small and consistent. Useful for Q&A and read-aheads; keep them out of the content zone.

### Hierarchy

Create contrast with:

- **Size** — the title should be visibly larger than the body.
- **Weight** — bold for the headline, regular for support.
- **Color** — accent only for the key insight.
- **Space** — isolate the most important element.
- **Position** — top-left and center get read first.

If everything is bold, colored, or boxed, nothing is dominant.

### Reading order

- Western audiences read left-to-right, top-to-bottom.
- Use a **Z-pattern** for sparse slides and an **F-pattern** for text-heavy ones.
- Put the takeaway where the eye lands first: the title, then the visual.
- Do not make the audience hunt for the point.

### Rule of thirds

Divide the slide into a 3 × 3 grid. Put the main subject on one of the four intersections or along a third line. Use it for photography and full-bleed compositions, not for dense data slides.

## Typography

### Families

- Use **at most two families**: one display/heading face and one body face. One family with two weights is also fine.
- Pair a serif display with a sans body, or a geometric sans with a humanist sans.
- Avoid very light weights; they disappear on projectors.
- Use fonts that are installed on the target machine, or embed them. If you cannot embed, export a PDF.

### Scale

| Role | Size | Weight | Notes |
|---|---|---|---|
| Display / title slide | 60–72 pt | Bold | One line if possible |
| Slide title / H1 | 36–44 pt | Bold | 1–2 lines maximum |
| Section header / H2 | 24–30 pt | Bold | Short |
| Body | 18–24 pt | Regular | Minimum for live projection |
| Secondary body | 16–18 pt | Regular | Only when the room is small |
| Caption | 12–14 pt | Regular | Labels, dates, sources |
| Source / footnote | 9–11 pt | Regular | Only if it must be on the slide |

For read-ahead decks, body text can be 14–16 pt. For a pitch deck, 30 pt minimum is a useful discipline. For a live technical talk, never go below 18 pt for anything the audience must read.

### Spacing

- **Line height:** 1.0–1.15 for display, 1.15–1.25 for headings, 1.25–1.4 for body.
- **Line length:** 8–12 words per line on a slide; 50–75 characters in a document.
- **Paragraph spacing:** use space after, not empty lines.
- **Margins:** 0.5" minimum; 0.3"–0.5" between content blocks.
- **Consistent gaps:** choose 0.3" or 0.5" and repeat it.

### Alignment and case

- Left-align body text; ragged right is easier to read.
- Center only short titles, quotes, or single numbers.
- Use sentence case for titles and body.
- Use all caps only for short labels, never for paragraphs.
- Use bold or color for emphasis; avoid underline and italics for long text.
- Avoid hyphenation and justified text on slides.

### Font pairing examples

| Tone | Display | Body |
|---|---|---|
| Modern / tech | Space Grotesk, Inter Tight, Söhne | Inter, IBM Plex Sans, Source Sans |
| Corporate / clean | Calibri Light, Arial, Helvetica | Calibri, Arial, Segoe UI |
| Editorial / premium | Playfair Display, Lora, Georgia | Source Sans, Lato, Helvetica |
| Academic / serious | Source Serif, Cambria, Georgia | Source Sans, Arial, Calibri |
| Warm / human | Fraunces, Recoleta, Georgia | Nunito Sans, Inter, Lato |

These are starting points. Check availability on the target machine and verify the fallback.

## Color

### The 60-30-10 rule

- **60%** — background and dominant neutral.
- **30%** — secondary color, text, or large shapes.
- **10%** — accent for the key insight, call to action, or highlighted data.

One accent, used sparingly, is stronger than five colors used equally.

### Contrast

- Body text: at least **4.5:1** against its background.
- Large text (18 pt regular or 14 pt bold): at least **3:1**.
- Icons, lines, and chart elements: at least **3:1**.
- Do not put text over a busy image without a solid or gradient overlay.
- Test in grayscale: if the hierarchy disappears, the contrast is too weak.

### Meaning

Assign colors a job and keep it:

- **Accent** — the key number, the recommended option, the action.
- **Neutral** — context, secondary data, labels.
- **Risk color** — problems, warnings, downside.
- **Positive color** — gains, wins, approval.

Do not use red and green as the only difference between two categories. Use labels, patterns, or position as well.

### Dark and light

- **Light backgrounds** for content-heavy decks in lit rooms and for print.
- **Dark backgrounds** for keynotes, title/closing slides, and dark rooms. They feel premium but can wash out in bright rooms.
- **Sandwich structure:** dark title and closing, light content. Or commit to one mode throughout.
- Use near-black (`#111111`–`#1A1A1A`) and off-white (`#F7F7F5`–`#FFFFFF`) rather than pure black and pure white.

### Palette starting points

Use these only if the topic or brand does not suggest something better. Derive the palette from the subject, the brand, or the emotional register of the talk. Check every pair for contrast.

| Theme | Dominant | Support | Accent |
|---|---|---|---|
| Midnight Executive | `1E2761` navy | `CADCFC` ice blue | `FFFFFF` white |
| Forest & Moss | `2C5F2D` forest | `97BC62` moss | `F5F5F5` cream |
| Coral Energy | `F96167` coral | `F9E795` gold | `2F3C7E` navy |
| Warm Terracotta | `B85042` terracotta | `E7E8D1` sand | `A7BEAE` sage |
| Ocean Depth | `065A82` deep blue | `1C7293` teal | `21295C` midnight |
| Charcoal Minimal | `36454F` charcoal | `F2F2F2` off-white | `212121` black |
| Teal Trust | `028090` teal | `00A896` seafoam | `02C39A` mint |
| Berry & Cream | `6D2E46` berry | `A26769` dusty rose | `ECE2D0` cream |
| Sage Calm | `84B59F` sage | `69A297` eucalyptus | `50808E` slate |
| Cherry Bold | `990011` cherry | `FCF6F5` off-white | `2F3C7E` navy |

If the palette feels like it could belong to any deck, it is not specific enough. A deck about soil sensors and a deck about luxury travel should not share the same colors.

### Palette recipe

1. Pick a dominant hue from the subject or brand.
2. Add a near-neutral background: white, off-white, charcoal, or deep navy.
3. Add one accent that contrasts with the dominant.
4. Create 2–3 tints/shades of the dominant for charts and cards.
5. Check contrast before committing.

## Layout patterns

### Statement

```
+--------------------------------------+
|                                      |
|   ONE BIG IDEA                       |
|   one supporting line                |
|                                      |
+--------------------------------------+
```

Use for a single claim, a quote, or a section break. Full-bleed color or image. No bullets.

### Split

```
+----------------------+---------------+
| TITLE                |               |
|                      |    IMAGE      |
| 3 short points       |    or CHART   |
|                      |               |
+----------------------+---------------+
```

Use when the audience needs to read and see at the same time. Keep the text side to 3–5 short points.

### Cards

```
+--------------------------------------+
| TITLE                                |
| [ card ]   [ card ]   [ card ]       |
|  icon       icon       icon          |
|  label      label      label         |
|  one line   one line   one line      |
+--------------------------------------+
```

Use for 3–5 parallel points. More than five cards becomes a wall. Keep card heights equal and labels parallel.

### Stat

```
+--------------------------------------+
| TITLE                                |
|                                      |
|   72%                                |
|   of students changed where they buy |
|   Source: pilot survey, n=120, 2026  |
+--------------------------------------+
```

Use when one number is the argument. One hero number, one line of context, one source.

### Compare

```
+------------------+-------------------+
| BEFORE           | AFTER             |
| 3 points         | 3 points          |
| same criteria    | same criteria     |
+------------------+-------------------+
```

Use for before/after, us/them, option A/B. Judge both sides on the same criteria. Do not stack the deck.

### Process

```
[ 1 ] --> [ 2 ] --> [ 3 ] --> [ 4 ]
 label     label     label     label
```

Use for a sequence of 3–5 steps. Number them. Keep arrows short and horizontal.

### Timeline

```
2022 ------ 2023 ------ 2024 ------ 2026
seed        pilot       rollout     scale
```

Use for history, roadmap, or milestones. Four to six moments maximum. Put the current moment in the accent color.

### Diagram

```
[ Client ] --> [ API ] --> [ Database ]
                   |
              [ AI layer ]
```

Use for systems, architecture, and flows. One flow per slide. Label every box. Avoid diagonal and curved connectors; they are harder to follow. If the diagram needs a legend, simplify it.

### Chart

```
+--------------------------------------+
| ACTION TITLE                         |
|                                      |
|   [ chart with one highlighted ]     |
|   callout: the insight               |
|   Source: ..., date                  |
+--------------------------------------+
```

Use for quantitative evidence. One highlighted insight, direct labels, annotation. See [data-viz](data-viz.md).

### Quote

```
+--------------------------------------+
| "The quote is the argument."         |
|                                      |
| — Name, role                         |
+--------------------------------------+
```

Use for voice, testimonial, or human proof. Large type. No quotation-mark decoration beyond the quote itself.

### Section divider

```
+--------------------------------------+
| 02                                   |
| THE SOLUTION                         |
+--------------------------------------+
```

Use to mark an act. Big number or short title. Minimal else. Do not put a paragraph on a divider.

### Close

```
+--------------------------------------+
| ONE SENTENCE                         |
| Approve the pilot by June 1.         |
| Owner: ...   Next report: ...        |
+--------------------------------------+
```

Use for the ask. One action, one owner, one date. No "Thank you" alone.

## Imagery

- **One strong image beats four small ones.** Use full-bleed or half-bleed.
- **Full-bleed with overlay:** darken the image behind text; do not put text on a busy area.
- **Consistent treatment:** duotone, warm/cool grade, black-and-white, or cutout. Pick one and repeat.
- **Real over generic:** real product, real people, real place. Avoid handshakes, lightbulbs, puzzle pieces, rocket ships, and generic "team meeting" stock.
- **Resolution:** at least 2× the displayed size. No pixelation.
- **Crop with intent:** do not distort, stretch, or squash.
- **Alt text:** describe the informative content, not "image".
- **Licensing:** use images you have the right to use; credit when required.

## Icons

- One family, one stroke width, one corner style.
- Use icons to aid scanning, not to decorate every line.
- Pair every icon with a label; an unlabeled icon is a guessing game.
- Size relative to the text: roughly 1.5–2× the cap height.
- Ensure 3:1 contrast against the background.
- Do not mix filled, outlined, and 3D icons in one deck.

## Motif

Pick one repeatable element and carry it across the deck:

- large section numbers;
- circular or rounded image frames;
- a consistent duotone treatment;
- a numbered label system;
- a single geometric shape used as a container;
- a consistent diagram style.

The motif should make the deck recognizable at thumbnail size. It should not compete with the content.

Do **not** use a color bar or accent stripe as the motif. It reads as decoration and is one of the most common AI-generated slide tells.

## Motion

- Use motion only to **reveal sequence** or **direct attention**.
- Keep transitions subtle and fast: 0.2–0.5 seconds.
- Use at most two transition types in a deck.
- Avoid bounce, fly, spin, and sound effects.
- Build complex diagrams in steps, not all at once.
- Do not rely on animation to make the point; the static slide must still work.
- Respect reduced-motion settings and provide a static alternative.

## Accessibility

- **Contrast:** 4.5:1 for body, 3:1 for large text and graphics.
- **Size:** body at least 18 pt for live talks; titles at least 36 pt.
- **Color independence:** never use color alone to encode meaning. Add labels, patterns, or position.
- **Alt text:** every informative image, chart, and diagram.
- **Captions/transcripts:** for video and audio.
- **Reading order:** make the slide order make sense to a screen reader; use unique slide titles.
- **Plain language:** short sentences, common words, defined jargon.
- **No flashing:** avoid rapid or repetitive animation.
- **Grayscale test:** the hierarchy should survive without color.
- **Accessible export:** provide a tagged PDF or an accessible version when the audience needs it.

## Design anti-patterns

- Accent lines under titles.
- Decorative color bars, header/footer bars, and vertical sidebar stripes.
- Default corporate blue when the topic or brand suggests something else.
- Default cream or beige backgrounds when no brand calls for them.
- Thin accent stripes along one edge of a card.
- 3D charts, bevels, and drop shadows on everything.
- Clip art and generic stock clichés.
- More than two font families.
- All-caps paragraphs.
- Centered body text.
- Text over a busy image without an overlay.
- Low-contrast gray text.
- Tiny footers and logos.
- A logo on every slide.
- Bullet walls.
- Six or more cards on one slide.
- Pie charts with many slices.
- Dual axes without clear labels.
- Animation on every element.
- A final "Thank you" slide with no ask.
- Placeholder text left in the deck.
- Inconsistent margins and gaps.
- Every slide using the same layout.
- Tables with 20 rows.
- Reading the slide verbatim.

## Design system sheet

Fill this in before building:

```
Deck:
Audience:
Format / aspect ratio:

GRID
Margins:            0.5"
Columns:            12
Gutter:             0.25"
Title zone:         0.5"–1.4"
Body zone:          1.6"–6.8"

TYPE
Display:            family / size / weight
H1:                 family / size / weight
H2:                 family / size / weight
Body:               family / size / weight
Caption:            family / size / weight

COLOR
Background:         hex
Text:               hex
Muted:              hex
Accent:             hex
Support:            hex
Semantic use:       accent = ...
                    risk = ...
                    positive = ...

IMAGERY
Treatment:          full-bleed / duotone / cutout / diagram
Source:
Alt text policy:

MOTIF
Element:
Where it repeats:

MOTION
Transitions:
Builds:
```

If a slide cannot be built from this sheet, add the missing token to the sheet rather than improvising on the slide.
