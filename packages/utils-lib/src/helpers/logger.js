import pino from 'pino'

const debug = 'debug'
const error = 'error'
const fatal = 'fatal'
const info = 'info'
const silent = 'silent'
const trace = 'trace'
const warn = 'warn'

const logLevels = {
  trace,
  debug,
  info,
  warn,
  error,
  fatal,
  silent
}

const logLevel = (process.env.LOG_LEVEL || logLevels.warn).toLowerCase()
const loggerOptions = {
  level: logLevels[logLevel] || logLevels.warn,
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers'],
    remove: true
  }
}

if (process.env.NODE_ENV === 'development') {
  loggerOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
}

const logger = pino(loggerOptions)

export default logger
