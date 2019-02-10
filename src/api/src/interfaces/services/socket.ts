import { Event } from '../../constants'

export interface SocketService {
  readonly send: (event: Event, content: any) => void
}
