import { Section } from './section.model';

export interface SectionsRepository {
  getSectionById(id: string): Promise<Section | undefined>;
  createSection(section: Section): Promise<void>;
  updateSection(section: Section): Promise<void>;
  deleteSection(id: string): Promise<void>;
}
