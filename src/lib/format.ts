export function inrFromPaisa(paisa: number): string {
  return `₹${Math.round(paisa / 100).toLocaleString("en-IN")}`;
}

export function inrRange(lowPaisa: number, highPaisa: number): string {
  const low = inrFromPaisa(lowPaisa);
  const high = inrFromPaisa(highPaisa);
  return low === high ? low : `${low}–${high.replace("₹", "")}`;
}

export function pct(value: number): string {
  return `${Math.round(value * 100)}%`;
}
