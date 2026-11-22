import {
  AllocatedOffer,
  BomItemRequirement,
  CatalogShop,
  Plan,
  ShopOffer,
  SolveBasketResult,
  ValueCut,
} from "./types";
import { calculatePackRounding } from "./normalize";

export interface OptimizerOptions {
  budgetPaisa?: number | null;
  allowSubstitutes?: boolean;
}

function estimateWalkingMinutes(shops: CatalogShop[]): number {
  if (shops.length === 0) return 0;

  const floorPenalty = (floorStr?: string | null): number => {
    if (!floorStr) return 1;
    const lower = floorStr.toLowerCase();
    if (lower.includes("ground") || lower.includes("gf")) return 0;
    if (lower.includes("1")) return 1;
    if (lower.includes("2")) return 2;
    if (lower.includes("3")) return 3;
    return 1;
  };

  if (shops.length === 1) {
    // Entrance to shop (3 min) + floor penalty + stall search overhead (2 min)
    return 3 + floorPenalty(shops[0].floor) + 2;
  }

  // 2 shops: entrance (3 min) + shop1 floor + stall overhead (2 min) + transition (2 min) + shop2 floor + stall overhead (2 min)
  const fp1 = floorPenalty(shops[0].floor);
  const fp2 = floorPenalty(shops[1].floor);
  return 3 + fp1 + 2 + 2 + fp2 + 2;
}

