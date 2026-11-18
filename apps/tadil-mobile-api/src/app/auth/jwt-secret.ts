import { environment } from '../../environments/environment';

/** The value sample.env ships with. Anyone can sign tokens with it. */
const SAMPLE_SECRET = 'super-secret';

/**
 * The secret that signs and checks every token of this API: logins, the
 * chat socket, waybill links and file links.
 */
export function jwtSecret(): string {
  const secret = environment.jwtSecret;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return secret;
}

/** Stops the API from starting without a secret that is safe to use. */
export function assertJwtSecretConfigured(): void {
  const secret = jwtSecret();
  if (process.env.NODE_ENV === 'production' && secret === SAMPLE_SECRET) {
    throw new Error('JWT_SECRET is still the sample value. Set a real secret.');
  }
}
