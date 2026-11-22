import { db } from "./index";
import {
  bomSession,
  bomItem,
  componentVariant,
  componentFamily,
  shopListing,
  priceObservation,
  shop,
} from "./schema";
import { eq, inArray, sql } from "drizzle-orm";
import { calculateConfidence } from "../core/confidence";

export interface CatalogVariantWithFamily {
  id: string;
  familyId: string;
  canonicalSlug: string;
  displayName: string;
  mpn: string | null;
  package: string;
  packSize: number;
  unitLabel: string;
  specs: any;
  familyName: string;
  category: string;
  searchAliases: string[];
}

export async function getFullCatalog(): Promise<CatalogVariantWithFamily[]> {
  const rows = await db
    .select({
      id: componentVariant.id,
      familyId: componentVariant.familyId,
      canonicalSlug: componentVariant.canonicalSlug,
      displayName: componentVariant.displayName,
      mpn: componentVariant.mpn,
      package: componentVariant.package,
      packSize: componentVariant.packSize,
      unitLabel: componentVariant.unitLabel,
      specs: componentVariant.specs,
      familyName: componentFamily.name,
      category: componentFamily.category,
      searchAliases: componentFamily.searchAliases,
    })
    .from(componentVariant)
    .innerJoin(componentFamily, eq(componentVariant.familyId, componentFamily.id));

  return rows;
}

export interface MatchResult {
  variantId: string | null;
  confidence: number | null;
  method: "exact" | "alias" | "trigram" | "ambiguous" | null;
  reason?: string;
}

