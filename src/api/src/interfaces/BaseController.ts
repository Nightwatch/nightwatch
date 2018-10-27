export interface BaseController<T, IDColumnType> {
  find: (...args: any[]) => Promise<T[]>
  findById: (id: IDColumnType, ...args: any[]) => Promise<T | undefined>
  create: (item: T, ...args: any[]) => Promise<T | undefined>
  updateById: (id: IDColumnType, item: T, ...args: any[]) => Promise<T | undefined>
  deleteById: (id: IDColumnType, ...args: any[]) => Promise<T | undefined>
}
