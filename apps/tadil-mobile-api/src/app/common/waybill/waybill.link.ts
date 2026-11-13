import * as jwt from 'jsonwebtoken';
import { ApiProperty } from '@nestjs/swagger';
import { environment } from '../../../environments/environment';
import { WaybillViewer } from './waybill.builder';

const PURPOSE = 'waybill';
const LINK_TTL = '30m';

interface WaybillLinkPayload {
  sub: string;
  orderId: string;
  viewer: WaybillViewer;
  purpose: typeof PURPOSE;
}

export class WaybillLinkDTO {
  /** The waybill page, to show inside the app. */
  @ApiProperty() viewUrl!: string;
  /** The same page that opens the print dialog, for the phone's browser. */
  @ApiProperty() printUrl!: string;
  @ApiProperty() expiresInMinutes!: number;
}

const secret = () => environment.jwtSecret || 'super-secret';

interface RequestLike {
  protocol?: string;
  headers: Record<string, string | string[] | undefined>;
}

function firstHeader(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.split(',')[0]?.trim() || undefined;
}

/**
 * The address the app used to reach this API, so the link works from the
 * phone that asked for it. TADIL_MOBILE_API can be a server-local address
 * (e.g. localhost) that a phone cannot open. Behind a proxy such as Railway
 * the forwarded headers carry the public address.
 */
export function publicBaseUrl(request: RequestLike): string {
  const host = firstHeader(request.headers['x-forwarded-host']) ?? firstHeader(request.headers['host']);
  if (host && /^[a-z0-9.:\[\]-]+$/i.test(host)) {
    const proto = firstHeader(request.headers['x-forwarded-proto']) ?? request.protocol ?? 'http';
    return `${proto === 'https' ? 'https' : 'http'}://${host}`;
  }
  return process.env.TADIL_MOBILE_API || `http://localhost:${environment.apiPort}`;
}

/**
 * A short-lived link to the waybill page. The page opens in the phone's
 * browser to print, where the app's login header is not sent, so the link
 * itself carries a token limited to this one order.
 */
export function createWaybillLink(
  orderId: string,
  viewer: WaybillViewer,
  userId: string,
  baseUrl: string
): WaybillLinkDTO {
  const payload: WaybillLinkPayload = { sub: userId, orderId, viewer, purpose: PURPOSE };
  const token = jwt.sign(payload, secret(), { expiresIn: LINK_TTL });
  const viewUrl = `${baseUrl}/api/waybill/${encodeURIComponent(orderId)}?token=${encodeURIComponent(token)}`;
  return { viewUrl, printUrl: `${viewUrl}&print=1`, expiresInMinutes: 30 };
}

/** The link's holder and role, or null when the token is invalid for this order. */
export function verifyWaybillToken(token: string, orderId: string): WaybillLinkPayload | null {
  try {
    const payload = jwt.verify(token, secret()) as Partial<WaybillLinkPayload>;
    if (
      payload.purpose !== PURPOSE ||
      payload.orderId !== orderId ||
      typeof payload.sub !== 'string' ||
      (payload.viewer !== 'tailor' && payload.viewer !== 'courier')
    ) {
      return null;
    }
    return payload as WaybillLinkPayload;
  } catch {
    return null;
  }
}
