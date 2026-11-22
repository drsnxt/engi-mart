# Data visualization

A chart is an argument, not a decoration. Start with the question the chart must answer, then choose the visual form that makes the answer obvious.

## Start with the question

Before choosing a chart, answer:

- **What decision does this support?** If the chart does not change a decision or belief, cut it.
- **What is the one thing the audience should see?** Write it as a sentence.
- **What comparison gives it meaning?** Previous period, target, benchmark, competitor, or cost of inaction.
- **What is the smallest amount of data that proves the point?** Remove the rest.
- **What would make the audience distrust it?** Fix that before presenting.

The sentence you write is the chart's action title.

### What, so what, now what

Every data slide should answer three questions in order:

1. **What?** — the data, the comparison, the time period.
2. **So what?** — the insight, stated in the title or annotation.
3. **Now what?** — the implication: change the plan, fund the pilot, investigate the outlier.

If the slide stops at "what", it is a data dump. If it stops at "so what", it is analysis without a decision.

## Chart chooser

| Question | Best chart | Notes |
|---|---|---|
| How do categories compare? | Horizontal or vertical bar | Sort by value; start at zero |
| How did a value change over time? | Line | Time on the x-axis; label events |
| What is the composition of a whole? | Stacked bar or donut | Keep slices to 3–5; donut for one hero stat |
| How are values distributed? | Histogram, box plot, or dot plot | Show spread and outliers |
| Are two variables related? | Scatter | Correlation is not causation |
| Who ranks where? | Sorted bar | Highlight the top, bottom, or your position |
| How far above or below a reference? | Diverging bar | Reference line at zero or target |
| How does a flow move? | Sankey or flow diagram | Use only if the tool supports it cleanly |
| Where is it happening? | Map | Show rates, not totals; include a legend |
| How uncertain is the projection? | Fan chart or error bars | Show the range, not a single line |
| What drove a change from start to finish? | Waterfall | Start and end totals; label the drivers |
| What exact values should the audience look up? | Table | Charts show patterns; tables show precision |

If you cannot name the question, you are not ready to chart.

## Chart anatomy

A presentation chart should have:

1. **Action title** — the conclusion, e.g. "Revenue grew 38% after the pricing change."
2. **Subtitle or note** — units, time period, sample size, source.
3. **One highlighted element** — the series, bar, or point that carries the argument. Gray the rest.
4. **Direct labels** — put labels on the data, not in a distant legend.
5. **Annotation** — a short callout that states the "so what".
6. **Clean axes** — label units; remove unnecessary gridlines and borders.
7. **Source and date** — bottom corner, small but legible.

A chart without an action title makes the audience do the interpreting. A chart with five highlighted colors makes them do it twice.

## Annotation

The annotation is where the insight lives.

- Put it next to the data it explains, not in a footnote.
- Use a short sentence: "Pricing change", "Pilot starts", "Competitor exits".
- Highlight the delta, not the whole series.
- Add context: previous period, target, benchmark, or cost.
- If the chart shows a problem, say what caused it or what to do next.
- Use a leader line only when the label cannot sit next to the point.

Example:

> **Revenue grew 38% after the pricing change**  
> Monthly recurring revenue, indexed to Jan 2026  
> The jump begins in March, when the new tiers launched.  
> Source: finance system, exported 12 Oct 2026.

## Color in charts

- **One accent** for the insight; gray or neutral for context.
- **Sequential** palette for magnitude (light to dark of one hue).
- **Diverging** palette for positive/negative around a midpoint.
- **Categorical** palette for a few unrelated categories; keep it to 5–6 colors.
- **Consistent mapping:** the same category gets the same color across every slide.
- **Colorblind-safe:** avoid red/green as the only distinction. Use labels, patterns, or position.
- **Contrast:** 3:1 for lines, bars, and labels.
- **No rainbow** unless the data is genuinely spectral.

## Tables

Tables are for precise lookup, not for showing trends.

- Fewer rows and columns; split a large table into two slides or move it to the appendix.
- Remove heavy borders; use whitespace and light rules.
- Right-align numbers; align decimals.
- Put units in the header.
- Highlight the decision row or cell, not every other row.
- Use a consistent number format.
- Add source and date.
- If the audience only needs one number, use a stat callout instead of a table.

## Integrity

Charts can mislead without lying. Avoid:

- **3D charts** — perspective distorts area and length.
- **Truncated bar axes** — bars must start at zero. Line charts may zoom, but label the break.
- **Dual axes** — two y-axes can manufacture correlations. Use only when necessary, label both, and explain the relationship.
- **Area distortion** — bubbles and pictograms must scale by area, not radius.
- **Cherry-picked time ranges** — show enough history to make the trend honest.
- **Missing denominators** — "50% more" means nothing without the base.
- **Cumulative vs. periodic** — label which one you are showing.
- **Correlation presented as causation** — say "associated with", not "caused by", unless you have causal evidence.
- **Averages that hide distribution** — show the spread when it matters.
- **Hidden outliers** — explain them or show them.
- **Inconsistent scales across slides** — the same metric should use the same scale.
- **Too much precision** — round to the digits that change the decision.

If a chart needs a disclaimer to be honest, redesign the chart.

## Accessibility

- Add alt text that states the insight, not just the chart type. Formula: "Chart of [metric] from [period]; the key takeaway is [insight]."
- Provide a data table in the appendix for audiences who cannot see the chart.
- Do not rely on color alone; use labels, patterns, or direct annotation.
- Keep labels at least 12–14 pt on a slide.
- Ensure 3:1 contrast for lines and bars.
- Avoid flashing or animated reveals that cannot be paused.

## Chart QA

- Can a viewer state the takeaway in three seconds?
- Is the chart type right for the question?
- Does the title match what the data actually shows?
- Are the axes, units, and scale correct?
- Is the highlighted element the real insight?
- Is the source and date present?
- Is the chart readable at thumbnail size?
- Is there a table or appendix for precision?
- Would a skeptical viewer call it misleading?

If any answer is no, fix the chart before polishing the slide.

## Further reading

- Edward Tufte, *The Visual Display of Quantitative Information*.
- Cole Nussbaumer Knaflic, *Storytelling with Data*.
- Financial Times Visual Vocabulary.
- Cleveland and McGill, *Graphical Perception*.
- Alberto Cairo, *The Truthful Art*.
