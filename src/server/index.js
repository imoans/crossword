import GameService from '../domain/game-service'
import GameForClient from '../domain/game-for-client'
import Game from '../domain/game'
import Player from '../domain/player'
import OtherPlayer from '../domain/other-player'
import DomainState from '../domain/redux/server/state'
import store from './redux/store'
import domainActions from '../domain/redux/server/actions'
import actions from './redux/actions'

const port = 8000
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

  client.on('skipTurn', () => {
    store.dispatch(actions.skipTurn(client.id))
  })

  client.on('cancelPuttingCard', () => {
    store.dispatch(actions.cancelPuttingCard(client.id))
  })

  client.on('confirmPutCard', async (word) => {
    await store.dispatch(actions.confirmPutCard(word, client.id))
  })

  client.on('disconnect', () => {
    store.dispatch(actions.disconnect(client.id))
  })
})

server.on('request', (req, res) => {})

server.listen(port)
console.log(`listening on ${port}`)

export default io
