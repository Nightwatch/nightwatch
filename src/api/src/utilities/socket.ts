import * as socketio from 'socket.io'
import { ApiEvent } from '../constants'

const io: socketio.Server

export function init(server: socketio.Server) {
  io = server

  io.on('connection', client => {
    client.emit(ApiEvent.INFO, 'Successfully connected to the API')
  })
}

export function getSocketServer() {
  return io
}
