import { Event } from '../../constants'

export interface SocketService {
  send: (event: Event, content: any) => void
}
