import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from './config';
import AppRes from './types/AppRes';
import redis from './redis';
import subscribeClient from './redis/subscribeClient';
import onPollUpdate from './redis/service/onPollUpdate';

// Create Express server
const app = express();

// Connect to redis and subscribe to channel
(async () => {
  await redis.connect();
  await subscribeClient.connect();
  await subscribeClient.subscribe(config.channelName, onPollUpdate);
})();

// Set PORT
app.set('port', config.port);

// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(morgan('dev'));

// Enable CORS
app.use(cors(config.corsOptions));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// 404 Handler
app.use(function (_, res, next) {
  const status = 404;
  const message = 'Resource not found';
  const errorResponse: AppRes = {
    data: [],
    isError: true,
    errMsg: message,
  };
  res.status(status).send(errorResponse);
});

// Server Error 500 Handler
// Calling next(error) in any of the routes will call this function
app.use(
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // Incase of 500 Server Error
    console.error(error);
    const status = 500;
    const message = error ? JSON.stringify(error) : 'API Server Error';
    const errorResponse: AppRes = {
      data: [],
      isError: true,
      errMsg: message,
    };
    res.status(status).send(errorResponse);
  }
);

export default app;
