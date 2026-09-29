/**
 * Comptes réservés à la revue App Store.
 * Pour ces numéros, la commande est confirmée sans Moyasar
 * (paiement comptant à la livraison).
 *
 * Vider ce tableau après la validation Apple pour rétablir le paiement actuel.
 * Le même tableau doit rester aligné avec
 * apps/tadil-mobile-app/src/utils/appleReviewPhones.ts
 */
export const APPLE_REVIEW_PHONES = ['0500000001', '0500000002', '0500000003'];

export function isAppleReviewPhone(phone: string | undefined | null): boolean {
  if (!phone || APPLE_REVIEW_PHONES.length === 0) return false;
  const normalized = normalizeSaudiPhone(phone);
  return APPLE_REVIEW_PHONES.some(
    (reviewPhone) => normalizeSaudiPhone(reviewPhone) === normalized
  );
}

function normalizeSaudiPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const local = digits.startsWith('966') ? digits.slice(3) : digits;
  if (local.length === 9 && local.startsWith('5')) return `0${local}`;
  return local;
}
