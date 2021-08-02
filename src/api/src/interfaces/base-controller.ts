// tslint:disable:readonly-array

export interface BaseController<T, IDColumnType> {
  readonly find: () => Promise<ReadonlyArray<T>>
  readonly findById: (
    id: IDColumnType,
    ...args: any[]
  ) => Promise<T | undefined>
  readonly create: (item: T, ...args: any[]) => Promise<T | undefined>
  readonly updateById: (
    id: IDColumnType,
    item: T,
    ...args: any[]
  ) => Promise<void>
  readonly deleteById: (id: IDColumnType, ...args: any[]) => Promise<void>
}
