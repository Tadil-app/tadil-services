const ORDER_DEEP_LINK_SCHEME = "tadil:";

export function createTailorOrderDeepLink(reference: string): string {
  return `tadil://tailor/orders/${encodeURIComponent(reference)}`;
}

export function getTailorOrderPath(value: string): string | undefined {
  try {
    const url = new URL(value);
    const segments = url.pathname.split("/").filter(Boolean);
    if (
      url.protocol !== ORDER_DEEP_LINK_SCHEME ||
      url.hostname !== "tailor" ||
      segments.length !== 2 ||
      segments[0] !== "orders"
    ) {
      return;
    }

    return `/tailor/orders/${encodeURIComponent(decodeURIComponent(segments[1]))}`;
  } catch {
    return;
  }
}
