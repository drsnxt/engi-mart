import type { Metadata } from "next";
import { RunSheetClient } from "./run-sheet-client";

export const metadata: Metadata = {
  title: "Run sheet — Smart Plant Watering",
  description: "Demo mobile-first SP Road run sheet with shop stops, checklists and price bands.",
  robots: { index: false, follow: false },
};

export default function DemoRunPage() {
  return <RunSheetClient />;
}
