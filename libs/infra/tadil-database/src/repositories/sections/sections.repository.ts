import { Section, SectionsRepository } from '@tadil-sections';
import { DbClient } from '../../dbClient.js';
export class PrismaSectionsRepository implements SectionsRepository {
  constructor(private readonly _db: DbClient) {}

  async getSectionById(id: string): Promise<Section | undefined> {
    const section = await this._db.section.findUnique({
      where: { id },
    });

    if (!section) return undefined;
    return section;
  }

  async createSection(section: Section): Promise<void> {
    await this._db.section.create({
      data: section,
    });
  }

  async updateSection(section: Section): Promise<void> {
    await this._db.section.update({
      where: { id: section.id },
      data: section,
    });
  }

  async deleteSection(id: string): Promise<void> {
    await this._db.section.delete({
      where: { id },
    });
  }
}
