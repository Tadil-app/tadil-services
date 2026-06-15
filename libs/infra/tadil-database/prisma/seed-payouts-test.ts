/**
 * TEMPORARY test data for the payout-requests / wallet feature.
 *
 * Seeds a few existing tailor/courier users with wallet balances,
 * transactions, and payout requests (incl. a PENDING one so they show
 * up on the admin "Payout Requests" screen).
 *
 * This is throwaway data — everything it creates is tagged so it can be
 * removed cleanly:
 *   - transactions:   id starts with "test-txn-",   reference starts with "TEST-"
 *   - payoutRequests: id starts with "test-payout-"
 *   - original wallet balances are saved to a sidecar file and restored on clean.
 *
 * Usage:
 *   seed:   node --loader ts-node/esm prisma/seed-payouts-test.ts
 *   clean:  node --loader ts-node/esm prisma/seed-payouts-test.ts --clean
 *
 * (or via the package scripts: prisma-seed-payouts-test / prisma-clean-payouts-test)
 *
 * TODO: delete this file and run --clean once manual testing is done.
 */
import { PrismaClient, TransactionType, PayoutStatus } from '@prisma/client';
import { existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const prisma = new PrismaClient();

const sidecar = join(
  dirname(fileURLToPath(import.meta.url)),
  '.seed-payouts-test.json'
);

const TXN_ID_PREFIX = 'test-txn-';
const TXN_REF_PREFIX = 'TEST-';
const PAYOUT_ID_PREFIX = 'test-payout-';

// How many existing tailor/courier users to seed (picked deterministically).
const USER_COUNT = 4;

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

async function pickUsers() {
  return prisma.user.findMany({
    where: { role: { in: ['tailor', 'courier'] } },
    select: { id: true, firstName: true, lastName: true, walletBalance: true },
    orderBy: { id: 'asc' },
    take: USER_COUNT,
  });
}

async function seed() {
  const users = await pickUsers();
  if (users.length === 0) {
    console.log('No tailor/courier users found — nothing to seed.');
    return;
  }

  // Save original balances once, so --clean can restore them.
  if (!existsSync(sidecar)) {
    const original = Object.fromEntries(
      users.map((u) => [u.id, u.walletBalance])
    );
    writeFileSync(sidecar, JSON.stringify(original, null, 2));
  }

  for (const [i, user] of users.entries()) {
    const richHistory = i < 2; // first two users also get fulfilled/rejected history

    // --- transactions (earnings + one past payout) ---
    const txns: {
      id: string;
      reference: string;
      amount: number;
      type: TransactionType;
      date: Date;
    }[] = [
      {
        id: `${TXN_ID_PREFIX}earn-1-${user.id}`,
        reference: `${TXN_REF_PREFIX}EARN-1-${user.id}`,
        amount: 200,
        type: TransactionType.EARNING,
        date: daysAgo(12),
      },
      {
        id: `${TXN_ID_PREFIX}earn-2-${user.id}`,
        reference: `${TXN_REF_PREFIX}EARN-2-${user.id}`,
        amount: 350,
        type: TransactionType.EARNING,
        date: daysAgo(6),
      },
    ];
    if (richHistory) {
      txns.push({
        id: `${TXN_ID_PREFIX}payout-1-${user.id}`,
        reference: `${TXN_REF_PREFIX}PAYOUT-1-${user.id}`,
        amount: 100,
        type: TransactionType.PAYOUT,
        date: daysAgo(4),
      });
    }

    for (const t of txns) {
      await prisma.transaction.upsert({
        where: { id: t.id },
        update: { amount: t.amount, type: t.type, date: t.date },
        create: { ...t, userId: user.id },
      });
    }

    // --- payout requests ---
    const payouts: {
      id: string;
      amount: number;
      status: PayoutStatus;
      date: Date;
    }[] = [
      {
        id: `${PAYOUT_ID_PREFIX}pending-${user.id}`,
        amount: 250,
        status: PayoutStatus.PENDING,
        date: daysAgo(1),
      },
    ];
    if (richHistory) {
      payouts.push(
        {
          id: `${PAYOUT_ID_PREFIX}fulfilled-${user.id}`,
          amount: 100,
          status: PayoutStatus.FULFILLED,
          date: daysAgo(4),
        },
        {
          id: `${PAYOUT_ID_PREFIX}rejected-${user.id}`,
          amount: 80,
          status: PayoutStatus.REJECTED,
          date: daysAgo(8),
        }
      );
    }

    for (const p of payouts) {
      await prisma.payoutRequest.upsert({
        where: { id: p.id },
        update: { amount: p.amount, status: p.status, date: p.date },
        create: { ...p, userId: user.id },
      });
    }

    // Balance = earnings - fulfilled payout, so the numbers tie out.
    const balance = richHistory ? 450 : 550;
    await prisma.user.update({
      where: { id: user.id },
      data: { walletBalance: balance },
    });

    console.log(
      `Seeded ${user.firstName} ${user.lastName} — balance ${balance}, ` +
        `${payouts.length} payout request(s) (1 pending).`
    );
  }

  console.log(`\nDone. Seeded ${users.length} user(s). Open the Payout Requests screen to test.`);
}

async function clean() {
  const payouts = await prisma.payoutRequest.deleteMany({
    where: { id: { startsWith: PAYOUT_ID_PREFIX } },
  });
  const txns = await prisma.transaction.deleteMany({
    where: { id: { startsWith: TXN_ID_PREFIX } },
  });

  let restored = 0;
  if (existsSync(sidecar)) {
    const original = JSON.parse(readFileSync(sidecar, 'utf-8')) as Record<
      string,
      number
    >;
    for (const [id, walletBalance] of Object.entries(original)) {
      await prisma.user
        .update({ where: { id }, data: { walletBalance } })
        .then(() => restored++)
        .catch(() => undefined); // user may have been deleted meanwhile
    }
    rmSync(sidecar);
  }

  console.log(
    `Removed ${payouts.count} payout request(s), ${txns.count} transaction(s); ` +
      `restored ${restored} wallet balance(s).`
  );
}

const isClean = process.argv.includes('--clean');

(isClean ? clean() : seed())
  .catch((e) => {
    console.error('SEED ERROR:', e?.message ?? e);
    if (e?.stack) console.error(e.stack);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
