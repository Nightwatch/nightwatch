import { Request, Response } from 'express'

export interface BaseController<T, IDColumnType> {
  find: (request: Request, response: Response) => Promise<T[]>
  findById: (id: IDColumnType, ...args: any[]) => Promise<T | undefined>
  create: (item: T, ...args: any[]) => Promise<T | undefined>
  updateById: (id: IDColumnType, item: T, ...args: any[]) => Promise<T>
  deleteById: (id: IDColumnType, request: Request, response: Response) => Promise<T | undefined>
}
