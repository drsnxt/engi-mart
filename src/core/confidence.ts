import { ConfidenceResult, PriceObservationInput, SourceType } from "./types";

export const SOURCE_WEIGHTS: Record<SourceType, number> = {
  audit: 1.0,
  bill: 0.8,
  shop_whatsapp: 0.7,
  student: 0.4,
  import: 0.5,
};

export function calculateConfidence(
  observations: PriceObservationInput[],
  referenceDate: Date = new Date()
): ConfidenceResult {
  if (observations.length === 0) {
    return {
      confidence: 0.05,
      isStale: true,
      baseReliability: 0.05,
      agreement: 0.6,
      sampleFactor: 0.1,
      newestAgeDays: 999,
      priceBand: {
        minPaisa: 0,
        maxPaisa: 0,
        p50Paisa: 0,
        p75Paisa: 0,
        isLowConfidence: true,
      },
    };
  }

  const refTime = referenceDate.getTime();
  let newestAgeDays = Infinity;
  let prodUnreliable = 1.0;

  const validObservations = observations.map((obs) => {
    const obsTime = new Date(obs.observedAt).getTime();
    const ageDays = Math.max(0, (refTime - obsTime) / (1000 * 60 * 60 * 24));
    if (ageDays < newestAgeDays) {
      newestAgeDays = ageDays;
    }

    const w = SOURCE_WEIGHTS[obs.source] ?? 0.5;
    const r = Math.pow(0.5, ageDays / 14); // 14-day half life
    const q_i = Math.min(1, Math.max(0, w * r));

    prodUnreliable *= 1 - q_i;

    return {
      ...obs,
      ageDays,
      reliability: q_i,
    };
  });

  const n = validObservations.length;
  const B = Math.max(0, 1 - prodUnreliable);

  // Agreement A
  const prices = validObservations.map((o) => o.pricePaisa).sort((a, b) => a - b);
  let A = 0.6;
  if (n >= 2) {
    const mean = prices.reduce((acc, p) => acc + p, 0) / n;
    if (mean > 0) {
      const variance =
        prices.reduce((acc, p) => acc + Math.pow(p - mean, 2), 0) / n;
      const stddev = Math.sqrt(variance);
      const cv = stddev / mean;
      A = 1 / (1 + cv);
    }
  }

  // Sample factor S
  const S = 1 - Math.pow(0.5, n / 2);

  // Raw Confidence C
  let C = B * (0.65 + 0.25 * A + 0.1 * S);
  let isStale = false;

  // Stale check: newest observation > 45 days
  if (newestAgeDays > 45) {
    isStale = true;
    if (C > 0.3) {
      C = 0.3;
    }
  }

  // Clamp 0.05 .. 0.97
  const finalC = Math.min(0.97, Math.max(0.05, Math.round(C * 1000) / 1000));

  // Price band calculation
  let minPaisa = prices[0];
  let maxPaisa = prices[n - 1];
  let p50Paisa = prices[Math.floor(n * 0.5)] ?? minPaisa;
  let p75Paisa = prices[Math.floor(n * 0.75)] ?? maxPaisa;

  if (n >= 4) {
    // Interquartile range (p25-p75)
    const p25 = prices[Math.floor(n * 0.25)];
    const p75 = prices[Math.floor(n * 0.75)];
    minPaisa = p25;
    maxPaisa = p75;
  }

  const isLowConfidence = finalC < 0.5;
  if (isLowConfidence) {
    // Widen band by 10%
    minPaisa = Math.round(minPaisa * 0.9);
    maxPaisa = Math.round(maxPaisa * 1.1);
    p75Paisa = Math.round(p75Paisa * 1.1);
  }

  return {
    confidence: finalC,
    isStale,
    baseReliability: Math.round(B * 1000) / 1000,
    agreement: Math.round(A * 1000) / 1000,
    sampleFactor: Math.round(S * 1000) / 1000,
    newestAgeDays: Math.round(newestAgeDays * 10) / 10,
    priceBand: {
      minPaisa,
      maxPaisa,
      p50Paisa,
      p75Paisa,
      isLowConfidence,
    },
  };
}
