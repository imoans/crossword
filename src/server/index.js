import GameService from '../domain/game-service'
import GameForClient from '../domain/game-for-client'
import Game from '../domain/game'
import Player from '../domain/player'
import OtherPlayer from '../domain/other-player'

const server = require('http').createServer()
const io = require('socket.io').listen(server)

const playerByClientId = {}

io.on('connection', (client) => {
  client.on('addPlayer', (playerName) => {
    playerByClientId[client.id] = playerName
    const players = Object.keys(playerByClientId).map(id => playerByClientId[id])
    io.to(client.id).emit('joined')
    io.emit('addPlayer', players)
  })

  client.on('startGame', (center) => {
    const players = Object.keys(playerByClientId).map(id => new Player({ name: playerByClientId[id] }))
    const game = new Game({ players })
    const gameService = new GameService(game)
    const newGame = gameService.startGame()
    io.emit('inProgress')

    const service = new GameService(newGame)
    const gameForServer = service.dealHands()
    const gameSetFirstCard = new GameService(gameForServer).putFirstCard(center)

    Object.keys(playerByClientId).forEach(id => {
      const yourName = playerByClientId[id]
      const otherPlayers = gameSetFirstCard.players
      .filter(player => player.name !== yourName)
      .map(player => {
        const numberOfHands = player.hands.length
        const name = player.name
        return new OtherPlayer({ name, numberOfHands })
      })

      const gameForClient = new GameForClient({
        playerIdsByOrder: gameSetFirstCard.playerIdsByOrder,
        field: gameSetFirstCard.field,
        progress: gameSetFirstCard.progress,
        you: gameSetFirstCard.getPlayer(yourName),
        otherPlayers,
      })

      io.to(id).emit('dealHands', gameForClient)
    })
  })

  client.on('putCard', (gameForClient) => {
    io.emit('putCard', gameForClient)
  })

  client.on('drawCard', (gameForClient) => {

  })

  client.on('disconnect', () => {
    const playerName = playerByClientId[client.id]
    delete playerByClientId[client.id]
    const playerNames = Object.keys(playerByClientId).map(id => playerByClientId[id])
    io.emit('disconnect', playerName, playerNames)
  })
})

server.on('request', (req, res) => {
  console.log('request')
})

server.listen(8000)
console.log('listening on 8000')
