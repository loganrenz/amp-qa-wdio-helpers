import winston from 'winston'
import path from 'path'

export class Logging {
  //Todo make this configurable elsewhere
  static globalLogLevel = 'debug'
  static loggingDir: string = path.join('results')
  static setGlobalLogLevel = (level: string) => {
    Logging.globalLogLevel = level || 'debug'
    winston.transports.Console.level = this.globalLogLevel
    Logging.allLoggers.forEach(logger => {
      logger.level = this.globalLogLevel
      logger.transports.forEach(transport => {
        transport.level = this.globalLogLevel
      })
    })
  }
  static allLoggers: winston.Logger[] = []

  static setLoggingDir(dir: string) {
    this.loggingDir = dir
  }

  logger: winston.Logger
  constructor() {
    this.logger = Logging.getLogger(this.constructor.name)
  }

  static msgFormat(info: winston.Logform.TransformableInfo) {
    let message
    try {
      message = `${
        typeof info.message === 'object'
          ? `\n${JSON.stringify(info.message, undefined, 2)}`
          : info.message
      }`
    } catch (e) {
      message = `${
        typeof info.message === 'object'
          ? `\n${(info.message, undefined, 2)}`
          : info.message
      }`
    }
    const level = `${`${info.level}`.padStart(18, ' ')} `
    const timestamp = `[${[info.timestamp]}]`.padEnd(20, ' ')
    const label = path.basename(info.label).substring(0, 25).padEnd(27, ' ')
    const format = `${level} ${timestamp} ${label} ${message}`
    return format
  }

  static getLogger(name?: string, level?: string) {
    const customLevels = {
      fine: 5,
      debug: 4,
      info: 2,
      warn: 1,
      error: 0,
    }
    const customColors = {
      fine: 'blue',
      debug: 'blue',
      info: 'green',
      warn: 'yellow',
      error: 'red',
    }

    const logger = winston.createLogger({
      level: level,
      levels: customLevels,
      format: winston.format.combine(winston.format.label({ label: name })),
      defaultMeta: { service: name || this.name || 'user-service' },
      transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        //new winston.transports.File({ filename: `${this.loggingDir}/error.log`, level: 'error' }),
        //new winston.transports.File({ filename: `${this.loggingDir}/combined.log` })
      ],
    })
    winston.addColors(customColors)

    //
    // If we're not in production then log to the `console` with the format:
    // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
    //
    if (process.env.NODE_ENV !== 'production') {
      logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'MM-DD-YY HH:mm:ss' }),
            winston.format.printf(info => this.msgFormat(info))
          ),
          level: level || this.globalLogLevel,
        })
      )
    }
    return logger
  }
}

export function getLogger(filename: string, level?: string) {
  const newLogger = Logging.getLogger(filename, level)
  Logging.allLoggers.push(newLogger)
  return newLogger
}

export function setGlobalLogLevel(level: string) {
  Logging.setGlobalLogLevel(level)
}

declare global {
  export function setGlobalLogLevel(level: string): void
  export function getLogger(
    filename: string,
    level?: string,
    transports?: winston.transport[]
  ): winston.Logger
  export var winston: typeof import('winston')
}

global.winston = winston
global.setGlobalLogLevel = setGlobalLogLevel
global.getLogger = getLogger

