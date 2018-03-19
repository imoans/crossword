import GameService from '../domain/game-service'
import GameForClient from '../domain/game-for-client'
import Game from '../domain/game'
import Player from '../domain/player'
import OtherPlayer from '../domain/other-player'
import DomainState from '../domain/redux/server/state'
import store from './redux/store'
import domainActions from '../domain/redux/server/actions'
import actions from './redux/actions'

const server = require('http').createServer()
const io = require('socket.io').listen(server)

const domainState = new DomainState()
store.dispatch(domainActions.setState(domainState))
const getDomain = () => store.getState().domain

io.on('connection', (client) => {
  client.on('updateGame', (plainGameForClient) => {
    store.dispatch(actions.updateGame(plainGameForClient))
  })

  client.on('addPlayer', (playerName) => {
    store.dispatch(actions.addPlayer(playerName, client.id))
  })

  client.on('startGame', (pointToPutFirstCard) => {
    store.dispatch(actions.startGame(pointToPutFirstCard))
  })

  client.on('drawCard', () => {
    store.dispatch(actions.drawCard(client.id))
  })

  client.on('confirmPutCard', async (payload) => {
    await store.dispatch(actions.confirmPutCard({
      ...payload,
      clientId: client.id,
    }))
  })

  client.on('disconnect', () => {
    store.dispatch(actions.disconnect(client.id))
  })
})

server.on('request', (req, res) => {
  console.log('request')
})

server.listen(8000)
console.log('listening on 8000')

export default io
