require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
import app from './app';
import constants from './constants';
import subscribeClient from './redis/subscribeClient';
import popPollQueue from './redis/service/popPollQueue';
import getPollBox from './redis/service/getPollBox';

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
  const { UPDATE_ROOM } = constants.SOCKET_EVENTS;
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on(UPDATE_ROOM, (data: any) => {
    socket.leaveAll(); // Removes the user from all rooms because a user can only be in one room at a time.
    socket.join(data.pollId); // pollId is the room name
  });
});

// Connect to a redis client and subscribe to channel
(async () => {
  const { CHANNEL_NAME } = constants;
  const { POLL_UPDATE } = constants.SOCKET_EVENTS;
  await subscribeClient.connect();
  await subscribeClient.subscribe(CHANNEL_NAME, async (message: string) => {
    console.log({ message });
    const pollId = await popPollQueue();
    console.log({ pollId });
    const pollBox = await getPollBox(pollId);
    console.log({ pollBox });
    io.to(pollId).emit(POLL_UPDATE, { entityId: pollId, pollBox });
  });
})();

server.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`);
});
