require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
import app from './app';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    // credentials: true
  },
});

io.on('connection', (socket: any) => {
  console.log({ socket, headers: socket.handshake.headers });
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`);
});
