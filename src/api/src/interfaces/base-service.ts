export interface BaseService<T, IDColumnType> {
  find: () => Promise<T[]>
  findById: (id: IDColumnType) => Promise<T | undefined>
  create: (model: T) => Promise<void>
  update: (id: IDColumnType, model: T) => Promise<void>
  delete: (id: IDColumnType) => Promise<void>
}
