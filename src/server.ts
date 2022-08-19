require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
import app from './app';
import config from './config';
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
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Connect to a redis client and subscribe to channel
(async () => {
  await subscribeClient.connect();
  await subscribeClient.subscribe(
    config.channelName,
    async (message: string) => {
      console.log({ message });
      const pollId = await popPollQueue();
      console.log({ pollId });
      const pollBox = await getPollBox(pollId);
      console.log({ pollBox });
      io.emit('poll_update', { entityId: pollId, pollBox });
    }
  );
})();

server.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`);
});
