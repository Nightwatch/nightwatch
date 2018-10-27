export interface BaseService<T, IDColumnType> {
  find: () => Promise<T[]>
  findById: (id: IDColumnType) => Promise<T | undefined>
  create: (model: T) => Promise<T>
  update: (id: IDColumnType, model: T) => Promise<T>
  delete: (id: IDColumnType) => Promise<T | undefined>
}
