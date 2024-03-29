export interface BaseService<T, IDColumnType> {
  create(model: T): Promise<T>
  delete(id: IDColumnType): Promise<void>
  find(): Promise<ReadonlyArray<T>>
  findById(id: IDColumnType): Promise<T | undefined>
  update(id: IDColumnType, model: T): Promise<T>
}
