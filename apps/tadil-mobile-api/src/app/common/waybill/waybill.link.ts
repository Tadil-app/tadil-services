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

/**
 * A short-lived link to the waybill page. The page opens in the phone's
 * browser to print, where the app's login header is not sent, so the link
 * itself carries a token limited to this one order.
 */
export function createWaybillLink(orderId: string, viewer: WaybillViewer, userId: string): WaybillLinkDTO {
  const payload: WaybillLinkPayload = { sub: userId, orderId, viewer, purpose: PURPOSE };
  const token = jwt.sign(payload, secret(), { expiresIn: LINK_TTL });
  const baseUrl = process.env.TADIL_MOBILE_API || `http://localhost:${environment.apiPort}`;
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
