import { z } from "zod";

export const createSessionSchema = z.object({
  mode: z.enum(["bom", "idea"]).default("bom"),
  rawText: z.string().optional(),
  idea: z.string().optional(),
  title: z.string().optional(),
  budgetPaisa: z.number().int().positive().optional(),
  budget: z.number().positive().optional(), // In rupees, convertible to paise
  maxStops: z.number().int().min(1).max(5).default(2),
  walkingTolerance: z.enum(["low", "normal", "high"]).default("normal"),
});

export const updateSessionItemSchema = z.object({
  id: z.string().optional(),
  rawText: z.string().min(1),
  qty: z.number().int().min(1).default(1),
  matchedVariantId: z.string().uuid().nullable().optional(),
  userConfirmed: z.boolean().optional(),
  note: z.string().nullable().optional(),
});

export const updateSessionSchema = z.object({
  title: z.string().optional(),
  budgetPaisa: z.number().int().nullable().optional(),
  maxStops: z.number().int().min(1).max(5).optional(),
  walkingTolerance: z.enum(["low", "normal", "high"]).optional(),
  items: z.array(updateSessionItemSchema).optional(),
});

export const feedbackSchema = z.object({
  bomItemId: z.string().uuid().nullable().optional(),
  found: z.boolean(),
  pricePaidPaisa: z.number().int().positive().optional(),
  priceSentiment: z.enum(["fair", "high", "cheap"]).optional(),
  note: z.string().optional(),
});

export const catalogSearchSchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().int().min(1).max(50).default(8),
});
