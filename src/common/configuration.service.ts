export class Configuration {
  static get envs() {
    return () => ({
      enviromment: process.env.NODE_ENV || 'Development',
      timezone: 'America/Sao_Paulo',
      port: process.env.NODE_PORT || 8000,
      mongoDbUri: process.env.MONGODB_URI,
      loggingLevel: process.env.LOGGING_MINIMUM_LEVEL || 'info',
    });
  }
}
