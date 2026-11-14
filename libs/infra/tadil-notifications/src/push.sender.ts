import { readFileSync } from 'fs';
import { resolve } from 'path';
import { cert, getApp, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getMessaging, type Messaging } from 'firebase-admin/messaging';

/** Android channel the app creates at start; it carries sound and heads-up. */
export const ORDERS_CHANNEL_ID = 'orders';

export interface PushMessage {
  tokens: string[];
  title: string;
  body: string;
  data: Record<string, string>;
}

export interface PushSender {
  /** Sends and returns the tokens FCM says are dead, to be forgotten. */
  send(message: PushMessage): Promise<string[]>;
}

// FCM accepts at most 500 tokens per multicast.
const MAX_TOKENS_PER_CALL = 500;

const DEAD_TOKEN_CODES = new Set([
  'messaging/registration-token-not-registered',
  'messaging/invalid-registration-token',
]);

export class FcmPushSender implements PushSender {
  constructor(private readonly _messaging: Messaging) {}

  async send(message: PushMessage): Promise<string[]> {
    const dead: string[] = [];
    for (let i = 0; i < message.tokens.length; i += MAX_TOKENS_PER_CALL) {
      const tokens = message.tokens.slice(i, i + MAX_TOKENS_PER_CALL);
      const result = await this._messaging.sendEachForMulticast({
        tokens,
        notification: { title: message.title, body: message.body },
        data: message.data,
        android: {
          priority: 'high',
          notification: {
            channelId: ORDERS_CHANNEL_ID,
            sound: 'default',
            defaultVibrateTimings: true,
          },
        },
        apns: {
          headers: { 'apns-priority': '10', 'apns-push-type': 'alert' },
          payload: { aps: { sound: 'default' } },
        },
      });
      result.responses.forEach((response, index) => {
        if (response.success) return;
        const code = response.error?.code ?? '';
        if (DEAD_TOKEN_CODES.has(code)) {
          dead.push(tokens[index]);
        } else {
          console.warn(`[push] FCM refused a message: ${code} ${response.error?.message ?? ''}`);
        }
      });
    }
    return dead;
  }
}

/** Used when Firebase is not configured (local dev): logs, sends nothing. */
export class NoopPushSender implements PushSender {
  async send(message: PushMessage): Promise<string[]> {
    console.log(`[push] Firebase not configured, skipped "${message.title}" to ${message.tokens.length} device(s)`);
    return [];
  }
}

/**
 * Reads the Firebase service account from, in order:
 * - FIREBASE_SERVICE_ACCOUNT_JSON: the JSON itself, raw or base64 (for hosts
 *   where shipping a file is awkward, e.g. Railway variables);
 * - FIREBASE_SERVICE_ACCOUNT_PATH: a path to the JSON file, relative to the
 *   working directory (e.g. secrets/firebase/service-account.json).
 */
export function loadServiceAccount(env: NodeJS.ProcessEnv = process.env): ServiceAccount | undefined {
  const inline = env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (inline) {
    const json = inline.startsWith('{') ? inline : Buffer.from(inline, 'base64').toString('utf-8');
    return JSON.parse(json);
  }
  const path = env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
  if (path) {
    return JSON.parse(readFileSync(resolve(process.cwd(), path), 'utf-8'));
  }
  return undefined;
}

export function createPushSender(env: NodeJS.ProcessEnv = process.env): PushSender {
  let account: ServiceAccount | undefined;
  try {
    account = loadServiceAccount(env);
  } catch (error) {
    console.error('[push] Could not read the Firebase service account; push is disabled.', error);
    return new NoopPushSender();
  }
  if (!account) {
    console.warn('[push] FIREBASE_SERVICE_ACCOUNT_PATH / _JSON not set; push is disabled.');
    return new NoopPushSender();
  }
  const app = getApps().length > 0 ? getApp() : initializeApp({ credential: cert(account) });
  return new FcmPushSender(getMessaging(app));
}
