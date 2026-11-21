import * as argon2 from 'argon2';
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac } from 'crypto';
import { AuthService } from './auth.service';

jest.mock('argon2', () => ({
  hash: jest.fn(async (value: unknown) => `hashed:${String(value)}`),
  verify: jest.fn(async () => true),
  argon2id: 2,
}));

const otpDigest = (value: string) =>
  createHmac('sha256', 'dev-only-staff-mfa-pepper').update(value).digest('hex');

const transaction = () => ({
  $executeRaw: jest.fn(),
  staffAccount: {
    findUnique: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    count: jest.fn(),
  },
  staffRole: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  staffSession: { create: jest.fn(), updateMany: jest.fn() },
  staffToken: {
    create: jest.fn(),
    updateMany: jest.fn(),
    findUnique: jest.fn(),
  },
  staffMfaChallenge: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  staffAudit: { create: jest.fn() },
  staffLoginThrottle: {
    updateMany: jest.fn(),
    upsert: jest.fn(),
  },
});

const database = () => {
  const tx = transaction();
  return {
    tx,
    staffAccount: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    staffRole: { findMany: jest.fn() },
    staffSession: { findUnique: jest.fn() },
    staffToken: { findUnique: jest.fn() },
    staffMfaChallenge: {
      findUnique: jest.fn(),
      updateMany: jest.fn(),
    },
    staffAudit: { create: jest.fn() },
    staffLoginThrottle: {
      updateMany: jest.fn().mockResolvedValue({ count: 0 }),
      upsert: jest.fn().mockResolvedValue({ failures: 1 }),
    },
    $transaction: jest.fn(async (callback: (value: any) => unknown) =>
      callback(tx)
    ),
  };
};

const mail = () => ({
  sendLoginOtp: jest.fn().mockResolvedValue(undefined),
});

const account = {
  id: 'account',
  email: 'admin@example.com',
  name: 'Admin',
  active: true,
  passwordHash: 'hash',
  isSystemAdmin: false,
  grants: [],
  denials: [],
  roles: [],
};

