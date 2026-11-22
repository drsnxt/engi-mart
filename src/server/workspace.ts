import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  bomItem,
  bomSession,
  componentFamily,
  componentVariant,
  shop,
  shopListing,
} from "@/db/schema";
import { solveBasket } from "@/core/optimizer";
import type {
  BomItemRequirement,
  CatalogShop,
  ShopOffer,
  SolveBasketResult,
  StockStatus,
} from "@/core/types";

export type WorkspaceListing = {
  id: string;
  shopId: string;
  shopName: string;
  shopItemName: string;
  variantId: string;
  pricePaisa: number;
  stockStatus: StockStatus;
  confidence: number | null;
  notes: string | null;
  lastVerifiedAt: Date | null;
  building: string | null;
  floor: string | null;
  stallNo: string | null;
  phone: string | null;
};

export type WorkspaceItem = {
  id: string;
  rawText: string;
  qty: number;
  note: string | null;
  sortOrder: number;
  matchConfidence: number | null;
  matchMethod: string | null;
  variant: {
    id: string;
    displayName: string;
    canonicalSlug: string;
    mpn: string | null;
    manufacturer: string | null;
    package: string;
    packSize: number;
    unitLabel: string;
    familyName: string;
  } | null;
  offers: WorkspaceListing[];
};

export type Workspace = {
  session: typeof bomSession.$inferSelect;
  items: WorkspaceItem[];
  plans: SolveBasketResult;
  listings: WorkspaceListing[];
  shops: CatalogShop[];
};

function numberOrNull(value: string | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function getWorkspace(viewId: string): Promise<Workspace | null> {
  const [session] = await db
    .select()
    .from(bomSession)
    .where(eq(bomSession.publicToken, viewId))
    .limit(1);

  if (!session) return null;

  const rows = await db
    .select()
    .from(bomItem)
    .where(eq(bomItem.sessionId, session.id))
    .orderBy(asc(bomItem.sortOrder), asc(bomItem.createdAt));

  const variantIds = rows
    .map((row) => row.matchedVariantId)
    .filter((id): id is string => Boolean(id));

  const variantRows =
    variantIds.length > 0
      ? await db
          .select({
            id: componentVariant.id,
            displayName: componentVariant.displayName,
            canonicalSlug: componentVariant.canonicalSlug,
            mpn: componentVariant.mpn,
            manufacturer: componentVariant.manufacturer,
            package: componentVariant.package,
            packSize: componentVariant.packSize,
            unitLabel: componentVariant.unitLabel,
            familyName: componentFamily.name,
          })
          .from(componentVariant)
          .innerJoin(componentFamily, eq(componentVariant.familyId, componentFamily.id))
          .where(inArray(componentVariant.id, variantIds))
      : [];

  const listingRows =
    variantIds.length > 0
      ? await db
          .select({
            id: shopListing.id,
            shopId: shopListing.shopId,
            shopName: shop.name,
            shopItemName: shopListing.shopItemName,
            variantId: shopListing.variantId,
            pricePaisa: shopListing.pricePaisa,
            stockStatus: shopListing.stockStatus,
            confidence: shopListing.confidence,
            notes: shopListing.notes,
            lastVerifiedAt: shopListing.lastVerifiedAt,
            building: shop.building,
            floor: shop.floor,
            stallNo: shop.stallNo,
            phone: shop.phone,
          })
          .from(shopListing)
          .innerJoin(shop, eq(shopListing.shopId, shop.id))
          .where(inArray(shopListing.variantId, variantIds))
      : [];

  const listings: WorkspaceListing[] = listingRows.map((row) => ({
    ...row,
    stockStatus: row.stockStatus as StockStatus,
    confidence: numberOrNull(row.confidence),
  }));

  const shopRows = await db.select().from(shop);

  const shops: CatalogShop[] = shopRows.map((row) => ({
    id: row.id,
    name: row.name,
    building: row.building,
    floor: row.floor,
    stallNo: row.stallNo,
    phone: row.phone,
  }));

  const variantsById = new Map(variantRows.map((variant) => [variant.id, variant]));

  const items: WorkspaceItem[] = rows.map((row) => {
    const variant = row.matchedVariantId ? variantsById.get(row.matchedVariantId) ?? null : null;
    return {
      id: row.id,
      rawText: row.rawText,
      qty: row.qty,
      note: row.note,
      sortOrder: row.sortOrder ?? 0,
      matchConfidence: numberOrNull(row.matchConfidence),
      matchMethod: row.matchMethod,
      variant,
      offers: listings.filter((listing) => listing.variantId === row.matchedVariantId),
    };
  });

  const basketItems: BomItemRequirement[] = items.map((item) => ({
    id: item.id,
    rawText: item.rawText,
    qty: item.qty,
    variantId: item.variant?.id ?? null,
  }));

  const shopOffers: ShopOffer[] = listings.map((listing) => ({
    shopId: listing.shopId,
    shopName: listing.shopName,
    variantId: listing.variantId,
    variantSlug: variantsById.get(listing.variantId)?.canonicalSlug ?? "",
    displayName: variantsById.get(listing.variantId)?.displayName ?? listing.shopItemName,
    isSubstitute: false,
    unitPricePaisa: listing.pricePaisa,
    packSize: variantsById.get(listing.variantId)?.packSize ?? 1,
    packPricePaisa: listing.pricePaisa,
    stockStatus: listing.stockStatus,
    confidence: listing.confidence ?? 0.7,
    assumedStock: listing.stockStatus === "unknown",
  }));

  const plans = solveBasket(basketItems, shops, shopOffers, {
    budgetPaisa: session.budgetPaisa,
    allowSubstitutes: false,
  });

  return { session, items, plans, listings, shops };
}
