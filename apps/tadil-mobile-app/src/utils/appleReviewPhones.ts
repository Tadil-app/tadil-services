/**
 * Libellé checkout uniquement. Le contournement du paiement est décidé par l'API.
 * Garder cette liste alignée avec
 * apps/tadil-mobile-api/src/app/customer/apple-review-phones.ts
 * et la vider après la validation Apple.
 */
const APPLE_REVIEW_PHONES = ['0500000001', '0500000002', '0500000003'];

export function isAppleReviewPhone(phone: string | undefined | null): boolean {
  if (!phone || APPLE_REVIEW_PHONES.length === 0) return false;
  const digits = phone.replace(/\D/g, '');
  const local = digits.startsWith('966') ? digits.slice(3) : digits;
  const normalized =
    local.length === 9 && local.startsWith('5') ? `0${local}` : local;
  return APPLE_REVIEW_PHONES.includes(normalized);
}
