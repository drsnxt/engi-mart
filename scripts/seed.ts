import { db } from "../src/db";
import {
  componentFamily,
  componentVariant,
  shop,
  shopListing,
  priceObservation,
  substitutionEdge,
} from "../src/db/schema";
import { sql } from "drizzle-orm";
import { calculateConfidence } from "../src/core/confidence";

async function main() {
  console.log("Seeding ENGI-MART SP Road pilot data...");

  // Clear existing catalog data
  await db.execute(sql`TRUNCATE TABLE substitution_edge, price_observation, shop_listing, component_variant, component_family, shop CASCADE;`);

  // 1. Seed 10 SP Road Shops
  const shopsData = [
    {
      name: "Om Electronics",
      clusterId: "sp-road",
      building: "Silver Tool Complex",
      floor: "1st floor",
      stallNo: "#14",
      phone: "+91 98450 12345",
      categoryFocus: ["microcontrollers", "dev boards", "passives"],
    },
    {
      name: "SP Road Robotics & Kits",
      clusterId: "sp-road",
      building: "Kaveri Plaza",
      floor: "Ground floor",
      stallNo: "#3",
      phone: "+91 94480 23456",
      categoryFocus: ["robotics", "sensors", "motors"],
    },
    {
      name: "Bangalore Circuit House",
      clusterId: "sp-road",
      building: "Anand Complex",
      floor: "2nd floor",
      stallNo: "#22",
      phone: "+91 98860 34567",
      categoryFocus: ["microcontrollers", "sensors", "displays"],
    },
    {
      name: "Mahaveer Electro Emporium",
      clusterId: "sp-road",
      building: "Main SP Road Lane",
      floor: "Ground floor",
      stallNo: "#88",
      phone: "+91 99000 45678",
      categoryFocus: ["passives", "tools", "relays", "power"],
    },
    {
      name: "Silicon Components Centre",
      clusterId: "sp-road",
      building: "Devatha Market",
      floor: "1st floor",
      stallNo: "#102",
      phone: null, // Adversarial: missing phone
      categoryFocus: ["semiconductors", "ics", "clones"],
    },
    {
      name: "Vishwa Electronics & Spares",
      clusterId: "sp-road",
      building: "Silver Tool Complex",
      floor: "2nd floor",
      stallNo: "#31",
      phone: "+91 94490 56789",
      categoryFocus: ["robotics", "batteries", "cables"],
    },
    {
      name: "National Radio & Transistors",
      clusterId: "sp-road",
      building: "City Market Cross",
      floor: "Ground floor",
      stallNo: "#5",
      phone: "+91 98440 67890",
      categoryFocus: ["vintage", "audio", "relays", "diodes"],
    },
    {
      name: "Balaji Components",
      clusterId: "sp-road",
      building: "SP Road Cross",
      floor: "3rd floor", // High floor penalty
      stallNo: "#41",
      phone: "+91 98455 78901",
      categoryFocus: ["sensors", "clones", "bargain"],
    },
    {
      name: "RoboTech Pioneer Hub",
      clusterId: "sp-road",
      building: "Kaveri Plaza",
      floor: "1st floor",
      stallNo: "#18",
      phone: "+91 97410 89012",
      categoryFocus: ["iot", "modules", "batteries"],
    },
    {
      name: "Sri Krishna Sensors & Modules",
      clusterId: "sp-road",
      building: "Main SP Road Lane",
      floor: "Ground floor",
      stallNo: "#12B",
      phone: "+91 99800 90123",
      categoryFocus: ["sensors", "displays", "modules"],
    },
  ];

  const insertedShops = await db.insert(shop).values(shopsData).returning();
  console.log(`Inserted ${insertedShops.length} shops.`);
  const shopMap = new Map(insertedShops.map((s) => [s.name, s.id]));

  // 2. Seed Families
  const familiesData = [
    { name: "ESP32 Dev Boards", category: "microcontroller", description: "Dual-core Wi-Fi & Bluetooth IoT boards", searchAliases: ["esp32", "wroom", "nodemcu-32", "esp-32", "esp32 devkit", "esp32 devkitc", "devkit"] },
    { name: "Arduino Boards", category: "microcontroller", description: "ATmega & CH340 based beginner development boards", searchAliases: ["arduino", "uno", "nano", "ch340"] },
    { name: "STM32 Dev Boards", category: "microcontroller", description: "ARM Cortex-M development boards", searchAliases: ["stm32", "blue pill", "black pill"] },
    { name: "ESP8266 Dev Boards", category: "microcontroller", description: "Low-cost single-core Wi-Fi boards", searchAliases: ["esp8266", "nodemcu", "d1 mini"] },
    { name: "Soil Moisture Sensors", category: "sensor", description: "Soil hydration sensing probes", searchAliases: ["soil sensor", "moisture sensor", "soil moisture", "capacitive soil", "capacitive soil moisture sensor", "soil moisture sensor"] },
    { name: "Ultrasonic Distance Sensors", category: "sensor", description: "Acoustic echo distance measurement modules", searchAliases: ["ultrasonic", "sonar", "hc-sr04"] },
    { name: "Temperature & Humidity Sensors", category: "sensor", description: "Environmental climate sensors", searchAliases: ["temp sensor", "dht11", "dht22", "bme280"] },
    { name: "Infrared Line Tracking Sensors", category: "sensor", description: "IR phototransistor reflective sensors", searchAliases: ["line sensor", "tcrt5000", "ir tracker"] },
    { name: "Relay Modules", category: "actuator", description: "Electromechanical relay switches for high-voltage switching", searchAliases: ["relay", "5v relay", "relay module", "switch", "5v relay module", "1-channel relay"] },
    { name: "Motor Driver Modules", category: "actuator", description: "H-Bridge motor control breakout boards", searchAliases: ["motor driver", "l298n", "l293d", "tb6612"] },
    { name: "BO Gear Motors", category: "actuator", description: "Battery operated yellow geared DC motors", searchAliases: ["bo motor", "gear motor", "robot motor", "yellow motor"] },
    { name: "Servo Motors", category: "actuator", description: "PWM positional servo motors", searchAliases: ["servo", "sg90", "mg996r", "micro servo"] },
    { name: "OLED & LCD Displays", category: "actuator", description: "Alphanumeric & graphical display modules", searchAliases: ["oled", "display", "lcd", "i2c display", "screen"] },
    { name: "Linear Voltage Regulators", category: "power", description: "LDO and linear fixed voltage regulators", searchAliases: ["regulator", "ams1117", "7805", "ldo"] },
    { name: "DC-DC Buck Converters", category: "power", description: "Step-down switching voltage regulators", searchAliases: ["buck converter", "step down", "lm2596"] },
    { name: "Lithium Battery Holders & Chargers", category: "power", description: "18650 cells, TP4056 chargers and holders", searchAliases: ["battery holder", "18650", "tp4056", "bms"] },
    { name: "Power Supplies & Adapters", category: "power", description: "AC-DC wall adapters and power supplies", searchAliases: ["adapter", "dc adapter", "power adapter", "power supply", "5v adapter", "5v 2a adapter", "5v 2a dc adapter"] },
    { name: "Water Pumps & Fluidics", category: "actuator", description: "Miniature submersible and diaphragm DC pumps", searchAliases: ["pump", "submersible pump", "water pump", "dc pump", "3-6v submersible pump", "submersible water pump"] },
    { name: "Tubing & Plumbing", category: "consumable", description: "Silicone and PVC fluid conduits and fittings", searchAliases: ["tubing", "pipe", "silicone tubing", "hose", "silicone tubing 6mm id", "6mm tubing"] },
    { name: "Resistor Kits & Packs", category: "passive", description: "Through-hole metal film resistors", searchAliases: ["resistor", "ohm", "resistor pack"] },
    { name: "Capacitor Assortment", category: "passive", description: "Electrolytic and ceramic capacitors", searchAliases: ["capacitor", "cap", "uf", "pf"] },
    { name: "LED Packs", category: "passive", description: "Standard 5mm through-hole LEDs", searchAliases: ["led", "leds", "light emitting diode"] },
    { name: "Breadboards & Jumpers", category: "consumable", description: "Solderless breadboards and DuPont wire ribbons", searchAliases: ["breadboard", "jumper wire", "jumpers", "dupont", "jumper wires male-male", "jumpers m-m", "jumper wires"] },
  ];

  const insertedFamilies = await db.insert(componentFamily).values(familiesData).returning();
  console.log(`Inserted ${insertedFamilies.length} component families.`);
  const familyMap = new Map(insertedFamilies.map((f) => [f.name, f.id]));

  // 3. Seed 40 Variants
  const variantsData = [
    // ESP32 variants (ambiguity check)
    {
      familyId: familyMap.get("ESP32 Dev Boards")!,
      canonicalSlug: "esp32-wroom-32-30pin",
      displayName: "ESP32 DevKit (WROOM-32 30-pin)",
      mpn: "ESP32-D0WDQ6",
      manufacturer: "Espressif Systems",
      package: "module",
      specs: { logic_v: 3.3, supply_v: [3.0, 3.6], peak_current_ma: 240, regulator_max_ma: 500, pins: 30, interfaces: ["I2C", "SPI", "UART", "GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("ESP32 Dev Boards")!,
      canonicalSlug: "esp32-devkitc-38pin",
      displayName: "ESP32 DevKitC (38-pin Expanded)",
      mpn: "ESP32-WROOM-32D-38",
      manufacturer: "Espressif Systems",
      package: "module",
      specs: { logic_v: 3.3, supply_v: [3.0, 3.6], peak_current_ma: 240, regulator_max_ma: 500, pins: 38, interfaces: ["I2C", "SPI", "UART", "GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("ESP32 Dev Boards")!,
      canonicalSlug: "esp32-cam-ov2640",
      displayName: "ESP32-CAM with OV2640 Camera Module",
      mpn: "AI-THINKER-CAM",
      manufacturer: "Ai-Thinker",
      package: "module",
      specs: { logic_v: 3.3, supply_v: [4.5, 5.5], peak_current_ma: 310, interfaces: ["UART", "GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },

    // Arduino boards (Adversarial: Unbranded clone with NO formal MPN)
    {
      familyId: familyMap.get("Arduino Boards")!,
      canonicalSlug: "arduino-uno-r3-ch340",
      displayName: "Arduino Uno R3 (CH340G Clone)",
      mpn: null, // NO formal MPN!
      manufacturer: "Shenzhen Unbranded Clone",
      package: "DIP / module",
      specs: { logic_v: 5.0, supply_v: [7.0, 12.0], regulator_max_ma: 800, pins: 28, interfaces: ["I2C", "SPI", "UART", "GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("Arduino Boards")!,
      canonicalSlug: "arduino-nano-v3-ch340",
      displayName: "Arduino Nano v3.0 (CH340G Clone)",
      mpn: null,
      manufacturer: "Shenzhen Unbranded Clone",
      package: "module",
      specs: { logic_v: 5.0, supply_v: [7.0, 12.0], regulator_max_ma: 500, pins: 30, interfaces: ["I2C", "SPI", "UART", "GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },

    // STM32
    {
      familyId: familyMap.get("STM32 Dev Boards")!,
      canonicalSlug: "stm32-blue-pill-f103c8t6",
      displayName: "STM32 Blue Pill (STM32F103C8T6 Clone)",
      mpn: null,
      manufacturer: "Unbranded Clone",
      package: "module",
      specs: { logic_v: 3.3, supply_v: [3.0, 3.6], interfaces: ["I2C", "SPI", "UART", "GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },

    // ESP8266
    {
      familyId: familyMap.get("ESP8266 Dev Boards")!,
      canonicalSlug: "nodemcu-esp8266-v3",
      displayName: "NodeMCU ESP8266 v3 (CH340)",
      mpn: "ESP-12E-MOD",
      manufacturer: "Ai-Thinker / Shenzhen Clone",
      package: "module",
      specs: { logic_v: 3.3, supply_v: [4.5, 9.0], interfaces: ["I2C", "SPI", "UART", "GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },

    // Soil Moisture Sensors (Ambiguity: 3 variants)
    {
      familyId: familyMap.get("Soil Moisture Sensors")!,
      canonicalSlug: "soil-sensor-capacitive-v12",
      displayName: "Capacitive Soil Moisture Sensor v1.2",
      mpn: "CAP-SOIL-V1.2",
      manufacturer: "DIY More / Unbranded",
      package: "probe",
      specs: { logic_v: 3.3, supply_v: [3.3, 5.5], output_v: 3.0, interfaces: ["ADC"] },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("Soil Moisture Sensors")!,
      canonicalSlug: "soil-sensor-resistive-fc28",
      displayName: "Resistive Soil Moisture Sensor FC-28",
      mpn: "FC-28",
      manufacturer: "Unbranded",
      package: "probe",
      specs: { logic_v: 5.0, supply_v: [3.3, 5.0], output_v: 4.2, interfaces: ["ADC", "GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("Soil Moisture Sensors")!,
      canonicalSlug: "soil-sensor-capacitive-v20",
      displayName: "Capacitive Soil Moisture Sensor v2.0 (Waterproofed)",
      mpn: "CAP-SOIL-V2.0",
      manufacturer: "DFRobot Clone",
      package: "probe",
      specs: { logic_v: 3.3, supply_v: [3.3, 5.5], output_v: 3.0, interfaces: ["ADC"] },
      packSize: 1,
      unitLabel: "piece",
    },

    // Ultrasonic
    {
      familyId: familyMap.get("Ultrasonic Distance Sensors")!,
      canonicalSlug: "ultrasonic-hcsr04",
      displayName: "HC-SR04 Ultrasonic Sensor Module",
      mpn: "HC-SR04",
      manufacturer: "ElecFreaks Clone",
      package: "module",
      specs: { logic_v: 5.0, supply_v: [4.5, 5.5], peak_current_ma: 15, interfaces: ["GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("Ultrasonic Distance Sensors")!,
      canonicalSlug: "ultrasonic-rcwl9610-3v3",
      displayName: "RCWL-9610 3.3V/5V Ultrasonic Sensor",
      mpn: "RCWL-9610",
      manufacturer: "RCWL",
      package: "module",
      specs: { logic_v: 3.3, supply_v: [3.0, 5.5], peak_current_ma: 5, interfaces: ["GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },

    // Environmental sensors
    {
      familyId: familyMap.get("Temperature & Humidity Sensors")!,
      canonicalSlug: "sensor-dht11",
      displayName: "DHT11 Temperature & Humidity Sensor",
      mpn: "DHT11",
      manufacturer: "Aosong",
      package: "module",
      specs: { logic_v: 3.3, supply_v: [3.3, 5.5], peak_current_ma: 2, interfaces: ["GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("Temperature & Humidity Sensors")!,
      canonicalSlug: "sensor-dht22-am2302",
      displayName: "DHT22 / AM2302 High-Accuracy Sensor",
      mpn: "AM2302",
      manufacturer: "Aosong",
      package: "module",
      specs: { logic_v: 3.3, supply_v: [3.3, 6.0], peak_current_ma: 2, interfaces: ["GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("Temperature & Humidity Sensors")!,
      canonicalSlug: "sensor-bme280-i2c",
      displayName: "BME280 Barometric Pressure & Temp/Humidity",
      mpn: "BME280",
      manufacturer: "Bosch Clone Module",
      package: "module",
      specs: { logic_v: 3.3, supply_v: [1.8, 3.6], peak_current_ma: 1, interfaces: ["I2C", "SPI"] },
      packSize: 1,
      unitLabel: "piece",
    },

    // Infrared Line Trackers
    {
      familyId: familyMap.get("Infrared Line Tracking Sensors")!,
      canonicalSlug: "sensor-tcrt5000-line",
      displayName: "TCRT5000 IR Line Tracking Module",
      mpn: "TCRT5000",
      manufacturer: "Vishay Clone",
      package: "module",
      specs: { logic_v: 3.3, supply_v: [3.3, 5.0], peak_current_ma: 10, interfaces: ["GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },

    // Relay Modules (Adversarial: 5V logic incompatible with 3.3V ESP32 without level shifter)
    {
      familyId: familyMap.get("Relay Modules")!,
      canonicalSlug: "relay-module-5v-1ch",
      displayName: "5V 1-Channel Relay Module (Optocoupler)",
      mpn: "SRD-05VDC-SL-C",
      manufacturer: "Songle Clone",
      package: "module",
      specs: { logic_v: 5.0, supply_v: [4.5, 5.5], peak_current_ma: 80, interfaces: ["GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("Relay Modules")!,
      canonicalSlug: "relay-module-5v-2ch",
      displayName: "5V 2-Channel Relay Module",
      mpn: "SRD-05VDC-2CH",
      manufacturer: "Songle Clone",
      package: "module",
      specs: { logic_v: 5.0, supply_v: [4.5, 5.5], peak_current_ma: 160, interfaces: ["GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("Relay Modules")!,
      canonicalSlug: "relay-module-3v3-1ch",
      displayName: "3.3V 1-Channel Relay Module (ESP32 Compatible)",
      mpn: "SRD-03VDC-SL-C",
      manufacturer: "Songle Clone",
      package: "module",
      specs: { logic_v: 3.3, supply_v: [3.0, 3.6], peak_current_ma: 60, interfaces: ["GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("Relay Modules")!,
      canonicalSlug: "relay-module-5v-4ch",
      displayName: "5V 4-Channel Relay Board",
      mpn: "SRD-05VDC-4CH",
      manufacturer: "Songle Clone",
      package: "module",
      specs: { logic_v: 5.0, supply_v: [4.5, 5.5], peak_current_ma: 320, interfaces: ["GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },

    // Motor Drivers
    {
      familyId: familyMap.get("Motor Driver Modules")!,
      canonicalSlug: "l298n-motor-driver",
      displayName: "L298N Dual H-Bridge Motor Driver Module",
      mpn: "L298N",
      manufacturer: "ST Clone Breakout",
      package: "module",
      specs: { logic_v: 5.0, supply_v: [5.0, 35.0], peak_current_ma: 2000, interfaces: ["GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("Motor Driver Modules")!,
      canonicalSlug: "l293d-motor-shield",
      displayName: "L293D Motor Drive Shield for Arduino",
      mpn: "L293D",
      manufacturer: "Unbranded Shield",
      package: "shield",
      specs: { logic_v: 5.0, supply_v: [4.5, 25.0], peak_current_ma: 1200, interfaces: ["GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("Motor Driver Modules")!,
      canonicalSlug: "tb6612fng-motor-driver",
      displayName: "TB6612FNG Dual Motor Driver (High Efficiency)",
      mpn: "TB6612FNG",
      manufacturer: "Toshiba Clone Breakout",
      package: "module",
      specs: { logic_v: 3.3, supply_v: [4.5, 13.5], peak_current_ma: 1200, interfaces: ["GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },

    // Motors
    {
      familyId: familyMap.get("BO Gear Motors")!,
      canonicalSlug: "bo-motor-300rpm",
      displayName: "Dual Shaft BO Motor 300RPM with Rubber Wheel",
      mpn: null,
      manufacturer: "Shenzhen Generic",
      package: "motor",
      specs: { supply_v: [3.0, 6.0], peak_current_ma: 400 },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("BO Gear Motors")!,
      canonicalSlug: "stepper-motor-28byj48",
      displayName: "28BYJ-48 Stepper Motor with ULN2003 Driver",
      mpn: "28BYJ-48",
      manufacturer: "Unbranded",
      package: "motor + board",
      specs: { logic_v: 5.0, supply_v: [5.0, 5.0], peak_current_ma: 300, interfaces: ["GPIO"] },
      packSize: 1,
      unitLabel: "set",
    },

    // Servos
    {
      familyId: familyMap.get("Servo Motors")!,
      canonicalSlug: "servo-sg90-micro",
      displayName: "TowerPro SG90 9g Micro Servo (Clone)",
      mpn: "SG90",
      manufacturer: "TowerPro Clone",
      package: "servo",
      specs: { logic_v: 5.0, supply_v: [4.8, 6.0], peak_current_ma: 650, interfaces: ["GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("Servo Motors")!,
      canonicalSlug: "servo-mg996r-metal",
      displayName: "MG996R High Torque Metal Gear Servo",
      mpn: "MG996R",
      manufacturer: "TowerPro Clone",
      package: "servo",
      specs: { logic_v: 5.0, supply_v: [4.8, 7.2], peak_current_ma: 1400, interfaces: ["GPIO"] },
      packSize: 1,
      unitLabel: "piece",
    },

    // Displays
    {
      familyId: familyMap.get("OLED & LCD Displays")!,
      canonicalSlug: "oled-096-i2c",
      displayName: "0.96 inch I2C OLED Display (128x64)",
      mpn: "SSD1306-096",
      manufacturer: "Solomon Systech Clone",
      package: "module",
      specs: { logic_v: 3.3, supply_v: [3.3, 5.0], interfaces: ["I2C"] },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("OLED & LCD Displays")!,
      canonicalSlug: "lcd-1602-i2c",
      displayName: "16x2 Character LCD with I2C Backpack",
      mpn: "HD44780-PCF8574",
      manufacturer: "Unbranded",
      package: "module",
      specs: { logic_v: 5.0, supply_v: [4.5, 5.5], interfaces: ["I2C"] },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("OLED & LCD Displays")!,
      canonicalSlug: "tft-18-spi-128x160",
      displayName: "1.8 inch Color TFT SPI Display (ST7735)",
      mpn: "ST7735-18",
      manufacturer: "Sitronix Clone",
      package: "module",
      specs: { logic_v: 3.3, supply_v: [3.3, 5.0], interfaces: ["SPI"] },
      packSize: 1,
      unitLabel: "piece",
    },

    // Regulators & Buck
    {
      familyId: familyMap.get("Linear Voltage Regulators")!,
      canonicalSlug: "regulator-ams1117-3v3",
      displayName: "AMS1117 3.3V Step-Down Power Breakout",
      mpn: "AMS1117-3.3",
      manufacturer: "Advanced Monolithic Systems Clone",
      package: "module",
      specs: { output_v: 3.3, regulator_max_ma: 800 },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("DC-DC Buck Converters")!,
      canonicalSlug: "buck-lm2596-dc-dc",
      displayName: "LM2596 Step-Down DC-DC Converter Module",
      mpn: "LM2596S",
      manufacturer: "TI Clone Module",
      package: "module",
      specs: { output_v: 5.0, peak_current_ma: 3000 },
      packSize: 1,
      unitLabel: "piece",
    },

    // Power & Battery
    {
      familyId: familyMap.get("Lithium Battery Holders & Chargers")!,
      canonicalSlug: "battery-holder-18650-2s",
      displayName: "2x 18650 Battery Holder with On/Off Switch",
      mpn: null,
      manufacturer: "Generic",
      package: "holder",
      specs: { output_v: 7.4 },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("Lithium Battery Holders & Chargers")!,
      canonicalSlug: "tp4056-charger-type-c",
      displayName: "TP4056 1A Li-Ion Battery Charger (Type-C)",
      mpn: "TP4056",
      manufacturer: "NanJing Top Power Clone",
      package: "module",
      specs: { output_v: 4.2, peak_current_ma: 1000 },
      packSize: 1,
      unitLabel: "piece",
    },

    // Passives (with packSize > 1)
    {
      familyId: familyMap.get("Resistor Kits & Packs")!,
      canonicalSlug: "resistor-220-1-4w-20pk",
      displayName: "220 Ohm 1/4W Resistors (pack of 20)",
      mpn: null,
      manufacturer: "Generic Carbon Film",
      package: "axial",
      specs: { resistance_ohm: 220, power_w: 0.25 },
      packSize: 20, // Pack size 20
      unitLabel: "pack of 20",
    },
    {
      familyId: familyMap.get("Resistor Kits & Packs")!,
      canonicalSlug: "resistor-10k-1-4w-20pk",
      displayName: "10k Ohm 1/4W Resistors (pack of 20)",
      mpn: null,
      manufacturer: "Generic Carbon Film",
      package: "axial",
      specs: { resistance_ohm: 10000, power_w: 0.25 },
      packSize: 20,
      unitLabel: "pack of 20",
    },
    {
      familyId: familyMap.get("Capacitor Assortment")!,
      canonicalSlug: "capacitor-100uf-electrolytic-10pk",
      displayName: "100uF 25V Electrolytic Capacitors (pack of 10)",
      mpn: null,
      manufacturer: "Generic",
      package: "radial",
      specs: { capacitance_uf: 100, voltage_v: 25 },
      packSize: 10,
      unitLabel: "pack of 10",
    },
    {
      familyId: familyMap.get("LED Packs")!,
      canonicalSlug: "led-5mm-red-10pk",
      displayName: "5mm Red Diffused LEDs (pack of 10)",
      mpn: null,
      manufacturer: "Generic",
      package: "radial-5mm",
      specs: { color: "red", forward_v: 2.0, forward_ma: 20 },
      packSize: 10, // Pack size 10
      unitLabel: "pack of 10",
    },
    {
      familyId: familyMap.get("Breadboards & Jumpers")!,
      canonicalSlug: "jumper-wires-mf-40",
      displayName: "Male to Female Jumper Wires 20cm (pack of 40)",
      mpn: null,
      manufacturer: "Generic DuPont",
      package: "ribbon",
      specs: { pins: 40, length_cm: 20 },
      packSize: 40, // Pack size 40
      unitLabel: "pack of 40",
    },
    {
      familyId: familyMap.get("Breadboards & Jumpers")!,
      canonicalSlug: "jumper-wires-mm-40",
      displayName: "Male to Male Jumper Wires 20cm (pack of 40)",
      mpn: null,
      manufacturer: "Generic DuPont",
      package: "ribbon",
      specs: { pins: 40, length_cm: 20 },
      packSize: 40,
      unitLabel: "pack of 40",
    },
    {
      familyId: familyMap.get("Breadboards & Jumpers")!,
      canonicalSlug: "breadboard-830",
      displayName: "830-Point Solderless Breadboard (MB-102)",
      mpn: "MB-102",
      manufacturer: "Generic",
      package: "breadboard",
      specs: { tie_points: 830 },
      packSize: 1,
      unitLabel: "piece",
    },
    // Fluidics & Power for Canonical 7-line BOM
    {
      familyId: familyMap.get("Water Pumps & Fluidics")!,
      canonicalSlug: "pump-submersible-3-6v",
      displayName: "3-6V Mini Submersible Water Pump",
      mpn: "JT-DC3W",
      manufacturer: "Generic",
      package: "pump",
      specs: { supply_v: [3.0, 6.0], peak_current_ma: 200, package: "pump" },
      packSize: 1,
      unitLabel: "piece",
    },
    {
      familyId: familyMap.get("Tubing & Plumbing")!,
      canonicalSlug: "silicone-tubing-6mm-id",
      displayName: "Silicone Tubing 6mm ID (Food Grade)",
      mpn: null,
      manufacturer: "Generic",
      package: "tubing",
      specs: { inner_diameter_mm: 6, outer_diameter_mm: 8, package: "tubing" },
      packSize: 1,
      unitLabel: "metre",
    },
    {
      familyId: familyMap.get("Power Supplies & Adapters")!,
      canonicalSlug: "power-adapter-5v2a-dc",
      displayName: "5V 2A DC Power Adapter (5.5/2.1mm)",
      mpn: "WA-5V2A",
      manufacturer: "Generic",
      package: "adapter",
      specs: { output_v: 5.0, peak_current_ma: 2000, package: "adapter" },
      packSize: 1,
      unitLabel: "piece",
    },
  ];

  const insertedVariants = await db.insert(componentVariant).values(variantsData).returning();
  console.log(`Inserted ${insertedVariants.length} component variants.`);
  const variantMap = new Map(insertedVariants.map((v) => [v.canonicalSlug, v.id]));

  // 4. Substitution Edges
  const subEdgesData = [
    {
      fromVariantId: variantMap.get("esp32-wroom-32-30pin")!,
      toVariantId: variantMap.get("esp32-devkitc-38pin")!,
      relationType: "equivalent",
      specDelta: { note: "38-pin version has 8 extra GPIO break-outs; wider breadboard footprint." },
      note: "Fully compatible ESP32 board, slightly wider on standard breadboard.",
      confidence: "0.950",
    },
    {
      fromVariantId: variantMap.get("soil-sensor-capacitive-v12")!,
      toVariantId: variantMap.get("soil-sensor-capacitive-v20")!,
      relationType: "upgrade",
      specDelta: { note: "v2.0 adds conformal coating along probe edges for longer durability." },
      note: "Drop-in capacitive replacement with better moisture seal.",
      confidence: "0.980",
    },
    {
      fromVariantId: variantMap.get("soil-sensor-capacitive-v12")!,
      toVariantId: variantMap.get("soil-sensor-resistive-fc28")!,
      relationType: "downgrade",
      specDelta: { note: "Resistive probes corrode in wet soil within 2-4 weeks; outputs 5V logic." },
      note: "Cheaper emergency substitute, will corrode over extended lab projects.",
      confidence: "0.750",
    },
    {
      fromVariantId: variantMap.get("relay-module-5v-1ch")!,
      toVariantId: variantMap.get("relay-module-3v3-1ch")!,
      relationType: "equivalent",
      specDelta: { note: "Direct 3.3V coil trigger, safe for direct ESP32 GPIO connection." },
      note: "Directly compatible with 3.3V microcontrollers without level shifter.",
      confidence: "0.950",
    },
  ];
  await db.insert(substitutionEdge).values(subEdgesData);

  // 5. Seed ~100 Price Observations (Adversarial Data Included!)
  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

  const observationsToInsert: Array<{
    variantSlug: string;
    shopName: string;
    pricePaisa: number;
    stockStatus: "in_stock" | "low" | "out" | "unknown";
    quantity?: number | null;
    observedAt: Date;
    source: "audit" | "bill" | "student" | "shop_whatsapp" | "import";
    note?: string;
  }> = [];

  // Adversarial 1: ESP32 at Om Electronics -> STALE price (₹220, 52 days old audit)
  observationsToInsert.push({
    variantSlug: "esp32-wroom-32-30pin",
    shopName: "Om Electronics",
    pricePaisa: 22000,
    stockStatus: "in_stock",
    observedAt: daysAgo(52), // STALE (>45 days)
    source: "audit",
    note: "Audited 52 days ago; price may have risen.",
  });

  // Adversarial 2: ESP32 at SP Road Robotics -> FRESH price (₹310, today)
  observationsToInsert.push({
    variantSlug: "esp32-wroom-32-30pin",
    shopName: "SP Road Robotics & Kits",
    pricePaisa: 31000,
    stockStatus: "in_stock",
    observedAt: daysAgo(0.5),
    source: "audit",
    note: "Confirmed in person today.",
  });

  // Adversarial 3: ESP32 at Silicon Components -> OUT OF STOCK!
  observationsToInsert.push({
    variantSlug: "esp32-wroom-32-30pin",
    shopName: "Silicon Components Centre",
    pricePaisa: 24000,
    stockStatus: "out",
    observedAt: daysAgo(2),
    source: "shop_whatsapp",
    note: "Shopkeeper reported stockout until next Shenzhen consignment.",
  });

  // Adversarial 4: ESP32 at Bangalore Circuit House -> 2 reports with price variance
  observationsToInsert.push(
    {
      variantSlug: "esp32-wroom-32-30pin",
      shopName: "Bangalore Circuit House",
      pricePaisa: 26000,
      stockStatus: "in_stock",
      observedAt: daysAgo(3),
      source: "student",
      note: "Student bill photo.",
    },
    {
      variantSlug: "esp32-wroom-32-30pin",
      shopName: "Bangalore Circuit House",
      pricePaisa: 28000,
      stockStatus: "in_stock",
      observedAt: daysAgo(5),
      source: "bill",
    }
  );

  // Distribute prices across remaining variants and shops
  const allShops = insertedShops;
  const allVariants = insertedVariants;

  // Base prices in rupees for realistic SP Road rates
  const basePriceMap: Record<string, number> = {
    "esp32-wroom-32-30pin": 270,
    "esp32-devkitc-38pin": 290,
    "esp32-cam-ov2640": 480,
    "arduino-uno-r3-ch340": 380,
    "arduino-nano-v3-ch340": 210,
    "stm32-blue-pill-f103c8t6": 190,
    "nodemcu-esp8266-v3": 180,
    "soil-sensor-capacitive-v12": 85,
    "soil-sensor-resistive-fc28": 45,
    "soil-sensor-capacitive-v20": 130,
    "ultrasonic-hcsr04": 75,
    "ultrasonic-rcwl9610-3v3": 110,
    "sensor-dht11": 65,
    "sensor-dht22-am2302": 240,
    "sensor-bme280-i2c": 280,
    "sensor-tcrt5000-line": 35,
    "relay-module-5v-1ch": 55,
    "relay-module-5v-2ch": 95,
    "relay-module-3v3-1ch": 80,
    "relay-module-5v-4ch": 170,
    "l298n-motor-driver": 130,
    "l293d-motor-shield": 140,
    "tb6612fng-motor-driver": 160,
    "bo-motor-300rpm": 60,
    "stepper-motor-28byj48": 150,
    "servo-sg90-micro": 80,
    "servo-mg996r-metal": 340,
    "oled-096-i2c": 190,
    "lcd-1602-i2c": 160,
    "tft-18-spi-128x160": 320,
    "regulator-ams1117-3v3": 25,
    "buck-lm2596-dc-dc": 70,
    "battery-holder-18650-2s": 50,
    "tp4056-charger-type-c": 35,
    "resistor-220-1-4w-20pk": 25,
    "resistor-10k-1-4w-20pk": 25,
    "capacitor-100uf-electrolytic-10pk": 30,
    "led-5mm-red-10pk": 20,
    "jumper-wires-mf-40": 60,
    "jumper-wires-mm-40": 60,
    "breadboard-830": 110,
    "pump-submersible-3-6v": 160,
    "silicone-tubing-6mm-id": 45,
    "power-adapter-5v2a-dc": 135,
  };

  // Populate ~100 observations across shops
  let obsCount = observationsToInsert.length;
  for (const v of allVariants) {
    const baseP = basePriceMap[v.canonicalSlug] || 100;
    // assign each variant to 2-4 shops
    const numShops = (v.canonicalSlug.charCodeAt(0) % 3) + 2;
    for (let sIdx = 0; sIdx < numShops; sIdx++) {
      const targetShop = allShops[(v.canonicalSlug.length + sIdx * 3) % allShops.length];
      // Skip if already inserted for adversarial test
      if (
        observationsToInsert.some(
          (o) => o.variantSlug === v.canonicalSlug && o.shopName === targetShop.name
        )
      ) {
        continue;
      }

      const variance = ((sIdx * 7) % 15) - 7; // -7 to +7%
      const priceRupees = Math.round(baseP * (1 + variance / 100));
      const ageDays = (sIdx * 4) + 1; // 1 to 15 days ago

      observationsToInsert.push({
        variantSlug: v.canonicalSlug,
        shopName: targetShop.name,
        pricePaisa: priceRupees * 100,
        stockStatus: sIdx === 3 ? "low" : "in_stock",
        observedAt: daysAgo(ageDays),
        source: sIdx === 0 ? "audit" : sIdx === 1 ? "bill" : "student",
      });
      obsCount++;
    }
  }

  // Ensure Om Electronics stocks all 7 canonical items so Fastest plan can achieve full coverage
  const canonicalSlugs = [
    "esp32-wroom-32-30pin",
    "soil-sensor-capacitive-v12",
    "relay-module-5v-1ch",
    "pump-submersible-3-6v",
    "silicone-tubing-6mm-id",
    "jumper-wires-mm-40",
    "power-adapter-5v2a-dc",
  ];

  for (const cSlug of canonicalSlugs) {
    if (
      !observationsToInsert.some(
        (o) => o.variantSlug === cSlug && o.shopName === "Om Electronics"
      )
    ) {
      const baseP = basePriceMap[cSlug] || 100;
      observationsToInsert.push({
        variantSlug: cSlug,
        shopName: "Om Electronics",
        pricePaisa: baseP * 100,
        stockStatus: "in_stock",
        observedAt: daysAgo(3),
        source: "audit",
      });
    }
  }

  // Insert observations
  const dbObservations = observationsToInsert.map((o) => ({
    variantId: variantMap.get(o.variantSlug)!,
    shopId: shopMap.get(o.shopName)!,
    pricePaisa: o.pricePaisa,
    stockStatus: o.stockStatus,
    observedAt: o.observedAt,
    source: o.source,
    note: o.note,
  }));

  const insertedObs = await db.insert(priceObservation).values(dbObservations).returning();
  console.log(`Inserted ${insertedObs.length} price observations.`);

  // 6. Derive current shop listings from observations using calculateConfidence
  const listingsMap = new Map<string, typeof dbObservations>();
  for (const obs of dbObservations) {
    const key = `${obs.shopId}__${obs.variantId}`;
    if (!listingsMap.has(key)) {
      listingsMap.set(key, []);
    }
    listingsMap.get(key)!.push(obs);
  }

  const listingsToInsert: Array<typeof shopListing.$inferInsert> = [];

  for (const [key, obsGroup] of listingsMap.entries()) {
    const [shopId, variantId] = key.split("__");
    const variant = allVariants.find((v) => v.id === variantId)!;
    const shopItem = allShops.find((s) => s.id === shopId)!;

    // Latest observation determines stock and current price
    obsGroup.sort((a, b) => b.observedAt.getTime() - a.observedAt.getTime());
    const latest = obsGroup[0];

    const confResult = calculateConfidence(
      obsGroup.map((o) => ({
        pricePaisa: o.pricePaisa,
        stockStatus: o.stockStatus as any,
        observedAt: o.observedAt,
        source: o.source as any,
      })),
      now
    );

    listingsToInsert.push({
      shopId,
      variantId,
      shopItemName: `${variant.displayName} (${shopItem.name})`,
      pricePaisa: latest.pricePaisa,
      stockStatus: latest.stockStatus,
      lastVerifiedAt: latest.observedAt,
      source: latest.source,
      confidence: confResult.confidence.toString(),
      notes: confResult.isStale ? "STALE_DATA: Last audit > 45 days ago" : null,
    });
  }

  await db.insert(shopListing).values(listingsToInsert);
  console.log(`Derived & inserted ${listingsToInsert.length} active shop listings.`);
  console.log("Seeding completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
