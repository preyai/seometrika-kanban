import io from 'socket.io-client'
import socketio from '@feathersjs/socketio-client'
import { createClient } from 'kanban-api'
import authentication from '@feathersjs/authentication-client'


export const apiPath = 'http://localhost:3030'

const connection = socketio(io(apiPath))

const client = createClient(connection)

client.configure(authentication())

export default client
