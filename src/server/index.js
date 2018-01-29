const server = require('http').createServer()
const io = require('socket.io').listen(server)

io.on('connection', (client) => {
  client.on('addUser', (userName) => {
    io.emit('addUser', userName)
  })
  client.on('disconnect', () => {
    console.log('disconnect')
  })
})

server.on('request', (req, res) => {
  console.log('request')
})

server.listen(8000)
console.log('listening on 8000')
