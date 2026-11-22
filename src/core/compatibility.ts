import { CompatibilityViolation, ComponentSpecs } from "./types";

export interface ComponentWithSpecs {
  id: string;
  name: string;
  specs: ComponentSpecs;
}

export function checkLogicLevelCompatibility(
  compA: ComponentWithSpecs,
  compB: ComponentWithSpecs
): CompatibilityViolation | null {
  const logicA = compA.specs.logic_v;
  const logicB = compB.specs.logic_v;

  if (logicA === undefined || logicB === undefined) {
    return null;
  }

  const delta = Math.abs(logicA - logicB);
  if (delta <= 0.4) {
    return null;
  }

  // Check if 5V tolerant
  if (
    (logicA === 3.3 && logicB === 5.0 && compA.specs.input_5v_tolerant) ||
    (logicB === 3.3 && logicA === 5.0 && compB.specs.input_5v_tolerant)
  ) {
    return {
      rule: "LogicLevelRule",
      severity: "info",
      message: `${compA.name} (${logicA}V) and ${compB.name} (${logicB}V) have different logic levels, but input is 5V-tolerant.`,
      componentA: compA.name,
      componentB: compB.name,
    };
  }

  const severity = delta > 0.8 ? "error" : "warning";
  const remedy =
    delta > 0.8
      ? "Use a bidirectional logic level shifter (e.g. 4-channel TXS0108E / BSS138) or transistor buffer."
      : "Verify input threshold voltages (Vih / Vil) before direct connection.";

  return {
    rule: "LogicLevelRule",
    severity,
    message: `Logic level mismatch between ${compA.name} (${logicA}V) and ${compB.name} (${logicB}V). Direct connection may fail or cause damage.`,
    remedy,
    componentA: compA.name,
    componentB: compB.name,
  };
}

export function checkVoltageRange(
  source: ComponentWithSpecs,
  load: ComponentWithSpecs
): CompatibilityViolation | null {
  const outV = source.specs.output_v;
  const supplyV = load.specs.supply_v;

  if (outV === undefined || supplyV === undefined) {
    return null;
  }

  let minV: number;
  let maxV: number;
  if (Array.isArray(supplyV)) {
    [minV, maxV] = supplyV;
  } else {
    minV = supplyV * 0.9;
    maxV = supplyV * 1.1;
  }

  if (outV < minV || outV > maxV) {
    return {
      rule: "VoltageRangeRule",
      severity: "error",
      message: `${source.name} supplies ${outV}V, but ${load.name} requires ${minV}V–${maxV}V supply voltage.`,
      remedy: `Add a DC-DC buck/boost regulator or LDO (e.g. AMS1117 or LM2596) matching the required voltage.`,
      componentA: source.name,
      componentB: load.name,
    };
  }

  return null;
}

export function checkBusMatch(
  compA: ComponentWithSpecs,
  compB: ComponentWithSpecs
): CompatibilityViolation | null {
  const ifacesA = compA.specs.interfaces;
  const ifacesB = compB.specs.interfaces;

  if (!ifacesA || !ifacesB || ifacesA.length === 0 || ifacesB.length === 0) {
    return null;
  }

  const common = ifacesA.filter((i) => ifacesB.includes(i));
  if (common.length === 0) {
    return {
      rule: "BusMatchRule",
      severity: "warning",
      message: `No common communication interface between ${compA.name} (${ifacesA.join(", ")}) and ${compB.name} (${ifacesB.join(", ")}).`,
      remedy: "Confirm that both components can communicate over a shared protocol or GPIO bit-banging.",
      componentA: compA.name,
      componentB: compB.name,
    };
  }

  return null;
}

export function checkPowerBudget(
  source: ComponentWithSpecs,
  loads: ComponentWithSpecs[]
): CompatibilityViolation | null {
  const maxRegulatorMa = source.specs.regulator_max_ma;
  if (!maxRegulatorMa) {
    return null;
  }

  let totalPeakMa = 0;
  for (const load of loads) {
    totalPeakMa += load.specs.peak_current_ma || 0;
  }

  if (totalPeakMa > maxRegulatorMa) {
    const severity = totalPeakMa > maxRegulatorMa * 1.25 ? "error" : "warning";
    return {
      rule: "PowerBudgetRule",
      severity,
      message: `Combined peak load current (${totalPeakMa}mA) exceeds ${source.name}'s onboard regulator limit (${maxRegulatorMa}mA).`,
      remedy: "Provide external dedicated power supply for power-hungry peripherals (servos, relays, wireless modules).",
      componentA: source.name,
      componentB: `${loads.length} peripherals`,
    };
  }

  return null;
}

export function evaluateCompatibility(components: ComponentWithSpecs[]): CompatibilityViolation[] {
  const violations: CompatibilityViolation[] = [];

  // Pairwise checks
  for (let i = 0; i < components.length; i++) {
    for (let j = i + 1; j < components.length; j++) {
      const a = components[i];
      const b = components[j];

      const logicViolation = checkLogicLevelCompatibility(a, b);
      if (logicViolation) violations.push(logicViolation);

      const voltageViolation1 = checkVoltageRange(a, b);
      if (voltageViolation1) violations.push(voltageViolation1);
      const voltageViolation2 = checkVoltageRange(b, a);
      if (voltageViolation2) violations.push(voltageViolation2);

      // Bus check if both are digital / communication peripherals
      if (a.specs.interfaces && b.specs.interfaces) {
        // Only warn if neither has plain GPIO and they try to connect
        const bothLackCommon = checkBusMatch(a, b);
        if (bothLackCommon) violations.push(bothLackCommon);
      }
    }
  }

  // Power budget check: if there is an MCU or Power board with regulator_max_ma
  const powerSources = components.filter((c) => c.specs.regulator_max_ma !== undefined);
  for (const source of powerSources) {
    const loads = components.filter((c) => c.id !== source.id && (c.specs.peak_current_ma ?? 0) > 0);
    const powerViolation = checkPowerBudget(source, loads);
    if (powerViolation) violations.push(powerViolation);
  }

  return violations;
}
