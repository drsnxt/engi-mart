import { describe, it, expect } from "vitest";
import {
  calculateConfidence,
  parseBomLine,
  parseBomInput,
  calculatePackRounding,
  checkLogicLevelCompatibility,
  evaluateCompatibility,
  solveBasket,
  CatalogShop,
  ShopOffer,
  BomItemRequirement,
} from "../src/core";

describe("ENGI-MART Core Algorithms & Rules", () => {
  // Edge Case 1: Pack size rounding and normalization
  it("Edge Case 1: correctly normalizes BOM lines and applies pack size rounding", () => {
    const parsed = parseBomLine("4x 5mm Red LEDs (pack of 10)");
    expect(parsed.qty).toBe(4);
    expect(parsed.specHint).toBe("pack of 10");
    expect(parsed.cleanedText).toContain("5mm red leds");

    // Requested 4 LEDs, pack size 10 -> 1 billable pack, 10 pieces supplied
    const rounding = calculatePackRounding(4, 10);
    expect(rounding.billablePacks).toBe(1);
    expect(rounding.totalPiecesSupplied).toBe(10);

    // Requested 14 LEDs, pack size 10 -> 2 billable packs, 20 pieces supplied
    const rounding2 = calculatePackRounding(14, 10);
    expect(rounding2.billablePacks).toBe(2);
    expect(rounding2.totalPiecesSupplied).toBe(20);
  });

  // Edge Case 2: Price confidence formula and 45-day stale cap
  it("Edge Case 2: caps confidence <= 0.30 and flags stale when observation > 45 days", () => {
    const now = new Date();
    const staleDate = new Date(now.getTime() - 46 * 24 * 60 * 60 * 1000); // 46 days ago

    const staleResult = calculateConfidence(
      [
        {
          pricePaisa: 22000,
          stockStatus: "in_stock",
          source: "audit",
          observedAt: staleDate,
        },
      ],
      now
    );

    expect(staleResult.isStale).toBe(true);
    expect(staleResult.confidence).toBeLessThanOrEqual(0.3);
    expect(staleResult.priceBand.isLowConfidence).toBe(true);

    // Fresh audit (< 1 day) should have high confidence
    const freshDate = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const freshResult = calculateConfidence(
      [
        {
          pricePaisa: 22000,
          stockStatus: "in_stock",
          source: "audit",
          observedAt: freshDate,
        },
      ],
      now
    );

    expect(freshResult.isStale).toBe(false);
    expect(freshResult.confidence).toBeGreaterThan(0.7);
  });

  // Edge Case 3: 5V relay module paired with ESP32 triggers compatibility warning/error
  it("Edge Case 3: triggers compatibility warning for ESP32 (3.3V) with 5V Relay module", () => {
    const esp32 = {
      id: "esp32-var-1",
      name: "ESP32-WROOM-32 30-pin",
      specs: {
        logic_v: 3.3,
        supply_v: [3.0, 3.6] as [number, number],
        interfaces: ["I2C", "SPI", "UART", "GPIO"],
        regulator_max_ma: 500,
      },
    };

    const relay5v = {
      id: "relay-5v-1",
      name: "5V 1-Channel Relay Module",
      specs: {
        logic_v: 5.0,
        supply_v: [4.5, 5.5] as [number, number],
        peak_current_ma: 80,
      },
    };

    const violation = checkLogicLevelCompatibility(esp32, relay5v);
    expect(violation).not.toBeNull();
    expect(violation?.rule).toBe("LogicLevelRule");
    expect(violation?.severity).toBe("error");
    expect(violation?.message).toContain("Logic level mismatch");
    expect(violation?.remedy).toContain("level shifter");

    const fullEvaluation = evaluateCompatibility([esp32, relay5v]);
    expect(fullEvaluation.length).toBeGreaterThan(0);
    expect(fullEvaluation.some((v) => v.rule === "LogicLevelRule")).toBe(true);
  });

  // Edge Case 4: Over-budget basket produces deterministic value cuts
  it("Edge Case 4: identifies over-budget condition and recommends value cuts", () => {
    const shops: CatalogShop[] = [
      { id: "shop-a", name: "Om Electronics", floor: "Ground floor" },
    ];

    const items: BomItemRequirement[] = [
      { id: "item-mcu", rawText: "ESP32 DevKit", qty: 1, variantId: "v-esp32" },
      {
        id: "item-oled",
        rawText: "0.96 OLED Display",
        qty: 1,
        variantId: "v-oled",
        optional: true,
      },
    ];

    const offers: ShopOffer[] = [
      {
        shopId: "shop-a",
        shopName: "Om Electronics",
        variantId: "v-esp32",
        variantSlug: "esp32-wroom-32",
        displayName: "ESP32-WROOM-32",
        isSubstitute: false,
        unitPricePaisa: 30000, // ₹300
        packSize: 1,
        packPricePaisa: 30000,
        stockStatus: "in_stock",
        confidence: 0.9,
        assumedStock: false,
      },
      {
        shopId: "shop-a",
        shopName: "Om Electronics",
        variantId: "v-oled",
        variantSlug: "oled-096-i2c",
        displayName: "0.96 inch I2C OLED",
        isSubstitute: false,
        unitPricePaisa: 25000, // ₹250
        packSize: 1,
        packPricePaisa: 25000,
        stockStatus: "in_stock",
        confidence: 0.9,
        assumedStock: false,
      },
    ];

    // Total cost = ₹550. Budget = ₹400
    const result = solveBasket(items, shops, offers, {
      budgetPaisa: 40000,
    });

    expect(result.fastest.estimatedTotalPaisa).toBe(55000);
    expect(result.fastest.warnings.some((w) => w.includes("exceeds budget"))).toBe(true);
    expect(result.fastest.valueCuts.length).toBe(1);
    expect(result.fastest.valueCuts[0].type).toBe("drop_optional");
    expect(result.fastest.valueCuts[0].savingsPaisa).toBe(25000);
  });

  // Edge Case 5: Coverage-first invariant and out-of-stock exclusion
  it("Edge Case 5: prioritizes maximum coverage over cost, and excludes out-of-stock offers", () => {
    const shops: CatalogShop[] = [
      { id: "shop-cheap", name: "Cheap Components", floor: "3rd floor" },
      { id: "shop-full", name: "Complete Electronics", floor: "Ground floor" },
    ];

    const items: BomItemRequirement[] = [
      { id: "item-1", rawText: "Arduino Uno", qty: 1, variantId: "v-uno" },
      { id: "item-2", rawText: "Jumper Wires", qty: 1, variantId: "v-jumpers" },
    ];

    const offers: ShopOffer[] = [
      // shop-cheap has Uno at low price (₹350), but Jumper Wires are OUT of stock
      {
        shopId: "shop-cheap",
        shopName: "Cheap Components",
        variantId: "v-uno",
        variantSlug: "arduino-uno-ch340",
        displayName: "Arduino Uno CH340",
        isSubstitute: false,
        unitPricePaisa: 35000,
        packSize: 1,
        packPricePaisa: 35000,
        stockStatus: "in_stock",
        confidence: 0.9,
        assumedStock: false,
      },
      {
        shopId: "shop-cheap",
        shopName: "Cheap Components",
        variantId: "v-jumpers",
        variantSlug: "jumper-wires-mm-40",
        displayName: "Jumper Wires 40pcs",
        isSubstitute: false,
        unitPricePaisa: 5000,
        packSize: 1,
        packPricePaisa: 5000,
        stockStatus: "out", // OUT OF STOCK
        confidence: 0.9,
        assumedStock: false,
      },
      // shop-full has both in stock, but Uno is ₹450 and Jumpers are ₹70
      {
        shopId: "shop-full",
        shopName: "Complete Electronics",
        variantId: "v-uno",
        variantSlug: "arduino-uno-ch340",
        displayName: "Arduino Uno CH340",
        isSubstitute: false,
        unitPricePaisa: 45000,
        packSize: 1,
        packPricePaisa: 45000,
        stockStatus: "in_stock",
        confidence: 0.9,
        assumedStock: false,
      },
      {
        shopId: "shop-full",
        shopName: "Complete Electronics",
        variantId: "v-jumpers",
        variantSlug: "jumper-wires-mm-40",
        displayName: "Jumper Wires 40pcs",
        isSubstitute: false,
        unitPricePaisa: 7000,
        packSize: 1,
        packPricePaisa: 7000,
        stockStatus: "in_stock",
        confidence: 0.9,
        assumedStock: false,
      },
    ];

    // For Fastest (1 shop), shop-full must win because it covers 2/2 items, even though shop-cheap is cheaper for item 1
    const result = solveBasket(items, shops, offers);
    expect(result.fastest.shopIds).toEqual(["shop-full"]);
    expect(result.fastest.coverageCount).toBe(2);
    expect(result.fastest.missingItems.length).toBe(0);
  });

  // Edge Case 6: Walking distance tie breaker
  it("Edge Case 6: breaks price and coverage ties using walking distance (ground floor beats 3rd floor)", () => {
    const shops: CatalogShop[] = [
      { id: "shop-3f", name: "High Floor Shop", floor: "3rd floor" },
      { id: "shop-gf", name: "Ground Floor Shop", floor: "Ground floor" },
    ];

    const items: BomItemRequirement[] = [
      { id: "item-relay", rawText: "5V Relay", qty: 1, variantId: "v-relay" },
    ];

    const offers: ShopOffer[] = [
      {
        shopId: "shop-3f",
        shopName: "High Floor Shop",
        variantId: "v-relay",
        variantSlug: "relay-5v",
        displayName: "5V Relay",
        isSubstitute: false,
        unitPricePaisa: 6000,
        packSize: 1,
        packPricePaisa: 6000,
        stockStatus: "in_stock",
        confidence: 0.9,
        assumedStock: false,
      },
      {
        shopId: "shop-gf",
        shopName: "Ground Floor Shop",
        variantId: "v-relay",
        variantSlug: "relay-5v",
        displayName: "5V Relay",
        isSubstitute: false,
        unitPricePaisa: 6000,
        packSize: 1,
        packPricePaisa: 6000,
        stockStatus: "in_stock",
        confidence: 0.9,
        assumedStock: false,
      },
    ];

    const result = solveBasket(items, shops, offers);
    expect(result.fastest.shopIds).toEqual(["shop-gf"]);
    expect(result.fastest.walkingMinutes).toBeLessThan(8);
  });
});
