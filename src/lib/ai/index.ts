export interface AiBomDraftItem {
  rawText: string;
  qty: number;
  role?: string;
  candidateSlug?: string;
  optional?: boolean;
}

export interface DisambiguationResult {
  matchedId: string | null;
  clarificationQuestion?: string;
}

export interface AiProvider {
  parseIdeaToBom(idea: string): Promise<AiBomDraftItem[]>;
  disambiguateItem(
    rawText: string,
    candidates: Array<{ id: string; name: string; specs: Record<string, unknown> }>
  ): Promise<DisambiguationResult>;
}

export class MockAiProvider implements AiProvider {
  async parseIdeaToBom(idea: string): Promise<AiBomDraftItem[]> {
    const text = idea.toLowerCase();

    if (text.includes("soil") || text.includes("plant") || text.includes("agri") || text.includes("farm")) {
      return [
        { rawText: "ESP32-WROOM-32 (30-pin)", qty: 1, role: "Main Microcontroller", candidateSlug: "esp32-wroom-32-30pin" },
        { rawText: "Capacitive Soil Moisture Sensor v1.2", qty: 2, role: "Soil Moisture Detection", candidateSlug: "soil-sensor-capacitive-v12" },
        { rawText: "5V 1-Channel Relay Module", qty: 1, role: "Water Pump Control", candidateSlug: "relay-module-5v-1ch" },
        { rawText: "0.96 inch I2C OLED Display (128x64)", qty: 1, role: "Telemetry Display", candidateSlug: "oled-096-i2c", optional: true },
        { rawText: "Male to Female Jumper Wires 20cm (pack of 40)", qty: 1, role: "Interconnects", candidateSlug: "jumper-wires-mf-40" },
        { rawText: "Breadboard 830 Points", qty: 1, role: "Prototyping", candidateSlug: "breadboard-830" },
      ];
    }

    if (text.includes("robot") || text.includes("car") || text.includes("line follower") || text.includes("motor")) {
      return [
        { rawText: "Arduino Uno R3 (CH340G Clone)", qty: 1, role: "Microcontroller", candidateSlug: "arduino-uno-r3-ch340" },
        { rawText: "L298N Dual H-Bridge Motor Driver Module", qty: 1, role: "Motor Control", candidateSlug: "l298n-motor-driver" },
        { rawText: "TCRT5000 IR Line Tracking Sensor Module", qty: 2, role: "Line Tracking", candidateSlug: "tcrt5000-sensor" },
        { rawText: "Dual Shaft BO Motor 300RPM with Wheel", qty: 2, role: "Drive Wheels", candidateSlug: "bo-motor-300rpm" },
        { rawText: "2x 18650 Battery Holder with Switch", qty: 1, role: "Power Pack", candidateSlug: "battery-holder-18650-2s" },
      ];
    }

    if (text.includes("weather") || text.includes("temp") || text.includes("home")) {
      return [
        { rawText: "ESP8266 NodeMCU v3", qty: 1, role: "Wi-Fi Controller", candidateSlug: "nodemcu-esp8266" },
        { rawText: "DHT11 Temperature & Humidity Sensor", qty: 1, role: "Climate Sensor", candidateSlug: "dht11-sensor" },
        { rawText: "16x2 I2C Character LCD Display", qty: 1, role: "Status Display", candidateSlug: "lcd-1602-i2c", optional: true },
        { rawText: "5V 2A USB-C Power Adapter / Cable", qty: 1, role: "Power", candidateSlug: "power-supply-5v2a" },
      ];
    }

    // Default template for general IoT projects
    return [
      { rawText: "ESP32-WROOM-32 (30-pin)", qty: 1, role: "Main Controller", candidateSlug: "esp32-wroom-32-30pin" },
      { rawText: "Breadboard 830 Points", qty: 1, role: "Prototyping", candidateSlug: "breadboard-830" },
      { rawText: "Male to Male Jumper Wires 20cm (pack of 40)", qty: 1, role: "Wiring", candidateSlug: "jumper-wires-mm-40" },
      { rawText: "5mm Red LEDs (pack of 10)", qty: 1, role: "Indicators", candidateSlug: "led-5mm-red-10pk" },
      { rawText: "220 Ohm 1/4W Resistors (pack of 20)", qty: 1, role: "Current Limiting", candidateSlug: "resistor-220-1-4w-20pk" },
    ];
  }

  async disambiguateItem(
    rawText: string,
    candidates: Array<{ id: string; name: string; specs: Record<string, unknown> }>
  ): Promise<DisambiguationResult> {
    const text = rawText.toLowerCase();

    // Ambiguous ESP32
    if (text.includes("esp32")) {
      if (text.includes("38") || text.includes("38-pin")) {
        const found = candidates.find((c) => c.name.toLowerCase().includes("38"));
        if (found) return { matchedId: found.id };
      }
      if (text.includes("cam")) {
        const found = candidates.find((c) => c.name.toLowerCase().includes("cam"));
        if (found) return { matchedId: found.id };
      }
      return {
        matchedId: null,
        clarificationQuestion: "Which ESP32 variant do you need? (30-pin standard, 38-pin expanded, or ESP32-CAM with OV2640?)",
      };
    }

    // Ambiguous Soil Sensor
    if (text.includes("soil")) {
      if (text.includes("capacitive")) {
        const found = candidates.find((c) => c.name.toLowerCase().includes("capacitive"));
        if (found) return { matchedId: found.id };
      }
      if (text.includes("resistive")) {
        const found = candidates.find((c) => c.name.toLowerCase().includes("resistive"));
        if (found) return { matchedId: found.id };
      }
      return {
        matchedId: null,
        clarificationQuestion: "Do you need a Capacitive Soil Moisture Sensor (corrosion-resistant) or cheap Resistive Probe?",
      };
    }

    // Default: choose first if exact-ish, else null
    if (candidates.length > 0) {
      return { matchedId: candidates[0].id };
    }

    return { matchedId: null };
  }
}

export function getAiProvider(): AiProvider {
  // Can instantiate Vertex AI Gemini 3.8 Flash if configured and requested
  return new MockAiProvider();
}
