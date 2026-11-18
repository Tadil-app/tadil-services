import type { PlatformSettings } from '@tadil-common';
import { DbClient } from './dbClient';

/** The admin money rules. The migration inserts the row; the upsert covers a wiped table. */
export async function getPlatformSettings(db: DbClient): Promise<PlatformSettings> {
  const { id: _id, ...settings } = await db.platformSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  return settings;
}
