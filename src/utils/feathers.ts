import io from 'socket.io-client'
import socketio from '@feathersjs/socketio-client'
import authentication from '@feathersjs/authentication-client'
import { createClient } from 'kanban-api'


export const apiPath = 'http://80.78.247.239:3030'

const connection = socketio(io(apiPath))

const client = createClient(connection)

client.configure(authentication())

export default client
