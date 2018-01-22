
import io from 'socket.io-client'

const SOCKET_SERVER_URL = 'http://localhost:8000'

const socket = io.connect(SOCKET_SERVER_URL);

export default socket
