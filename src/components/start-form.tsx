"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, ClipboardList, Lightbulb, RotateCcw } from "lucide-react";
import { starterChips } from "@/lib/mock-data";

const EXAMPLE_BOM = `1x ESP32 DevKit (30-pin)
1x capacitive soil moisture sensor
1x 5V relay module
1x 3–6V submersible pump
2m silicone tubing, 6mm ID
40x jumper wires, male–male
1x 5V 2A DC adapter`;

const BOARDS = ["ESP32 DevKit", "Arduino Uno", "Raspberry Pi Pico", "Not sure yet"];

function deriveSessionTitle(
  mode: "paste" | "idea",
  ideaText: string
): string {
  if (mode === "paste") return "SP Road parts list";

  const words = ideaText
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 6)
    .map((word) =>
      word
        .replace(/^[^A-Za-z0-9]+/, "")
        .replace(/[^A-Za-z0-9]+$/, "")
    )
    .filter(Boolean);

  if (words.length === 0) return "Project parts list";

  const title = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .slice(0, 80);

  return title || "Project parts list";
}

export function StartForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"paste" | "idea">("paste");
  const [pasteText, setPasteText] = useState(EXAMPLE_BOM);
  const [ideaText, setIdeaText] = useState("");
  const [board, setBoard] = useState(BOARDS[0]);
  const [loadedExample, setLoadedExample] = useState(true);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("Example BOM loaded.");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function chooseStarter(chip: (typeof starterChips)[number]) {
    setMode("paste");
    setPasteText(chip.text);
    setLoadedExample(true);
    setActiveChip(chip.id);
    setAnnouncement(`${chip.label} example loaded. Demo only.`);
  }

  function clearExample() {
    setPasteText("");
    setIdeaText("");
    setLoadedExample(false);
    setActiveChip(null);
    setAnnouncement("Example cleared. Enter your own parts list.");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: mode === "paste" ? "bom" : "idea",
          rawText: pasteText,
          idea: ideaText,
          title: deriveSessionTitle(mode, ideaText),
          budget: 1500,
          maxStops: 2,
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error || "Could not build the bench sheet. Try again.");
      }
      if (response.status !== 201 || !payload?.viewId || !payload?.editToken) {
        throw new Error("The server returned an incomplete plan. Try again.");
      }

      window.localStorage.setItem(`engi-mart:edit:${payload.viewId}`, payload.editToken);
      router.push(`/b/${payload.viewId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not build the bench sheet. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <form className="start-form" onSubmit={submit} aria-label="Start a purchase plan">
      <div className="tab-row" role="tablist" aria-label="Input mode">
        <button
          type="button"
          role="tab"
          id="tab-paste"
          aria-selected={mode === "paste"}
          aria-controls="panel-paste"
          className="tab"
          onClick={() => setMode("paste")}
        >
          <ClipboardList size={15} aria-hidden="true" />
          Paste BOM
        </button>
        <button
          type="button"
          role="tab"
          id="tab-idea"
          aria-selected={mode === "idea"}
          aria-controls="panel-idea"
          className="tab"
          onClick={() => setMode("idea")}
        >
          <Lightbulb size={15} aria-hidden="true" />
          Describe idea
        </button>
      </div>

      <div className="form-body">
        {mode === "paste" ? (
          <div role="tabpanel" id="panel-paste" aria-labelledby="tab-paste">
            <p className="form-hint" id="paste-hint">
              Paste from a lab manual, WhatsApp, or a GitHub README. One part per line.
            </p>
            <textarea
              className="form-textarea"
              aria-labelledby="paste-hint"
              value={pasteText}
              onChange={(event) => {
                setPasteText(event.target.value);
                setLoadedExample(false);
                setActiveChip(null);
              }}
              placeholder={"1x ESP32\n2x SG90 servo\n1x 5V relay\n..."}
              spellCheck={false}
            />
          </div>
        ) : (
          <div role="tabpanel" id="panel-idea" aria-labelledby="tab-idea">
            <p className="form-hint" id="idea-hint">
              Describe the build. We'll map it to a starter BOM — you review every row.
            </p>
            <textarea
              className="form-textarea"
              aria-labelledby="idea-hint"
              value={ideaText}
              onChange={(event) => setIdeaText(event.target.value)}
              placeholder={"e.g. A balcony plant watering rig on ESP32.\nOne soil sensor, a small pump, and a 5 V supply.\nNeeds to run from a power bank."}
            />
          </div>
        )}

        <div className="form-row">
          <div className="field">
            <label className="field-label" htmlFor="target-board">
              Target board
            </label>
            <select
              id="target-board"
              className="select"
              value={board}
              onChange={(event) => setBoard(event.target.value)}
            >
              {BOARDS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: "1 1 220px" }}>
            <p className="form-fineprint" style={{ paddingBottom: 3 }}>
              No account needed. We'll keep the plan on a shareable link.
            </p>
          </div>
        </div>

        <div className="starter-row">
          <div className="starter-label">
            <span className="eyebrow">RVCE starters</span>
            <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-muted)" }}>
              3 TEMPLATES
            </span>
          </div>
          <div className="starter-chips">
            {starterChips.map((chip) => (
              <button
                type="button"
                key={chip.id}
                className="chip"
                data-active={activeChip === chip.id}
                onClick={() => chooseStarter(chip)}
                aria-pressed={activeChip === chip.id}
                title={chip.detail}
              >
                {chip.label}
                <small aria-hidden="true">↗</small>
              </button>
            ))}
          </div>
        </div>

        {loadedExample ? (
          <div className="example-note" role="status">
            <span className="tag">Example BOM loaded</span>
            <span>Example parts for a plant monitor. Edit the text before building.</span>
            <button type="button" className="text-link" onClick={clearExample}>
              Clear table
            </button>
          </div>
        ) : null}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting
              ? "Building bench sheet…"
              : mode === "paste"
                ? "Build bench sheet"
                : "Draft a bench sheet"}
            <ArrowRight size={15} aria-hidden="true" />
          </button>
          <button type="button" className="btn btn-quiet" onClick={clearExample} disabled={submitting}>
            <RotateCcw size={14} aria-hidden="true" />
            Reset example
          </button>
          <p className="form-fineprint">
            Creates a read-only share link. No account needed. Estimates, not shop quotes.
          </p>
        </div>
        {error ? (
          <p
            role="alert"
            className="mono"
            style={{
              marginTop: 10,
              border: "1px solid var(--danger)",
              borderLeft: "3px solid var(--danger)",
              background: "var(--danger-surface)",
              color: "var(--danger)",
              padding: "8px 10px",
              fontSize: 11.5,
              lineHeight: 1.5,
            }}
          >
            {error}
          </p>
        ) : null}
        <p aria-live="polite" className="sr-only" style={{ position: "absolute", left: -9999 }}>
          {announcement}
        </p>
      </div>
    </form>
  );
}
