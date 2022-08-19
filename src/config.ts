interface IConfig {
  port: string;
  corsOptions: any;
  redisConnectionString: string;
  channelName: string;
}
const config: IConfig = {
  port: process.env.PORT || '3000',
  corsOptions: { origin: '*' },
  redisConnectionString: process.env.REDIS_CONNECTION_STRING || '',
  channelName: process.env.CHANNEL_NAME || 'channel:poll',
};

export default config;
