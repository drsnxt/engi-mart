import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../db";
import { bomSession, feedback, priceObservation, bomItem, shop } from "../../../../../db/schema";
import { feedbackSchema } from "../../../../../lib/validation";
import { eq } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ viewId: string }> }
) {
  try {
    const { viewId } = await params;
    const body = await req.json();

    const parsed = feedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid feedback payload", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const session = await db.query.bomSession.findFirst({
      where: eq(bomSession.publicToken, viewId),
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const { bomItemId, found, pricePaidPaisa, priceSentiment, note } = parsed.data;

    const [insertedFeedback] = await db
      .insert(feedback)
      .values({
        sessionId: session.id,
        bomItemId: bomItemId || null,
        found,
        pricePaidPaisa: pricePaidPaisa || null,
        priceSentiment: priceSentiment || null,
        note: note || null,
      })
      .returning();

    // If price paid was reported and the bomItem has a matched variant, append to price_observation!
    if (bomItemId && pricePaidPaisa && found) {
      const item = await db.query.bomItem.findFirst({
        where: eq(bomItem.id, bomItemId),
      });

      if (item && item.matchedVariantId) {
        // Query any shop from the session or default shop
        const firstShop = await db.query.shop.findFirst();
        if (firstShop) {
          await db.insert(priceObservation).values({
            variantId: item.matchedVariantId,
            shopId: firstShop.id,
            pricePaisa: pricePaidPaisa,
            stockStatus: "in_stock",
            source: "student",
            sessionId: session.id,
            note: note ? `Student feedback: ${note}` : "Student post-purchase report",
          });
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        feedbackId: insertedFeedback.id,
        message: "Feedback recorded. Thank you for helping keep SP Road data fresh!",
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to record feedback", message: err?.message },
      { status: 500 }
    );
  }
}
