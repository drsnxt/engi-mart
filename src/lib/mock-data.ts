// Demo dataset for the ENGI-MART Bench Sheet UI.
// All shop names, prices, stock levels and observations are illustrative.
// They are NOT real quotes and must not be presented as live inventory.

export type BomStatus = "matched" | "warning";

export type BomItem = {
  id: string;
  name: string;
  variant: string;
  qty: number;
  spec: string;
  status: BomStatus;
  statusLabel: string;
  priceLow: number;
  priceHigh: number;
  confidence: number;
  reported: string;
  note?: string;
  warning?: {
    title: string;
    body: string;
    options: string[];
  };
};

export type RunItem = {
  id: string;
  name: string;
  qty: number;
  priceLow: number;
  priceHigh: number;
  checkedByDefault?: boolean;
};

export type RunStop = {
  id: string;
  order: number;
  shop: string;
  building: string;
  floor: string;
  stall: string;
  phone: string;
  walking: string;
  note: string;
  items: RunItem[];
};

export const demoSession = {
  project: "Smart Plant Watering",
  viewId: "demo",
  budget: 1500,
  itemCount: 7,
  mappedCount: 7,
  stops: 2,
  walkingMinutes: 12,
  confidence: 82,
  estimateLow: 820,
  estimateHigh: 960,
  updated: "2 min ago",
  mode: "Paste BOM",
  method: "Paste BOM",
  board: "ESP32 DevKit",
} as const;

export const bomItems: BomItem[] = [
  {
    id: "esp32",
    name: "ESP32 DevKit",
    variant: "ESP32-WROOM-32 · 30-pin",
    qty: 1,
    spec: "3.3 V logic · Wi-Fi + BLE",
    status: "matched",
    statusLabel: "Matched",
    priceLow: 220,
    priceHigh: 250,
    confidence: 86,
    reported: "reported 3d ago · 2 reports",
  },
  {
    id: "soil",
    name: "Capacitive soil sensor",
    variant: "Analog · v1.2 · 3.3–5 V",
    qty: 1,
    spec: "Analog out · 3.3–5 V · 1.5 m lead",
    status: "matched",
    statusLabel: "Matched",
    priceLow: 180,
    priceHigh: 200,
    confidence: 74,
    reported: "reported 9d ago · 1 report",
    note: "Capacitive, not resistive. Verify the connector before paying.",
  },
  {
    id: "relay",
    name: "Relay module",
    variant: "1-channel · 5 V coil",
    qty: 1,
    spec: "5 V coil · 10 A contacts",
    status: "warning",
    statusLabel: "Spec warning",
    priceLow: 90,
    priceHigh: 110,
    confidence: 81,
    reported: "reported 5d ago · 2 reports",
    warning: {
      title: "5 V coil, 3.3 V logic",
      body: "The relay coil wants 5 V and its input is commonly driven at 5 V. ESP32 GPIO is 3.3 V. Power the coil from 5 V and check the module's logic threshold before wiring it directly.",
      options: ["Add level shifter ₹40", "Use 3.3 V relay", "I'll handle it"],
    },
  },
  {
    id: "pump",
    name: "Submersible pump",
    variant: "3–6 V DC · 120 L/h",
    qty: 1,
    spec: "3–6 V DC · 120 L/h · 6 mm outlet",
    status: "matched",
    statusLabel: "Matched",
    priceLow: 150,
    priceHigh: 170,
    confidence: 68,
    reported: "reported 14d ago · 1 report",
  },
  {
    id: "tubing",
    name: "Silicone tubing",
    variant: "6 mm ID · food-safe",
    qty: 2,
    spec: "6 mm ID · food-safe · sold per metre",
    status: "matched",
    statusLabel: "Matched",
    priceLow: 40,
    priceHigh: 50,
    confidence: 61,
    reported: "reported 21d ago · 1 report",
    note: "Billed by running metre. Ask for 2 m, not two pieces.",
  },
  {
    id: "jumpers",
    name: "Jumper wires",
    variant: "20 cm · M–M · 40 pack",
    qty: 1,
    spec: "20 cm · male–male · 40 pieces",
    status: "matched",
    statusLabel: "Matched",
    priceLow: 40,
    priceHigh: 60,
    confidence: 90,
    reported: "reported 2d ago · 3 reports",
  },
  {
    id: "adapter",
    name: "5 V DC adapter",
    variant: "2 A · 5.5/2.1 mm barrel",
    qty: 1,
    spec: "5 V · 2 A · centre-positive barrel",
    status: "matched",
    statusLabel: "Matched",
    priceLow: 120,
    priceHigh: 140,
    confidence: 77,
    reported: "reported 7d ago · 2 reports",
  },
];

export type PlanKey = "fastest" | "cheapest";

