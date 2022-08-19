interface IConfig {
  port: string;
  corsOptions: any;
}
const config: IConfig = {
  port: process.env.PORT || '3000',
  corsOptions: { origin: '*' },
};

export default config;
