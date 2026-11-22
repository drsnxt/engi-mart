import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../db";
import { bomSession, bomItem, shop, shopListing, componentVariant } from "../../../../../db/schema";
import { solveBasket } from "../../../../../core/optimizer";
import { CatalogShop, ShopOffer, BomItemRequirement } from "../../../../../core/types";
import { eq, inArray } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ viewId: string }> }
) {
  try {
    const { viewId } = await params;

    const session = await db.query.bomSession.findFirst({
      where: eq(bomSession.publicToken, viewId),
      with: {
        items: true,
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const matchedVariantIds = session.items
      .map((i) => i.matchedVariantId)
      .filter((id): id is string => id !== null);

    const allShops = await db.select().from(shop);
    const catalogShops: CatalogShop[] = allShops.map((s) => ({
      id: s.id,
      name: s.name,
      building: s.building,
      floor: s.floor,
      stallNo: s.stallNo,
      phone: s.phone,
    }));

    let allOffers: ShopOffer[] = [];

    if (matchedVariantIds.length > 0) {
      const listings = await db
        .select({
          shopId: shopListing.shopId,
          variantId: shopListing.variantId,
          pricePaisa: shopListing.pricePaisa,
          stockStatus: shopListing.stockStatus,
          confidence: shopListing.confidence,
          shopName: shop.name,
          variantSlug: componentVariant.canonicalSlug,
          displayName: componentVariant.displayName,
          packSize: componentVariant.packSize,
        })
        .from(shopListing)
        .innerJoin(shop, eq(shopListing.shopId, shop.id))
        .innerJoin(componentVariant, eq(shopListing.variantId, componentVariant.id))
        .where(inArray(shopListing.variantId, matchedVariantIds));

      allOffers = listings.map((l) => ({
        shopId: l.shopId,
        shopName: l.shopName,
        variantId: l.variantId,
        variantSlug: l.variantSlug,
        displayName: l.displayName,
        isSubstitute: false,
        unitPricePaisa: l.pricePaisa,
        packSize: l.packSize,
        packPricePaisa: l.pricePaisa,
        stockStatus: (l.stockStatus as any) || "in_stock",
        confidence: l.confidence ? parseFloat(l.confidence) : 0.8,
        assumedStock: l.stockStatus === "unknown",
      }));
    }

    const basketItems: BomItemRequirement[] = session.items.map((i) => ({
      id: i.id,
      rawText: i.rawText,
      qty: i.qty,
      variantId: i.matchedVariantId,
    }));

    const solved = solveBasket(basketItems, catalogShops, allOffers, {
      budgetPaisa: session.budgetPaisa,
      allowSubstitutes: false,
    });

    const formatPlanRunSheet = (plan: typeof solved.fastest) => {
      const stops = plan.shopIds.map((sid, idx) => {
        const s = catalogShops.find((cs) => cs.id === sid);
        const shopAllocations = plan.allocations.filter((a) => a.shopId === sid);
        return {
          stopNumber: idx + 1,
          shopId: sid,
          shopName: s?.name ?? "Unknown Shop",
          building: s?.building ?? "SP Road",
          floor: s?.floor ?? "Ground floor",
          stallNo: s?.stallNo ?? "",
          phone: s?.phone ?? null,
          items: shopAllocations.map((a) => {
            const itemDisplayName = a.displayName || a.rawText || "Electronic Component";
            const formattedName = a.isSubstitute
              ? `${itemDisplayName} (Substitute)`
              : a.requestedQty > 1 && a.packSize === 1
              ? `${a.requestedQty}x ${itemDisplayName}`
              : itemDisplayName;

            return {
              bomItemId: a.bomItemId,
              name: formattedName,
              requestedQty: a.requestedQty,
              packSize: a.packSize,
              billablePacks: a.billablePacks,
              estimatedCostRupees: (a.totalCostPaisa / 100).toFixed(0),
              confidence: Math.round(a.confidence * 100),
              stockStatus: a.stockStatus,
            };
          }),
          subtotalRupees: (
            shopAllocations.reduce((acc, a) => acc + a.totalCostPaisa, 0) / 100
          ).toFixed(0),
        };
      });

      return {
        id: plan.id,
        shopCount: plan.shopIds.length,
        totalRupees: (plan.estimatedTotalPaisa / 100).toFixed(0),
        budgetUpperBoundRupees: (plan.budgetUpperBoundPaisa / 100).toFixed(0),
        coverageRatio: `${plan.coverageCount}/${plan.totalItems}`,
        walkingMinutes: plan.walkingMinutes,
        planConfidencePercent: Math.round(plan.planConfidence * 100),
        stops,
        warnings: plan.warnings,
        valueCuts: plan.valueCuts,
      };
    };

    return NextResponse.json({
      meta: {
        viewId: session.publicToken,
        title: session.title,
        mode: session.mode,
        budgetRupees: session.budgetPaisa ? (session.budgetPaisa / 100).toFixed(0) : null,
        generatedAt: new Date().toISOString(),
      },
      fastestPlan: formatPlanRunSheet(solved.fastest),
      cheapestPlan: formatPlanRunSheet(solved.cheapest),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to generate run-sheet", message: err?.message },
      { status: 500 }
    );
  }
}
