// @flow

import GameService from '../game-service'
import GameForClient from '../game-for-client'
import Game from '../game'
import Player from '../player'
import OtherPlayer from '../other-player'
import { DOMAIN_EVENTS, NETWORK_EVENTS } from './events'
import isWordExisted from '../../server/util/is-word-existed'
import domainActions from '../redux/server/actions'

type Params = {
  server: any,
  socket: any,
  port: number,
  dispatch: any,
}

export default class Socket {
  constructor(params: Params) {
    const { server, socket, port, dispatch } = params
    this.server = server
    this.listen(port)
    this.dispatch = dispatch

    this.io = socket.listen(this.server)
    this.io.on('connection', (client) => {
      this.client = client
      this.registerEvent()
    })
  }

  server: any
  io: any
  client: any

  listen(port: number) {
    if (this.server.listening) return
    this.server.listen(port)
  }

  registerEvent() {
    this.client.on(DOMAIN_EVENTS.addPlayer, this.addPlayer)
    this.client.on(DOMAIN_EVENTS.startGame, this.startGame)
    this.client.on(DOMAIN_EVENTS.putCard, this.putCard)
    this.client.on(DOMAIN_EVENTS.skipTurn, this.skipTurn)
    this.client.on(DOMAIN_EVENTS.cancelPuttingCard, this.cancelPuttingCard)
    this.client.on(DOMAIN_EVENTS.confirmPutCard, this.confirmPutCard)
    this.client.on(NETWORK_EVENTS.disconnect, this.disconnect)
  }

  emitGame(clientId: string, game: GameForClient) {
    this.io.to(clientId).emit(DOMAIN_EVENTS.updateGame, gameForClient)
  }

  addPlayer(plainPlayer: string) {
    this.dispatch(domainActions.addPlayer(plainPlayer))
  }

  startGame(pointToPutFirstCard: Point) {
    this.dispatch(domainActions.startGame(pointToPutFirstCard))
  }

  putCard({ card, point, playerId }) {
    this.dispatch(domainActions.putCard(card, point, playerId))
  }

  skipTurn(playerId: string) {
    this.dispatch(domainActions.skipTurn(playerId))
  }

  cancelPuttingCard(playerId: string) {
    this.dispatch(domainActions.cancelPuttingCard(playerId))
  }

  failedToPutCard(word, string) {
    this.server.emit(DOMAIN_EVENTS.failedToPutCard, word)
  }

  async confirmPutCard(word: string, playerId: string) {
    // TODO
    const isWordValid = await isWordExisted(word)
    if (!isWordValid) this.failedToPutCard(word)

    await this.dispatch(domainActions.confirmPutCard(word, playerId))
  }

  disconnect() {
    this.dispatch(domainActions.disconnect())
  }
}
