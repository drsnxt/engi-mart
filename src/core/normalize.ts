export interface ParsedItem {
  rawText: string;
  cleanedText: string;
  qty: number;
  specHint?: string;
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u03A9\u2126]/g, "ohm") // Ω
    .replace(/[\u00B5\u03BC]/g, "u")   // µ
    .replace(/[\u00D7]/g, "x")         // ×
    .replace(/\s+/g, " ")
    .trim();
}

export function parseBomLine(line: string): ParsedItem {
  let cleaned = normalizeText(line);
  let qty = 1;
  let specHint: string | undefined = undefined;

  // Extract parenthetical note if present, e.g. "esp32 (38-pin)"
  const parenMatch = cleaned.match(/\(([^)]+)\)/);
  if (parenMatch) {
    specHint = parenMatch[1].trim();
    // Remove the parenthetical from the main text
    cleaned = cleaned.replace(/\(([^)]+)\)/, "").trim();
  }

  // Parse quantity patterns
  // Pattern 1: Leading qty: "2x ...", "2 pcs ...", "qty 2 ...", "2 nos ..."
  const leadingQtyPatterns = [
    /^(\d+)\s*x\s+(.+)$/i,
    /^(\d+)\s*(?:pcs|nos|pieces|items)\s+(.+)$/i,
    /^(?:qty|quantity)\s*[:=]?\s*(\d+)\s+(.+)$/i,
    /^(\d+)\s*[-–]\s*(.+)$/i,
  ];

  for (const pattern of leadingQtyPatterns) {
    const match = cleaned.match(pattern);
    if (match) {
      qty = parseInt(match[1], 10);
      cleaned = match[2].trim();
      break;
    }
  }

  // Pattern 2: Trailing qty: "... x 2", "... qty 2", "... 2 pcs", "... x2"
  if (qty === 1) {
    const trailingQtyPatterns = [
      /^(.+?)\s+x\s*(\d+)$/i,
      /^(.+?)\s+(?:qty|quantity)\s*[:=]?\s*(\d+)$/i,
      /^(.+?)\s+(\d+)\s*(?:pcs|nos|pieces|items)$/i,
      /^(.+?)\s+x(\d+)$/i,
    ];

    for (const pattern of trailingQtyPatterns) {
      const match = cleaned.match(pattern);
      if (match) {
        qty = parseInt(match[2], 10);
        cleaned = match[1].trim();
        break;
      }
    }
  }

  // Ensure positive qty
  if (isNaN(qty) || qty <= 0) {
    qty = 1;
  }

  return {
    rawText: line.trim(),
    cleanedText: cleaned,
    qty,
    specHint,
  };
}

export function parseBomInput(input: string): ParsedItem[] {
  const lines = input
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#"));

  const merged = new Map<string, ParsedItem>();

  for (const line of lines) {
    const parsed = parseBomLine(line);
    const key = parsed.cleanedText.toLowerCase();

    if (merged.has(key)) {
      const existing = merged.get(key)!;
      existing.qty += parsed.qty;
      if (parsed.specHint && !existing.specHint) {
        existing.specHint = parsed.specHint;
      }
    } else {
      merged.set(key, parsed);
    }
  }

  return Array.from(merged.values());
}

export function calculatePackRounding(requestedQty: number, packSize: number) {
  const safePackSize = packSize > 0 ? packSize : 1;
  const billablePacks = Math.ceil(requestedQty / safePackSize);
  return {
    requestedQty,
    packSize: safePackSize,
    billablePacks,
    totalPiecesSupplied: billablePacks * safePackSize,
  };
}

// Trigram similarity stub for pure TS match fallback
export function trigramSimilarity(str1: string, str2: string): number {
  const s1 = `  ${str1.toLowerCase()} `;
  const s2 = `  ${str2.toLowerCase()} `;

  const getTrigrams = (str: string) => {
    const set = new Set<string>();
    for (let i = 0; i < str.length - 2; i++) {
      set.add(str.slice(i, i + 3));
    }
    return set;
  };

  const t1 = getTrigrams(s1);
  const t2 = getTrigrams(s2);

  if (t1.size === 0 || t2.size === 0) return 0;

  let intersection = 0;
  for (const trigram of t1) {
    if (t2.has(trigram)) {
      intersection++;
    }
  }

  return (2 * intersection) / (t1.size + t2.size);
}
