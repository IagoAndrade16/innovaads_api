import pino from 'pino';
import { singleton } from 'tsyringe';
import { Environment } from './Enviroment';

@singleton()
export class Logger {
  private logger = pino({
    level: Environment.vars.APPLICATION_LOG_LEVEL,
    enabled: Environment.isProduction() || Environment.getType() === 'test',
  });
  
  info(message: string) {
    this.logger.info(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  trace(message: string) {
    this.logger.trace(message);
  }

  fatal(message: string) {
    this.logger.fatal(message);
  }
}