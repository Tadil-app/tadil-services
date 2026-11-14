/** Roles that receive order alerts by push. */
export const PUSH_ROLES = ["tailor", "courier"] as const;
export type PushRole = (typeof PUSH_ROLES)[number];

export function isPushRole(role: string | null | undefined): role is PushRole {
  return PUSH_ROLES.includes(role as PushRole);
}

/**
 * Where tapping an order alert leads. The push carries the order reference;
 * both the tailor and the driver order screens open an order by it. A push
 * meant for another role (a phone shared between accounts) opens nothing.
 */
export function getPushOrderPath(
  role: string | null | undefined,
  data: Record<string, unknown> | null | undefined,
): string | undefined {
  if (!isPushRole(role)) return;
  const type = typeof data?.type === "string" ? data.type : "";
  if (!type.startsWith(`${role}.`)) return;

  const reference = typeof data?.reference === "string" ? data.reference.trim() : "";
  return reference
    ? `/${role}/orders/${encodeURIComponent(reference)}`
    : `/${role}/orders`;
}
