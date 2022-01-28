import Pino from 'hapi-pino'

const logging = {
  plugin: Pino,
  options: {
    logPayload: true,
    level: 'warn'
  }
}

export default logging
