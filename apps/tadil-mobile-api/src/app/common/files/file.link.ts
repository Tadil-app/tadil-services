import * as jwt from 'jsonwebtoken';
import { environment } from '../../../environments/environment';
import { jwtSecret } from '../../auth/jwt-secret';

const PURPOSE = 'file';
const DAY_SECONDS = 24 * 60 * 60;
/** A link works for at least this long after it is handed out. */
const MIN_LIFETIME_DAYS = 7;

interface FileLinkPayload {
  fid: string;
  purpose: typeof PURPOSE;
}

function apiBaseUrl(): string {
  return process.env.TADIL_MOBILE_API || `http://localhost:${environment.apiPort}`;
}

/**
 * A link to a stored file that only works for that file and only for a while.
 * Order photos and chat media are private, so `GET /api/files/:id` asks for
 * this token. The expiry is rounded to the day, so the same file gets the same
 * link all day and the app's image cache keeps working.
 */
export function signedFileUrl(fileId: string, baseUrl = apiBaseUrl()): string {
  const today = Math.floor(Date.now() / 1000 / DAY_SECONDS) * DAY_SECONDS;
  const payload: FileLinkPayload & { exp: number } = {
    fid: fileId,
    purpose: PURPOSE,
    exp: today + (MIN_LIFETIME_DAYS + 1) * DAY_SECONDS,
  };
  const token = jwt.sign(payload, jwtSecret(), { noTimestamp: true });
  return `${baseUrl}/api/files/${encodeURIComponent(fileId)}?token=${encodeURIComponent(token)}`;
}

/** True when the token is a valid link to this file. */
export function verifyFileToken(token: string | undefined, fileId: string): boolean {
  if (!token) return false;
  try {
    const payload = jwt.verify(token, jwtSecret()) as Partial<FileLinkPayload>;
    return payload.purpose === PURPOSE && payload.fid === fileId;
  } catch {
    return false;
  }
}

/**
 * The stored file id from a file link or id the app sends back. The app takes
 * the last path segment of a link, so a signed link would bring its
 * `?token=...` along.
 */
export function fileIdFromLink(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  const path = value.split(/[?#]/)[0];
  return path.split('/').pop() ?? path;
}
