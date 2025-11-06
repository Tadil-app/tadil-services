export interface AlterationsRepository {
  getAlterationById(id: string): Promise<any>;
  createAlteration(data: any): Promise<any>;
  updateAlteration(data: any): Promise<any>;
  deleteAlteration(id: string): Promise<any>;
}
