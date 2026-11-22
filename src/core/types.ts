export type StockStatus = "in_stock" | "low" | "out" | "unknown";

export type SourceType = "audit" | "bill" | "student" | "shop_whatsapp" | "import";

export interface PriceObservationInput {
  pricePaisa: number;
  stockStatus: StockStatus;
  observedAt: Date | string;
  source: SourceType;
  quantity?: number | null;
}

export interface ConfidenceResult {
  confidence: number; // 0.05 to 0.97
  isStale: boolean;
  baseReliability: number;
  agreement: number;
  sampleFactor: number;
  newestAgeDays: number;
  priceBand: {
    minPaisa: number;
    maxPaisa: number;
    p50Paisa: number;
    p75Paisa: number;
    isLowConfidence: boolean;
  };
}

export interface ComponentSpecs {
  supply_v?: [number, number] | number; // min, max or nominal
  output_v?: number;
  logic_v?: number; // 3.3, 5.0, etc.
  interfaces?: string[]; // ["I2C", "SPI", "UART", "GPIO", "ADC"]
  peak_current_ma?: number;
  regulator_max_ma?: number;
  pins?: number;
  available_gpio?: number;
  required_gpio?: number;
  input_5v_tolerant?: boolean;
  package?: string;
  [key: string]: unknown;
}

export interface CompatibilityViolation {
  rule: string;
  severity: "error" | "warning" | "info";
  message: string;
  remedy?: string;
  componentA: string;
  componentB: string;
}

export interface CatalogVariant {
  id: string;
  familyId: string;
  canonicalSlug: string;
  displayName: string;
  mpn?: string | null;
  packSize: number;
  unitLabel: string;
  specs: ComponentSpecs;
}

export interface CatalogShop {
  id: string;
  name: string;
  building?: string | null;
  floor?: string | null;
  stallNo?: string | null;
  phone?: string | null;
}

export interface ShopOffer {
  shopId: string;
  shopName: string;
  variantId: string;
  variantSlug: string;
  displayName: string;
  isSubstitute: boolean;
  unitPricePaisa: number;
  packSize: number;
  packPricePaisa: number;
  stockStatus: StockStatus;
  confidence: number;
  assumedStock: boolean;
}

export interface BomItemRequirement {
  id: string;
  rawText: string;
  qty: number;
  variantId?: string | null;
  allowedSubstituteIds?: string[];
  optional?: boolean;
}

export interface AllocatedOffer {
  bomItemId: string;
  variantId: string;
  variantSlug?: string;
  displayName?: string;
  rawText?: string;
  shopId: string;
  shopName: string;
  isSubstitute: boolean;
  requestedQty: number;
  packSize: number;
  billablePacks: number;
  packPricePaisa: number;
  totalCostPaisa: number;
  p50Paisa: number;
  p75Paisa: number;
  confidence: number;
  stockStatus: StockStatus;
  assumedStock: boolean;
}

export interface ValueCut {
  type: "clone" | "drop_optional" | "substitute";
  title: string;
  savingsPaisa: number;
  bomItemId: string;
  suggestedVariantId?: string;
  tradeoff: string;
}

export interface Plan {
  id: "fastest" | "cheapest";
  shopIds: string[];
  shopNames: string[];
  estimatedTotalPaisa: number; // sum of p50
  budgetUpperBoundPaisa: number; // sum of p75
  coverageCount: number;
  totalItems: number;
  missingItems: Array<{ id: string; rawText: string }>;
  walkingMinutes: number;
  planConfidence: number; // coverage ratio * mean offer confidence
  allocations: AllocatedOffer[];
  exactCount: number;
  valueCuts: ValueCut[];
  warnings: string[];
}

export interface SolveBasketResult {
  fastest: Plan;
  cheapest: Plan;
}
