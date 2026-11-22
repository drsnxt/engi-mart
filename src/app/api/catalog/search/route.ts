import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import { componentFamily, componentVariant, searchImpression } from "../../../../db/schema";
import { catalogSearchSchema } from "../../../../lib/validation";
import { eq, or, ilike, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = catalogSearchSchema.safeParse({
      q: searchParams.get("q") ?? "",
      limit: searchParams.get("limit") ?? 8,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid search parameters", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { q, limit } = parsed.data;
    const queryTerm = `%${q.trim()}%`;

    const results = await db
      .select({
        id: componentVariant.id,
        canonicalSlug: componentVariant.canonicalSlug,
        displayName: componentVariant.displayName,
        mpn: componentVariant.mpn,
        package: componentVariant.package,
        packSize: componentVariant.packSize,
        unitLabel: componentVariant.unitLabel,
        specs: componentVariant.specs,
        familyId: componentFamily.id,
        familyName: componentFamily.name,
        category: componentFamily.category,
      })
      .from(componentVariant)
      .innerJoin(componentFamily, eq(componentVariant.familyId, componentFamily.id))
      .where(
        or(
          ilike(componentVariant.displayName, queryTerm),
          ilike(componentVariant.canonicalSlug, queryTerm),
          ilike(componentVariant.mpn, queryTerm),
          ilike(componentFamily.name, queryTerm)
        )
      )
      .limit(limit);

    // Record search impression asynchronously
    db.insert(searchImpression)
      .values({
        query: q,
        shownVariantIds: results.map((r) => r.id),
      })
      .catch(() => {});

    return NextResponse.json({
      query: q,
      count: results.length,
      results,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Search failed", message: err?.message },
      { status: 500 }
    );
  }
}
