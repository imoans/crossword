import store from './redux/store'
import DomainState from '../domain/redux/server/state'
import domainActions from '../domain/redux/server/actions'
import Socket from '../domain/socket/server'
import io from 'socket.io'
import http from 'http'

const server = http.createServer()
const socket = new Socket({
  server,
  socket: io,
  port: 8000,
  dispatch: store.dispatch,
})
store.dispatch(domainActions.setState(new DomainState()))

export default socket
