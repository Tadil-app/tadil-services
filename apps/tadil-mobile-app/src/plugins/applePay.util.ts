export const APPLE_PAY_MERCHANT_ID = "merchant.com.tadil.app";

export function isApplePayCanceled(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: string; message?: string };
  return e.code === "canceled" || e.message === "canceled";
}

export function formatApplePayAmount(totalPrice: number): string {
  return (Math.round(Number(totalPrice) * 100) / 100).toFixed(2);
}
