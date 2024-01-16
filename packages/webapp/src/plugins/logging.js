import { logger } from '@defra/bng-utils-lib'
import Pino from 'hapi-pino'

const logging = {
  plugin: Pino,
  options: {
    logPayload: true,
    instance: logger
  }
}

export default logging
