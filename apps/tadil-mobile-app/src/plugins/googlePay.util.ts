export const GOOGLE_PAY_MERCHANT_ID = String(
  import.meta.env.VITE_GOOGLE_PAY_MERCHANT_ID || ""
).trim();

export function isGooglePayCanceled(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: string; message?: string };
  return e.code === "canceled" || e.message === "canceled";
}

export function formatGooglePayAmount(totalPrice: number): string {
  return (Math.round(Number(totalPrice) * 100) / 100).toFixed(2);
}

export function googlePayEnvironment(
  publishableKey: string | undefined
): "TEST" | "PRODUCTION" {
  return publishableKey?.startsWith("pk_live_") ? "PRODUCTION" : "TEST";
}

export function googlePayEnabled(): boolean {
  return GOOGLE_PAY_MERCHANT_ID.length > 0;
}
