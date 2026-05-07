import type { DisplaySectionDTO } from "./displaySection.dto";

export interface DisplayModelImageDTO {
  id: string;
  fileId: string;
  imageBase64String: string;
  sections: DisplaySectionDTO[];
}