export function solveBasket(
  items: BomItemRequirement[],
  shops: CatalogShop[],
  allOffers: ShopOffer[],
  options: OptimizerOptions = {}
): SolveBasketResult {
  const allowSubstitutes = options.allowSubstitutes ?? false;
  const budgetPaisa = options.budgetPaisa ?? null;

  // Filter out completely out-of-stock offers
  const eligibleOffers = allOffers.filter((o) => o.stockStatus !== "out");

  const shopMap = new Map<string, CatalogShop>(shops.map((s) => [s.id, s]));

  // Helper to generate combinations of shops up to size k
  const getSubsets = (k: number): string[][] => {
    const shopIds = shops.map((s) => s.id);
    const subsets: string[][] = [];

    // k=1
    for (const id of shopIds) {
      subsets.push([id]);
    }

    // k=2
    if (k >= 2) {
      for (let i = 0; i < shopIds.length; i++) {
        for (let j = i + 1; j < shopIds.length; j++) {
          subsets.push([shopIds[i], shopIds[j]]);
        }
      }
    }

    return subsets;
  };

  // Evaluate a specific subset of shops
  const evaluateSubset = (subsetShopIds: string[]): {
    allocations: AllocatedOffer[];
    missingItems: Array<{ id: string; rawText: string }>;
    totalEstimatedPaisa: number;
    budgetUpperBoundPaisa: number;
    planConfidence: number;
    exactCount: number;
  } => {
    const allocations: AllocatedOffer[] = [];
    const missingItems: Array<{ id: string; rawText: string }> = [];
    const shopSet = new Set(subsetShopIds);

    let sumP50 = 0;
    let sumP75 = 0;
    let sumConfidence = 0;
    let exactCount = 0;

    for (const item of items) {
      const allowedVariantIds = new Set<string>();
      if (item.variantId) {
        allowedVariantIds.add(item.variantId);
      }
      if (allowSubstitutes && item.allowedSubstituteIds) {
        for (const subId of item.allowedSubstituteIds) {
          allowedVariantIds.add(subId);
        }
      }

      // Candidate offers in this subset
      const matchingOffers = eligibleOffers.filter(
        (o) => shopSet.has(o.shopId) && allowedVariantIds.has(o.variantId)
      );

      if (matchingOffers.length === 0) {
        missingItems.push({ id: item.id, rawText: item.rawText });
        continue;
      }

      // Sort offers: exact first, then cheapest total cost, then highest confidence
      matchingOffers.sort((a, b) => {
        // Prioritize exact match over substitute
        if (a.isSubstitute !== b.isSubstitute) {
          return a.isSubstitute ? 1 : -1;
        }
        const roundingA = calculatePackRounding(item.qty, a.packSize);
        const roundingB = calculatePackRounding(item.qty, b.packSize);
        const costA = roundingA.billablePacks * a.packPricePaisa;
        const costB = roundingB.billablePacks * b.packPricePaisa;
        if (costA !== costB) {
          return costA - costB;
        }
        return b.confidence - a.confidence;
      });

      const best = matchingOffers[0];
      const rounding = calculatePackRounding(item.qty, best.packSize);
      const totalCostPaisa = rounding.billablePacks * best.packPricePaisa;
      const p50 = totalCostPaisa;
      // p75 conservatively estimated + 10% if low confidence or unknown stock
      const p75 = best.assumedStock || best.confidence < 0.6
        ? Math.round(totalCostPaisa * 1.15)
        : Math.round(totalCostPaisa * 1.05);

      if (!best.isSubstitute) {
        exactCount++;
      }

      sumP50 += p50;
      sumP75 += p75;
      sumConfidence += best.confidence;

      allocations.push({
        bomItemId: item.id,
        variantId: best.variantId,
        variantSlug: best.variantSlug,
        displayName: best.displayName,
        rawText: item.rawText,
        shopId: best.shopId,
        shopName: best.shopName,
        isSubstitute: best.isSubstitute,
        requestedQty: item.qty,
        packSize: best.packSize,
        billablePacks: rounding.billablePacks,
        packPricePaisa: best.packPricePaisa,
        totalCostPaisa,
        p50Paisa: p50,
        p75Paisa: p75,
        confidence: best.confidence,
        stockStatus: best.stockStatus,
        assumedStock: best.assumedStock,
      });
    }

    const coverageCount = allocations.length;
    const totalItemsCount = items.length > 0 ? items.length : 1;
    const meanConfidence = coverageCount > 0 ? sumConfidence / coverageCount : 0;
    const planConfidence = (coverageCount / totalItemsCount) * meanConfidence;

    return {
      allocations,
      missingItems,
      totalEstimatedPaisa: sumP50,
      budgetUpperBoundPaisa: sumP75,
      planConfidence: Math.round(planConfidence * 1000) / 1000,
      exactCount,
    };
  };

  // Build Plan struct
  const buildPlan = (
    id: "fastest" | "cheapest",
    shopIds: string[],
    evalResult: ReturnType<typeof evaluateSubset>
  ): Plan => {
    const selectedShops = shopIds
      .map((sid) => shopMap.get(sid))
      .filter((s): s is CatalogShop => s !== undefined);

    const walkingMinutes = estimateWalkingMinutes(selectedShops);
    const warnings: string[] = [];
    const valueCuts: ValueCut[] = [];

    if (evalResult.missingItems.length > 0) {
      warnings.push(
        `${evalResult.missingItems.length} items not available in this shop selection.`
      );
    }

    // Budget check
    if (budgetPaisa && evalResult.totalEstimatedPaisa > budgetPaisa) {
      const delta = evalResult.totalEstimatedPaisa - budgetPaisa;
      warnings.push(
        `Estimated plan total (₹${(evalResult.totalEstimatedPaisa / 100).toFixed(
          0
        )}) exceeds budget (₹${(budgetPaisa / 100).toFixed(0)}) by ₹${(
          delta / 100
        ).toFixed(0)}.`
      );

      // Value cut suggestions
      // 1. Check if any item is marked optional
      for (const alloc of evalResult.allocations) {
        const req = items.find((i) => i.id === alloc.bomItemId);
        if (req?.optional) {
          valueCuts.push({
            type: "drop_optional",
            title: `Remove optional item: ${req.rawText}`,
            savingsPaisa: alloc.totalCostPaisa,
            bomItemId: alloc.bomItemId,
            tradeoff: "Eliminate nice-to-have component to meet budget.",
          });
        }
      }
    }

    return {
      id,
      shopIds,
      shopNames: selectedShops.map((s) => s.name),
      estimatedTotalPaisa: evalResult.totalEstimatedPaisa,
      budgetUpperBoundPaisa: evalResult.budgetUpperBoundPaisa,
      coverageCount: evalResult.allocations.length,
      totalItems: items.length,
      missingItems: evalResult.missingItems,
      walkingMinutes,
      planConfidence: evalResult.planConfidence,
      allocations: evalResult.allocations,
      exactCount: evalResult.exactCount,
      valueCuts,
      warnings,
    };
  };

  // Evaluate Fastest (k=1)
  const subsets1 = getSubsets(1);
  let bestFastestPlan: Plan | null = null;
  let bestFastestEval: ReturnType<typeof evaluateSubset> | null = null;
  let bestFastestShopIds: string[] = [];

  for (const subset of subsets1) {
    const res = evaluateSubset(subset);
    if (!bestFastestEval) {
      bestFastestEval = res;
      bestFastestShopIds = subset;
      continue;
    }

    // Fastest Ranking:
    // 1. coverage DESC
    // 2. estimated total ASC
    // 3. plan confidence DESC
    // 4. walking ASC
    // 5. exact count DESC
    if (res.allocations.length !== bestFastestEval.allocations.length) {
      if (res.allocations.length > bestFastestEval.allocations.length) {
        bestFastestEval = res;
        bestFastestShopIds = subset;
      }
      continue;
    }
    if (res.totalEstimatedPaisa !== bestFastestEval.totalEstimatedPaisa) {
      if (res.totalEstimatedPaisa < bestFastestEval.totalEstimatedPaisa) {
        bestFastestEval = res;
        bestFastestShopIds = subset;
      }
      continue;
    }
    if (res.planConfidence !== bestFastestEval.planConfidence) {
      if (res.planConfidence > bestFastestEval.planConfidence) {
        bestFastestEval = res;
        bestFastestShopIds = subset;
      }
      continue;
    }
    const currentWalking = estimateWalkingMinutes(
      subset.map((id) => shopMap.get(id)!).filter((s): s is CatalogShop => Boolean(s))
    );
    const bestWalking = estimateWalkingMinutes(
      bestFastestShopIds.map((id) => shopMap.get(id)!).filter((s): s is CatalogShop => Boolean(s))
    );
    if (currentWalking !== bestWalking) {
      if (currentWalking < bestWalking) {
        bestFastestEval = res;
        bestFastestShopIds = subset;
      }
      continue;
    }
    if (res.exactCount > bestFastestEval.exactCount) {
      bestFastestEval = res;
      bestFastestShopIds = subset;
    }
  }

  bestFastestPlan = bestFastestEval
    ? buildPlan("fastest", bestFastestShopIds, bestFastestEval)
    : buildPlan("fastest", [], {
        allocations: [],
        missingItems: items.map((i) => ({ id: i.id, rawText: i.rawText })),
        totalEstimatedPaisa: 0,
        budgetUpperBoundPaisa: 0,
        planConfidence: 0,
        exactCount: 0,
      });

  // Evaluate Cheapest (k=2)
  const subsets2 = getSubsets(2);
  let bestCheapestPlan: Plan | null = null;
  let bestCheapestEval: ReturnType<typeof evaluateSubset> | null = null;
  let bestCheapestShopIds: string[] = [];

  for (const subset of subsets2) {
    const res = evaluateSubset(subset);
    if (!bestCheapestEval) {
      bestCheapestEval = res;
      bestCheapestShopIds = subset;
      continue;
    }

    // Cheapest Ranking:
    // 1. coverage DESC
    // 2. estimated total ASC
    // 3. plan confidence DESC
    // 4. stops ASC
    // 5. exact count DESC
    if (res.allocations.length !== bestCheapestEval.allocations.length) {
      if (res.allocations.length > bestCheapestEval.allocations.length) {
        bestCheapestEval = res;
        bestCheapestShopIds = subset;
      }
      continue;
    }
    if (res.totalEstimatedPaisa !== bestCheapestEval.totalEstimatedPaisa) {
      if (res.totalEstimatedPaisa < bestCheapestEval.totalEstimatedPaisa) {
        bestCheapestEval = res;
        bestCheapestShopIds = subset;
      }
      continue;
    }
    if (res.planConfidence !== bestCheapestEval.planConfidence) {
      if (res.planConfidence > bestCheapestEval.planConfidence) {
        bestCheapestEval = res;
        bestCheapestShopIds = subset;
      }
      continue;
    }
    if (subset.length !== bestCheapestShopIds.length) {
      if (subset.length < bestCheapestShopIds.length) {
        bestCheapestEval = res;
        bestCheapestShopIds = subset;
      }
      continue;
    }
    if (res.exactCount > bestCheapestEval.exactCount) {
      bestCheapestEval = res;
      bestCheapestShopIds = subset;
    }
  }

  bestCheapestPlan = bestCheapestEval
    ? buildPlan("cheapest", bestCheapestShopIds, bestCheapestEval)
    : buildPlan("cheapest", [], {
        allocations: [],
        missingItems: items.map((i) => ({ id: i.id, rawText: i.rawText })),
        totalEstimatedPaisa: 0,
        budgetUpperBoundPaisa: 0,
        planConfidence: 0,
        exactCount: 0,
      });

  return {
    fastest: bestFastestPlan,
    cheapest: bestCheapestPlan,
  };
}