describe('AuthService', () => {
  afterEach(() => jest.clearAllMocks());

  it('rejects unknown permissions as a bad request', async () => {
    const db = database();
    const service = new AuthService(db as any, mail() as any);
    await expect(
      service.createRole(
        { id: 'actor', permissions: ['roles.create'], isSystemAdmin: false },
        { name: 'Invalid', permissions: ['orders.delete'] }
      )
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it('revalidates the actor inside the create-role transaction', async () => {
    const db = database();
    db.tx.staffAccount.findUnique.mockResolvedValue({
      id: 'actor',
      active: true,
      isSystemAdmin: false,
      grants: [],
      denials: [],
      roles: [
        { roleId: 'r', role: { id: 'r', name: 'Reader', permissions: [] } },
      ],
    });
    db.tx.staffRole.create.mockResolvedValue({ id: 'new-role' });
    const service = new AuthService(db as any, mail() as any);
    await expect(
      service.createRole(
        { id: 'actor', permissions: ['roles.create'], isSystemAdmin: false },
        { name: 'Delegated', permissions: ['orders.read'] }
      )
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(db.tx.staffRole.create).not.toHaveBeenCalled();
    expect(db.tx.$executeRaw).toHaveBeenCalled();
  });

  it('validates password strength and revokes sessions, tokens, and MFA challenges under lock', async () => {
    const db = database();
    db.staffAccount.findUnique.mockResolvedValue({
      id: 'account',
      active: true,
      passwordHash: 'old',
    });
    db.tx.staffAccount.updateMany.mockResolvedValue({ count: 1 });
    const service = new AuthService(db as any, mail() as any);

    await expect(
      service.changePassword('account', 'old', 'weak-password')
    ).rejects.toBeInstanceOf(BadRequestException);
    await service.changePassword('account', 'old', 'Strong-password1!');

    expect(argon2.hash).toHaveBeenCalled();
    expect(db.tx.$executeRaw).toHaveBeenCalled();
    expect(db.tx.staffAccount.updateMany).toHaveBeenCalled();
    expect(db.tx.staffSession.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { accountId: 'account', revokedAt: null },
        data: expect.objectContaining({ revokedAt: expect.any(Date) }),
      })
    );
    expect(db.tx.staffToken.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { accountId: 'account', usedAt: null },
        data: expect.objectContaining({ usedAt: expect.any(Date) }),
      })
    );
    expect(db.tx.staffMfaChallenge.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { accountId: 'account', usedAt: null },
        data: expect.objectContaining({ usedAt: expect.any(Date) }),
      })
    );
    expect(db.tx.staffAudit.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ action: 'password.changed' }),
      })
    );
  });

  it('issues an MFA challenge after valid credentials instead of a session', async () => {
    const db = database();
    const mailer = mail();
    db.staffAccount.findUnique.mockResolvedValue(account);
    db.tx.staffAccount.findUnique.mockResolvedValue(account);
    db.tx.staffMfaChallenge.updateMany.mockResolvedValue({ count: 0 });
    db.tx.staffMfaChallenge.create.mockResolvedValue({ id: 'challenge' });
    const service = new AuthService(db as any, mailer as any);

    const result = await service.login(account.email, 'Strong-password1!');

    expect(result).toEqual(
      expect.objectContaining({ mfaRequired: true, mfaToken: expect.any(String) })
    );
    expect(db.tx.staffSession.create).not.toHaveBeenCalled();
    expect(mailer.sendLoginOtp).toHaveBeenCalledWith(
      account.email,
      expect.stringMatching(/^\d{6}$/)
    );
    expect(db.tx.staffMfaChallenge.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { accountId: account.id, usedAt: null },
      })
    );
  });

  it('invalidates the challenge if email delivery fails', async () => {
    const db = database();
    const mailer = mail();
    mailer.sendLoginOtp.mockRejectedValue(new Error('smtp down'));
    db.staffAccount.findUnique.mockResolvedValue(account);
    db.tx.staffAccount.findUnique.mockResolvedValue(account);
    db.tx.staffMfaChallenge.create.mockResolvedValue({ id: 'challenge' });
    const service = new AuthService(db as any, mailer as any);

    await expect(
      service.login(account.email, 'Strong-password1!')
    ).rejects.toThrow('smtp down');
    expect(db.staffMfaChallenge.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'challenge', usedAt: null },
        data: expect.objectContaining({ usedAt: expect.any(Date) }),
      })
    );
  });

  it('creates a session when MFA succeeds and rejects reuse', async () => {
    const db = database();
    const token = 'a'.repeat(43);
    const code = '123456';
    db.tx.staffMfaChallenge.findUnique.mockResolvedValue({
      id: 'challenge',
      accountId: account.id,
      otpHash: otpDigest(code),
      attempts: 0,
      usedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      account,
    });
    db.tx.staffMfaChallenge.updateMany.mockResolvedValue({ count: 1 });
    const service = new AuthService(db as any, mail() as any);

    const result = await service.verifyMfa(token, code);
    expect(result).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.objectContaining({ email: account.email }),
      })
    );
    expect(db.tx.staffSession.create).toHaveBeenCalled();

    db.tx.staffMfaChallenge.updateMany.mockResolvedValue({ count: 0 });
    await expect(service.verifyMfa(token, code)).rejects.toBeInstanceOf(
      UnauthorizedException
    );
  });

  it('rejects expired OTP and wrong codes with attempt limits', async () => {
    const db = database();
    const token = 'b'.repeat(43);
    db.tx.staffMfaChallenge.findUnique.mockResolvedValue({
      id: 'challenge',
      accountId: account.id,
      otpHash: otpDigest('999999'),
      attempts: 0,
      usedAt: null,
      expiresAt: new Date(Date.now() - 1),
      account,
    });
    const service = new AuthService(db as any, mail() as any);
    await expect(service.verifyMfa(token, '999999')).rejects.toBeInstanceOf(
      UnauthorizedException
    );

    db.tx.staffMfaChallenge.findUnique.mockResolvedValue({
      id: 'challenge',
      accountId: account.id,
      otpHash: otpDigest('999999'),
      attempts: 4,
      usedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      account,
    });
    await expect(service.verifyMfa(token, '000000')).rejects.toBeInstanceOf(
      UnauthorizedException
    );
    expect(db.tx.staffMfaChallenge.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          attempts: 5,
          usedAt: expect.any(Date),
        }),
      })
    );
  });

  it('enforces resend cooldown', async () => {
    const db = database();
    const token = 'c'.repeat(43);
    db.staffMfaChallenge.findUnique.mockResolvedValue({
      id: 'challenge',
      accountId: account.id,
      usedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      lastSentAt: new Date(),
      account,
    });
    const service = new AuthService(db as any, mail() as any);
    await expect(service.resendMfa(token)).rejects.toBeInstanceOf(
      UnauthorizedException
    );
  });
});
