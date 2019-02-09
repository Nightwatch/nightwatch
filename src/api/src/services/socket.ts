import { getSocketServer } from '../utilities'
import { injectable } from 'inversify'
import { SocketService as ISocketService } from '../interfaces'

/**
 * Socket service for emitting live updates to clients.
 *
 * @class SocketService
 */
@injectable()
export class SocketService implements ISocketService {
  public send(event: string, content: any) {
    try {
      getSocketServer().emit(event, content)
    } catch (err) {
      // swallow
    }
  }
}
