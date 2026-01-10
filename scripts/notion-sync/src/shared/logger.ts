import chalk from 'chalk';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  private context: string;
  private static level: LogLevel = LogLevel.INFO;

  constructor(context: string) {
    this.context = context;
  }

  static setLevel(level: LogLevel): void {
    Logger.level = level;
  }

  static getLevel(): LogLevel {
    return Logger.level;
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.context}] ${message}`;
  }

  debug(message: string, data?: unknown): void {
    if (Logger.level <= LogLevel.DEBUG) {
      console.log(chalk.gray(this.formatMessage('DEBUG', message)));
      if (data) console.log(chalk.gray(JSON.stringify(data, null, 2)));
    }
  }

  info(message: string, data?: unknown): void {
    if (Logger.level <= LogLevel.INFO) {
      console.log(chalk.blue(this.formatMessage('INFO', message)));
      if (data) console.log(chalk.blue(JSON.stringify(data, null, 2)));
    }
  }

  warn(message: string, data?: unknown): void {
    if (Logger.level <= LogLevel.WARN) {
      console.log(chalk.yellow(this.formatMessage('WARN', message)));
      if (data) console.log(chalk.yellow(JSON.stringify(data, null, 2)));
    }
  }

  error(message: string, error?: Error | unknown): void {
    if (Logger.level <= LogLevel.ERROR) {
      console.error(chalk.red(this.formatMessage('ERROR', message)));
      if (error) {
        if (error instanceof Error) {
          console.error(chalk.red(error.stack || error.message));
        } else {
          console.error(chalk.red(JSON.stringify(error, null, 2)));
        }
      }
    }
  }

  success(message: string): void {
    console.log(chalk.green(this.formatMessage('SUCCESS', message)));
  }
}
