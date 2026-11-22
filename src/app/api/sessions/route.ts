import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../db";
import { bomSession, bomItem, unmatchedQuery } from "../../../db/schema";
import { createSessionSchema } from "../../../lib/validation";
import { generateViewId, generateEditToken, hashEditToken } from "../../../lib/tokens";
import { parseBomInput } from "../../../core/normalize";
import { getAiProvider } from "../../../lib/ai";
import { getFullCatalog, matchCatalogVariant } from "../../../db/queries";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { mode, rawText, idea, title, maxStops, walkingTolerance } = parsed.data;
    const budgetPaisa =
      parsed.data.budgetPaisa ?? (parsed.data.budget ? Math.round(parsed.data.budget * 100) : null);

    const viewId = generateViewId();
    const editToken = generateEditToken();
    const editTokenHash = hashEditToken(editToken);
    const sessionTitle = title || (mode === "idea" ? "Smart Hardware Project" : "SP Road Parts List");

    // Retrieve full catalog variants with search aliases for robust matching
    const catalog = await getFullCatalog();

    let draftItems: Array<{ rawText: string; qty: number; candidateSlug?: string; note?: string }> = [];

    if (mode === "idea" && idea) {
      const ai = getAiProvider();
      const aiItems = await ai.parseIdeaToBom(idea);
      draftItems = aiItems.map((i) => ({
        rawText: i.rawText,
        qty: i.qty,
        candidateSlug: i.candidateSlug,
        note: i.role,
      }));
    } else if (rawText) {
      const parsedBom = parseBomInput(rawText);
      draftItems = parsedBom.map((p) => ({
        rawText: p.rawText,
        qty: p.qty,
        note: p.specHint,
      }));
    }

    // Persist Session
    const [insertedSession] = await db
      .insert(bomSession)
      .values({
        publicToken: viewId,
        editTokenHash,
        title: sessionTitle,
        mode,
        budgetPaisa,
        maxStops,
        walkingTolerance,
      })
      .returning();

    // Persist BOM items with match results
    const itemsToInsert = draftItems.map((item, index) => {
      const match = matchCatalogVariant(item.rawText, catalog, item.candidateSlug);
      return {
        sessionId: insertedSession.id,
        rawText: item.rawText,
        qty: item.qty,
        matchedVariantId: match.variantId,
        matchConfidence: match.confidence ? match.confidence.toString() : null,
        matchMethod: match.method,
        userConfirmed: false,
        note: item.note || match.reason || null,
        sortOrder: index,
      };
    });

    const insertedItems =
      itemsToInsert.length > 0
        ? await db.insert(bomItem).values(itemsToInsert).returning()
        : [];

    // Track any unmatched items
    for (const item of insertedItems) {
      if (!item.matchedVariantId) {
        db.insert(unmatchedQuery)
          .values({
            query: item.rawText,
            source: mode,
            sessionId: insertedSession.id,
          })
          .catch(() => {});
      }
    }

    return NextResponse.json(
      {
        viewId,
        editToken,
        title: insertedSession.title,
        mode: insertedSession.mode,
        budgetPaisa: insertedSession.budgetPaisa,
        maxStops: insertedSession.maxStops,
        items: insertedItems.map((i) => {
          const matchedVariant = catalog.find((c) => c.id === i.matchedVariantId);
          return {
            id: i.id,
            rawText: i.rawText,
            qty: i.qty,
            matchedVariantId: i.matchedVariantId,
            canonicalSlug: matchedVariant?.canonicalSlug ?? null,
            displayName: matchedVariant?.displayName ?? null,
            matchConfidence: i.matchConfidence ? parseFloat(i.matchConfidence) : null,
            matchMethod: i.matchMethod,
            userConfirmed: i.userConfirmed,
            note: i.note,
          };
        }),
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to create session", message: err?.message },
      { status: 500 }
    );
  }
}
