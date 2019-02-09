import * as socketio from 'socket.io'
import { Events } from '../constants'

let io: socketio.Server

export function init(server: socketio.Server) {
  io = server

  io.on('connection', client => {
    client.emit(Events.info, 'Successfully connected to the API')
  })
}

export function getSocketServer() {
  return io
}