export type PlanShop = {
  shop: string;
  area: string;
  floor: string;
  walking: string;
  items: string;
  subtotal: string;
};

export type Plan = {
  key: PlanKey;
  name: string;
  tagline: string;
  totalLow: number;
  totalHigh: number;
  shops: number;
  walkingMinutes: number;
  coverage: string;
  confidence: number;
  tradeoff: string;
  recommended: boolean;
  shopBreakdown: PlanShop[];
  caveat?: string;
};

export const plans: Plan[] = [
  {
    key: "fastest",
    name: "Fastest",
    tagline: "One stop. Shortest walk.",
    totalLow: 890,
    totalHigh: 990,
    shops: 1,
    walkingMinutes: 5,
    coverage: "6 / 7",
    confidence: 74,
    tradeoff: "One item missing; shortest trip",
    recommended: false,
    caveat: "Capacitive soil sensor is not stocked at this stop. Buy it online or add a second stop.",
    shopBreakdown: [
      {
        shop: "Sri Vinayaka Electronics",
        area: "Silver Tool Complex, 1st floor",
        floor: "1st floor",
        walking: "5 min",
        items: "6 items · ESP32, relay, pump, tubing, jumpers, adapter",
        subtotal: "₹890–990",
      },
    ],
  },
  {
    key: "cheapest",
    name: "Cheapest",
    tagline: "Two stops. Full coverage.",
    totalLow: 820,
    totalHigh: 960,
    shops: 2,
    walkingMinutes: 12,
    coverage: "7 / 7",
    confidence: 82,
    tradeoff: "Save ₹60–80; one extra stop",
    recommended: true,
    shopBreakdown: [
      {
        shop: "Om Electronics",
        area: "Silver Tool Complex, 1st floor",
        floor: "1st floor · #14",
        walking: "4 min",
        items: "4 items · ESP32, relay, jumpers, adapter",
        subtotal: "₹470–560",
      },
      {
        shop: "Sai Sensors",
        area: "Golcha Market, ground floor",
        floor: "ground floor · #7",
        walking: "8 min",
        items: "3 items · soil sensor, pump, tubing",
        subtotal: "₹370–420",
      },
    ],
  },
];

export const runStops: RunStop[] = [
  {
    id: "om",
    order: 1,
    shop: "Om Electronics",
    building: "Silver Tool Complex",
    floor: "1st floor",
    stall: "#14",
    phone: "+918041237788",
    walking: "4 min from main entrance",
    note: "Ask at the counter. Confirm the ESP32 is the 30-pin WROOM board.",
    items: [
      { id: "esp32", name: "ESP32 DevKit · 30-pin", qty: 1, priceLow: 220, priceHigh: 250 },
      { id: "relay", name: "5 V relay module · 1-channel", qty: 1, priceLow: 90, priceHigh: 110 },
      { id: "jumpers", name: "Jumper wires · M–M 40 pack", qty: 1, priceLow: 40, priceHigh: 60 },
      { id: "adapter", name: "5 V 2 A DC adapter", qty: 1, priceLow: 120, priceHigh: 140 },
    ],
  },
  {
    id: "sai",
    order: 2,
    shop: "Sai Sensors",
    building: "Golcha Market",
    floor: "ground floor",
    stall: "#7",
    phone: "+918041126644",
    walking: "8 min from Om Electronics",
    note: "Carry the sensor lead. Some units ship with a 3-pin JST connector.",
    items: [
      { id: "soil", name: "Capacitive soil sensor · v1.2", qty: 1, priceLow: 180, priceHigh: 200 },
      { id: "pump", name: "Submersible pump · 3–6 V", qty: 1, priceLow: 150, priceHigh: 170 },
      { id: "tubing", name: "Silicone tubing · 6 mm ID", qty: 2, priceLow: 40, priceHigh: 50 },
    ],
  },
];

export const starterChips = [
  {
    id: "iot",
    label: "Sem-5 IoT node",
    detail: "ESP32 + DHT22 + OLED + relay",
    text: "1x ESP32\n1x DHT22\n1x 0.96in OLED\n1x 5V relay\n1x breadboard\njumper wires",
  },
  {
    id: "bot",
    label: "L298N line-follower",
    detail: "L298N + 2 motors + IR array",
    text: "1x L298N motor driver\n2x BO gear motors\n1x IR sensor array\n1x 7.4V battery pack\n1x switch\njumper wires",
  },
  {
    id: "plant",
    label: "Plant monitor",
    detail: "Capacitive sensor + pump + ESP32",
    text: "1x ESP32 DevKit\n1x capacitive soil sensor\n1x 5V relay\n1x 3-6V pump\n2m silicone tubing\n1x 5V 2A adapter",
  },
] as const;

export function inr(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function priceBand(low: number, high: number) {
  return `${inr(low)}–${inr(high).replace("₹", "")}`;
}
