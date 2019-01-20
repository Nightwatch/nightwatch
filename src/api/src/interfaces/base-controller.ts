export interface BaseController<T, IDColumnType> {
  find: (...args: any[]) => Promise<T[]>
  findById: (id: IDColumnType, ...args: any[]) => Promise<T | undefined>
  create: (item: T, ...args: any[]) => Promise<void>
  updateById: (id: IDColumnType, item: T, ...args: any[]) => Promise<void>
  deleteById: (id: IDColumnType, ...args: any[]) => Promise<void>
}
