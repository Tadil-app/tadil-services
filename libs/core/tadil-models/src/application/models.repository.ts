export interface ModelsRepository {
    getModelById(id: string): Promise<any>
    createModel(data: any): Promise<any>
    updateModel(data: any): Promise<any>
    deleteModel(id: string): Promise<any>
}