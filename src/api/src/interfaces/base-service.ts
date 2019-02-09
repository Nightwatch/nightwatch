export interface BaseService<T, IDColumnType> {
  create(model: T): Promise<void>
  delete(id: IDColumnType): Promise<void>
  find(): Promise<T[]>
  findById(id: IDColumnType): Promise<T | undefined>
  update(id: IDColumnType, model: T): Promise<void>
}
