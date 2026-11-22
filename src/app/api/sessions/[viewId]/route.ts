import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import { bomSession, bomItem } from "../../../../db/schema";
import { updateSessionSchema } from "../../../../lib/validation";
import { verifyEditToken } from "../../../../lib/tokens";
import { getSessionWithItemsAndPrices } from "../../../../db/queries";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ viewId: string }> }
) {
  try {
    const { viewId } = await params;
    const result = await getSessionWithItemsAndPrices(viewId);

    if (!result) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to retrieve session", message: err?.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ viewId: string }> }
) {
  try {
    const { viewId } = await params;
    const editToken = req.headers.get("x-edit-token");

    if (!editToken) {
      return NextResponse.json(
        { error: "Unauthorized: Missing X-Edit-Token header" },
        { status: 401 }
      );
    }

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

    if (!verifyEditToken(editToken, session.editTokenHash)) {
      return NextResponse.json(
        { error: "Forbidden: Invalid edit token" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = updateSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid update payload", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { title, budgetPaisa, maxStops, walkingTolerance, items } = parsed.data;

    // Update session table fields
    const sessionUpdates: Partial<typeof bomSession.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (title !== undefined) sessionUpdates.title = title;
    if (budgetPaisa !== undefined) sessionUpdates.budgetPaisa = budgetPaisa;
    if (maxStops !== undefined) sessionUpdates.maxStops = maxStops;
    if (walkingTolerance !== undefined) sessionUpdates.walkingTolerance = walkingTolerance;

    await db
      .update(bomSession)
      .set(sessionUpdates)
      .where(eq(bomSession.id, session.id));

    // Update items if provided
    if (items) {
      // Delete existing and reinsert or update
      await db.delete(bomItem).where(eq(bomItem.sessionId, session.id));

      if (items.length > 0) {
        await db.insert(bomItem).values(
          items.map((it, idx) => ({
            sessionId: session.id,
            rawText: it.rawText,
            qty: it.qty,
            matchedVariantId: it.matchedVariantId || null,
            userConfirmed: it.userConfirmed ?? true,
            note: it.note || null,
            sortOrder: idx,
          }))
        );
      }
    }

    const updatedItems = await db.query.bomItem.findMany({
      where: eq(bomItem.sessionId, session.id),
      orderBy: (items, { asc }) => [asc(items.sortOrder)],
    });

    return NextResponse.json({
      success: true,
      viewId,
      session: {
        title: sessionUpdates.title ?? session.title,
        budgetPaisa: sessionUpdates.budgetPaisa !== undefined ? sessionUpdates.budgetPaisa : session.budgetPaisa,
        maxStops: sessionUpdates.maxStops ?? session.maxStops,
        walkingTolerance: sessionUpdates.walkingTolerance ?? session.walkingTolerance,
      },
      items: updatedItems,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to update session", message: err?.message },
      { status: 500 }
    );
  }
}