export function matchCatalogVariant(
  rawText: string,
  catalog: CatalogVariantWithFamily[],
  candidateSlug?: string
): MatchResult {
  if (candidateSlug) {
    const direct = catalog.find((v) => v.canonicalSlug === candidateSlug);
    if (direct) {
      return { variantId: direct.id, confidence: 1.0, method: "exact" };
    }
  }

  let text = rawText.toLowerCase().trim();
  // Strip leading/trailing quantity prefixes like "1x", "40x", "2 pcs", "qty 2"
  text = text.replace(/^(\d+\s*x|\d+\s*(?:pcs|nos|pieces|m\b)|qty[:=]?\s*\d+)\s+/i, "");
  text = text.replace(/\s+(x\s*\d+|\d+\s*(?:pcs|nos|pieces)|qty[:=]?\s*\d+)$/i, "");

  const normalizedText = text
    .replace(/[^\w\s.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // 1. Ambiguity Guards for genuinely ambiguous generic queries
  // Generic "soil sensor" / "soil moisture sensor" without variant specifier
  if (
    normalizedText === "soil sensor" ||
    normalizedText === "soil moisture sensor" ||
    normalizedText === "soil moisture"
  ) {
    return {
      variantId: null,
      confidence: 0.5,
      method: "ambiguous",
      reason: "Ambiguous: choose between capacitive (corrosion resistant) or resistive probe.",
    };
  }

  // Generic "esp32" / "esp 32" without variant specifier (devkit, 30-pin, 38-pin, cam, s3)
  if (
    normalizedText === "esp32" ||
    normalizedText === "esp-32" ||
    normalizedText === "esp 32" ||
    normalizedText === "nodemcu 32"
  ) {
    return {
      variantId: null,
      confidence: 0.5,
      method: "ambiguous",
      reason: "Ambiguous: choose between 30-pin, 38-pin DevKit, or ESP32-CAM.",
    };
  }

  // 2. Direct Slug / MPN / DisplayName exact match
  for (const v of catalog) {
    if (
      normalizedText === v.canonicalSlug.toLowerCase() ||
      (v.mpn && normalizedText === v.mpn.toLowerCase()) ||
      normalizedText === v.displayName.toLowerCase()
    ) {
      return { variantId: v.id, confidence: 1.0, method: "exact" };
    }
  }

  // 3. Family Alias & Keyword Search
  let bestCandidate: { variant: CatalogVariantWithFamily; score: number } | null = null;

  for (const v of catalog) {
    let score = 0;
    const vSlug = v.canonicalSlug.toLowerCase();
    const vName = v.displayName.toLowerCase();

    // Check family aliases
    for (const alias of v.searchAliases) {
      const a = alias.toLowerCase().trim();
      if (normalizedText === a) {
        score = Math.max(score, 80);
      } else if (normalizedText.includes(a)) {
        score = Math.max(score, 60 + a.length);
      }
    }

    // Check variant display name & slug overlap
    if (normalizedText.includes(vSlug)) {
      score = Math.max(score, 90);
    }

    // Keyword matching
    const tokens = normalizedText.split(/\s+/);
    let tokenMatches = 0;
    for (const token of tokens) {
      if (token.length > 2 && (vName.includes(token) || vSlug.includes(token))) {
        tokenMatches++;
      }
    }
    const tokenScore = tokenMatches * 15;
    if (tokenScore > score) {
      score = tokenScore;
    }

    // Specific disambiguators
    if (normalizedText.includes("devkit")) {
      if (normalizedText.includes("38") && vSlug.includes("38pin")) {
        score += 60;
      } else if (!normalizedText.includes("38") && vSlug === "esp32-wroom-32-30pin") {
        score += 60;
      } else if (vName.includes("devkit")) {
        score += 30;
      }
    }
    if (normalizedText.includes("capacitive") && (vName.includes("capacitive") || vSlug.includes("capacitive"))) {
      if (normalizedText.includes("v2") && vSlug.includes("v20")) {
        score += 60;
      } else if (!normalizedText.includes("v2") && vSlug.includes("v12")) {
        score += 60;
      } else {
        score += 35;
      }
    }
    if (normalizedText.includes("resistive") && (vName.includes("resistive") || vSlug.includes("resistive"))) {
      score += 40;
    }
    if (normalizedText.includes("pump") && (vName.includes("pump") || vSlug.includes("pump"))) {
      score += 40;
    }
    if (normalizedText.includes("tubing") && (vName.includes("tubing") || vSlug.includes("tubing"))) {
      score += 40;
    }
    if ((normalizedText.includes("male-male") || normalizedText.includes("m-m") || normalizedText.includes("male to male")) && vSlug.includes("mm")) {
      score += 40;
    }
    if (normalizedText.includes("adapter") && (vName.includes("adapter") || vSlug.includes("adapter"))) {
      score += 40;
    }
    if (normalizedText.includes("5v") && normalizedText.includes("relay") && vSlug.includes("5v-1ch")) {
      score += 35;
    }

    if (score > (bestCandidate?.score ?? 0)) {
      bestCandidate = { variant: v, score };
    }
  }

  if (bestCandidate && bestCandidate.score >= 50) {
    const conf = Math.min(0.98, Math.max(0.75, Math.round((bestCandidate.score / 100) * 100) / 100));
    return {
      variantId: bestCandidate.variant.id,
      confidence: conf,
      method: "alias",
    };
  }

  return { variantId: null, confidence: null, method: null };
}

export async function getSessionWithItemsAndPrices(viewId: string) {
  const session = await db.query.bomSession.findFirst({
    where: eq(bomSession.publicToken, viewId),
    with: {
      items: {
        orderBy: (items, { asc }) => [asc(items.sortOrder)],
      },
    },
  });

  if (!session) return null;

  const matchedVariantIds = session.items
    .map((i) => i.matchedVariantId)
    .filter((id): id is string => id !== null);

  const variantsMap = new Map<string, any>();
  const priceBandsMap = new Map<string, { priceLow: number; priceHigh: number; confidence: number }>();

  if (matchedVariantIds.length > 0) {
    const variants = await db
      .select({
        id: componentVariant.id,
        canonicalSlug: componentVariant.canonicalSlug,
        displayName: componentVariant.displayName,
        package: componentVariant.package,
        packSize: componentVariant.packSize,
        unitLabel: componentVariant.unitLabel,
        specs: componentVariant.specs,
      })
      .from(componentVariant)
      .where(inArray(componentVariant.id, matchedVariantIds));

    for (const v of variants) {
      variantsMap.set(v.id, v);
    }

    const observations = await db
      .select()
      .from(priceObservation)
      .where(inArray(priceObservation.variantId, matchedVariantIds));

    for (const varId of matchedVariantIds) {
      const varObs = observations.filter((o) => o.variantId === varId);
      if (varObs.length > 0) {
        const conf = calculateConfidence(
          varObs.map((o) => ({
            pricePaisa: o.pricePaisa,
            stockStatus: o.stockStatus as any,
            observedAt: o.observedAt,
            source: o.source as any,
          }))
        );
        priceBandsMap.set(varId, {
          priceLow: Math.round(conf.priceBand.minPaisa / 100),
          priceHigh: Math.round(conf.priceBand.maxPaisa / 100),
          confidence: Math.round(conf.confidence * 100),
        });
      }
    }
  }

  const items = session.items.map((it) => {
    const variant = it.matchedVariantId ? variantsMap.get(it.matchedVariantId) : null;
    const band = it.matchedVariantId ? priceBandsMap.get(it.matchedVariantId) : null;

    return {
      id: it.id,
      rawText: it.rawText,
      qty: it.qty,
      matchedVariantId: it.matchedVariantId,
      canonicalSlug: variant?.canonicalSlug ?? null,
      displayName: variant?.displayName ?? null,
      packSize: variant?.packSize ?? 1,
      unitLabel: variant?.unitLabel ?? "unit",
      matchConfidence: it.matchConfidence ? parseFloat(it.matchConfidence) : null,
      matchMethod: it.matchMethod,
      userConfirmed: it.userConfirmed,
      note: it.note,
      priceBand: band ?? null,
    };
  });

  return {
    session: {
      id: session.id,
      viewId: session.publicToken,
      title: session.title,
      mode: session.mode,
      budgetPaisa: session.budgetPaisa,
      budgetRupees: session.budgetPaisa ? Math.round(session.budgetPaisa / 100) : null,
      maxStops: session.maxStops,
      walkingTolerance: session.walkingTolerance,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    },
    items,
  };
}
