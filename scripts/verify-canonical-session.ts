import { POST as sessionsPost } from "../src/app/api/sessions/route";
import { GET as sessionGet } from "../src/app/api/sessions/[viewId]/route";
import { GET as runSheetGet } from "../src/app/api/sessions/[viewId]/run-sheet/route";
import { NextRequest } from "next/server";

async function verify() {
  console.log("=== ENGI-MART Canonical 7-line BOM Verification ===");

  const canonicalBom = [
    "1x ESP32 DevKit",
    "1x capacitive soil moisture sensor",
    "1x 5V relay module",
    "1x 3-6V submersible pump",
    "2m silicone tubing 6mm ID",
    "40x jumper wires male-male",
    "1x 5V 2A DC adapter",
  ].join("\n");

  const postReq = new NextRequest("http://localhost:3000/api/sessions", {
    method: "POST",
    body: JSON.stringify({
      mode: "bom",
      title: "Smart Plant Watering System",
      rawText: canonicalBom,
      budgetPaisa: 150000,
    }),
  });

  const postRes = await sessionsPost(postReq);
  const sessionData = await postRes.json();

  console.log("\n1. Created Session via POST /api/sessions:");
  console.log(`Status: ${postRes.status}`);
  console.log(`viewId: ${sessionData.viewId}`);
  console.log(`editToken: ${sessionData.editToken}`);
  console.log(`Items matched (${sessionData.items.length}/7):`);
  for (const it of sessionData.items) {
    console.log(`  - [${it.matchMethod}] "${it.rawText}" -> ${it.canonicalSlug} (${it.displayName}) [conf: ${it.matchConfidence}]`);
  }

  const viewId = sessionData.viewId;

  // 2. Fetch session via GET /api/sessions/[viewId]
  const getReq = new NextRequest(`http://localhost:3000/api/sessions/${viewId}`);
  const getRes = await sessionGet(getReq, { params: Promise.resolve({ viewId }) });
  const getData = await getRes.json();

  console.log("\n2. Retrieved Session via GET /api/sessions/[viewId]:");
  console.log(`Status: ${getRes.status}`);
  console.log(`Title: ${getData.session.title}`);
  console.log(`Budget: ₹${getData.session.budgetRupees}`);
  console.log("Sample Item Price Bands:");
  for (const it of getData.items.slice(0, 3)) {
    console.log(`  - ${it.displayName}: ₹${it.priceBand?.priceLow}–₹${it.priceBand?.priceHigh} (${it.priceBand?.confidence}% conf)`);
  }

  // 3. Fetch Run Sheet via GET /api/sessions/[viewId]/run-sheet
  const runReq = new NextRequest(`http://localhost:3000/api/sessions/${viewId}/run-sheet`);
  const runRes = await runSheetGet(runReq, { params: Promise.resolve({ viewId }) });
  const runData = await runRes.json();

  console.log("\n3. Generated Run Sheet via GET /api/sessions/[viewId]/run-sheet:");
  console.log(`Status: ${runRes.status}`);
  console.log(`Fastest Plan Total: ₹${runData.fastestPlan.totalRupees} (Coverage: ${runData.fastestPlan.coverageRatio}, Walking: ${runData.fastestPlan.walkingMinutes} min)`);
  console.log(`Cheapest Plan Total: ₹${runData.cheapestPlan.totalRupees} (Coverage: ${runData.cheapestPlan.coverageRatio}, Walking: ${runData.cheapestPlan.walkingMinutes} min)`);
  console.log("Stops in Fastest Plan:");
  for (const stop of runData.fastestPlan.stops) {
    console.log(`  Stop ${stop.stopNumber}: ${stop.shopName} (${stop.building}, ${stop.floor}, Stall ${stop.stallNo}, Phone: ${stop.phone})`);
    for (const item of stop.items) {
      console.log(`    * ${item.name} | Billable: ${item.billablePacks} pack(s) | ₹${item.estimatedCostRupees}`);
    }
  }

  console.log("\nVerification completed successfully!");
}

verify().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
