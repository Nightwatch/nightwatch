export interface SocketService {
  send: (event: string, content: any) => void
}
