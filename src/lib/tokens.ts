import crypto from "crypto";

export function generateViewId(): string {
  // 10-char alphanumeric slug for clean URLs e.g. "rvce-9f4a1b"
  return "b_" + crypto.randomBytes(5).toString("hex");
}

export function generateEditToken(): string {
  return "edt_" + crypto.randomBytes(16).toString("hex");
}

export function hashEditToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function verifyEditToken(token: string, expectedHash: string): boolean {
  if (!token || !expectedHash) return false;
  const hash = hashEditToken(token);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash));
}
