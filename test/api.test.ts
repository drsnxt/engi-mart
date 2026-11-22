import { describe, it, expect } from "vitest";
import { GET as healthGet } from "../src/app/api/health/route";
import { GET as searchGet } from "../src/app/api/catalog/search/route";
import { POST as sessionsPost } from "../src/app/api/sessions/route";
import { GET as sessionGet, PATCH as sessionsPatch } from "../src/app/api/sessions/[viewId]/route";
import { GET as runSheetGet } from "../src/app/api/sessions/[viewId]/run-sheet/route";
import { POST as feedbackPost } from "../src/app/api/sessions/[viewId]/feedback/route";
import { NextRequest } from "next/server";

describe("API Route Handlers Integration", () => {
  it("GET /api/health returns database: connected", async () => {
    const res = await healthGet();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("ok");
    expect(data.database).toBe("connected");
  });

  it("GET /api/catalog/search?q=esp32 returns matching variants", async () => {
    const req = new NextRequest("http://localhost:3000/api/catalog/search?q=esp32");
    const res = await searchGet(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.count).toBeGreaterThan(0);
    expect(data.results[0].canonicalSlug).toContain("esp32");
  });

  it("Canonical 7-line BOM matches all 7 seeded variants with proper quantities and slugs", async () => {
    const canonicalBom = [
      "1x ESP32 DevKit",
      "1x capacitive soil moisture sensor",
      "1x 5V relay module",
      "1x 3-6V submersible pump",
      "2m silicone tubing 6mm ID",
      "40x jumper wires male-male",
      "1x 5V 2A DC adapter",
    ].join("\n");

    const req = new NextRequest("http://localhost:3000/api/sessions", {
      method: "POST",
      body: JSON.stringify({
        mode: "bom",
        title: "Smart Plant Watering System",
        rawText: canonicalBom,
        budgetPaisa: 150000,
      }),
    });

    const res = await sessionsPost(req);
    expect(res.status).toBe(201);
    const data = await res.json();

    expect(data.items.length).toBe(7);

    // Verify all 7 items are matched
    for (const item of data.items) {
      expect(item.matchedVariantId).not.toBeNull();
      expect(item.canonicalSlug).toBeDefined();
    }

    const slugs = data.items.map((i: any) => i.canonicalSlug);
    expect(slugs).toContain("esp32-wroom-32-30pin");
    expect(slugs).toContain("soil-sensor-capacitive-v12");
    expect(slugs).toContain("relay-module-5v-1ch");
    expect(slugs).toContain("pump-submersible-3-6v");
    expect(slugs).toContain("silicone-tubing-6mm-id");
    expect(slugs).toContain("jumper-wires-mm-40");
    expect(slugs).toContain("power-adapter-5v2a-dc");

    // Verify GET /api/sessions/[viewId] returns session metadata and price bands
    const viewId = data.viewId;
    const getReq = new NextRequest(`http://localhost:3000/api/sessions/${viewId}`);
    const getRes = await sessionGet(getReq, { params: Promise.resolve({ viewId }) });
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();

    expect(getData.session.title).toBe("Smart Plant Watering System");
    expect(getData.session.budgetRupees).toBe(1500);
    expect(getData.items.length).toBe(7);
    expect(getData.items[0].displayName).toBeDefined();
    expect(getData.items[0].priceBand).toBeDefined();
    expect(getData.items[0].priceBand.priceLow).toBeGreaterThan(0);

    // Verify run-sheet returns human readable item names (NOT raw UUIDs)
    const runSheetReq = new NextRequest(`http://localhost:3000/api/sessions/${viewId}/run-sheet`);
    const runSheetRes = await runSheetGet(runSheetReq, { params: Promise.resolve({ viewId }) });
    expect(runSheetRes.status).toBe(200);
    const runSheetData = await runSheetRes.json();

    expect(runSheetData.fastestPlan).toBeDefined();
    expect(runSheetData.fastestPlan.stops.length).toBeGreaterThan(0);

    const firstStop = runSheetData.fastestPlan.stops[0];
    expect(firstStop.shopName).toBeDefined();
    expect(firstStop.items.length).toBeGreaterThan(0);

    // Check item name does NOT equal variantId UUID
    const firstItem = firstStop.items[0];
    expect(firstItem.name).not.toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    expect(firstItem.billablePacks).toBeGreaterThanOrEqual(1);
  });

  it("Ambiguity handling: generic 'soil sensor' and 'esp32' remain ambiguous", async () => {
    const ambiguousBom = "1x soil sensor\n1x esp32";
    const req = new NextRequest("http://localhost:3000/api/sessions", {
      method: "POST",
      body: JSON.stringify({
        mode: "bom",
        title: "Ambiguous Test",
        rawText: ambiguousBom,
      }),
    });

    const res = await sessionsPost(req);
    expect(res.status).toBe(201);
    const data = await res.json();

    expect(data.items.length).toBe(2);
    // Both generic items should be flagged ambiguous without a forced match
    expect(data.items[0].matchedVariantId).toBeNull();
    expect(data.items[0].matchMethod).toBe("ambiguous");
    expect(data.items[1].matchedVariantId).toBeNull();
    expect(data.items[1].matchMethod).toBe("ambiguous");
  });

  it("GET /api/sessions/[viewId] returns 404 for unknown session", async () => {
    const req = new NextRequest("http://localhost:3000/api/sessions/nonexistent_token_999");
    const res = await sessionGet(req, {
      params: Promise.resolve({ viewId: "nonexistent_token_999" }),
    });
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe("Session not found");
  });

  it("Full session lifecycle: create BOM, patch session, get run-sheet, submit feedback", async () => {
    // 1. Create session with BOM text
    const createReq = new NextRequest("http://localhost:3000/api/sessions", {
      method: "POST",
      body: JSON.stringify({
        mode: "bom",
        title: "Test Line Follower Project",
        rawText: "1x ESP32 DevKit\n1x 5V relay module\n4x 5mm Red LEDs (pack of 10)",
        budgetPaisa: 50000,
      }),
    });
    const createRes = await sessionsPost(createReq);
    expect(createRes.status).toBe(201);
    const createdData = await createRes.json();
    expect(createdData.viewId).toBeDefined();
    expect(createdData.editToken).toBeDefined();
    expect(createdData.items.length).toBe(3);

    const { viewId, editToken } = createdData;

    // 2. Patch session with edit token
    const patchReq = new NextRequest(`http://localhost:3000/api/sessions/${viewId}`, {
      method: "PATCH",
      headers: {
        "x-edit-token": editToken,
      },
      body: JSON.stringify({
        title: "Updated Line Follower Project",
        budgetPaisa: 60000,
      }),
    });
    const patchRes = await sessionsPatch(patchReq, {
      params: Promise.resolve({ viewId }),
    });
    expect(patchRes.status).toBe(200);
    const patchData = await patchRes.json();
    expect(patchData.session.title).toBe("Updated Line Follower Project");

    // 3. Test unauthorized patch (wrong edit token)
    const unauthorizedReq = new NextRequest(`http://localhost:3000/api/sessions/${viewId}`, {
      method: "PATCH",
      headers: {
        "x-edit-token": "wrong-token",
      },
      body: JSON.stringify({ title: "Hack" }),
    });
    const unauthRes = await sessionsPatch(unauthorizedReq, {
      params: Promise.resolve({ viewId }),
    });
    expect(unauthRes.status).toBe(403);

    // 4. Get run-sheet
    const runSheetReq = new NextRequest(`http://localhost:3000/api/sessions/${viewId}/run-sheet`);
    const runSheetRes = await runSheetGet(runSheetReq, {
      params: Promise.resolve({ viewId }),
    });
    expect(runSheetRes.status).toBe(200);
    const runSheetData = await runSheetRes.json();
    expect(runSheetData.fastestPlan).toBeDefined();
    expect(runSheetData.cheapestPlan).toBeDefined();
    expect(runSheetData.fastestPlan.stops.length).toBeGreaterThan(0);

    // 5. Submit feedback
    const firstItemId = createdData.items[0].id;
    const feedbackReq = new NextRequest(`http://localhost:3000/api/sessions/${viewId}/feedback`, {
      method: "POST",
      body: JSON.stringify({
        bomItemId: firstItemId,
        found: true,
        pricePaidPaisa: 28000,
        priceSentiment: "fair",
        note: "Stall #14 had stock on the rack",
      }),
    });
    const feedbackRes = await feedbackPost(feedbackReq, {
      params: Promise.resolve({ viewId }),
    });
    expect(feedbackRes.status).toBe(201);
    const feedbackData = await feedbackRes.json();
    expect(feedbackData.success).toBe(true);
  });
});
