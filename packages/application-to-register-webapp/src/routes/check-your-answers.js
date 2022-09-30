import constants from '../utils/constants.js'
import application from '../utils/application.js'
import { queueMessage } from '../utils/azure-storage.js'
import { handleEvents } from '../utils/azure-signalr.js'
import { logger } from 'defra-logging-facade'

const handlers = {
  get: async (_request, h) => h.view(constants.views.CHECK_YOUR_ANSWERS),
  post: async (request, h) => {
    const config = buildConfig(request.yar.id)
    config.queueConfig.message = application(request.yar)
    // we have a race issue here because we want the route to wait on a signal response, whilst also sending the message.
    // but we can always rely on the processing function to take long enough for signalr event to initiate
    // suspect issue might be present on other signalr awaits?
    // Need to discuss with Paul W.
    try {
      const results = await Promise.all([
        handleEvents(config, [`Processed ${request.yar.id}`]),
        setTimeout(() => { queueMessage(logger, config) }, 200)
      ])
      request.yar.set(constants.redisKeys.GAIN_SITE_REFERENCE, results[0][0].gainSiteReference)
      return h.redirect(constants.routes.CONFIRMATION)
    } catch (err) {
      return h.view(constants.views.CHECK_YOUR_ANSWERS, {
        err: [{
          text: 'There is a problem',
          href: null
        }]
      })
    }
  }
}

const buildConfig = sessionId => {
  const config = {}
  buildQueueConfig(config)
  buildSignalRConfig(sessionId, config)
  return config
}

const buildQueueConfig = config => {
  config.queueConfig = {
    queueName: 'application-queue'
  }
}

const buildSignalRConfig = (sessionId, config) => {
  config.signalRConfig = {
    eventProcessingFunction: null,
    timeout: parseInt(process.env.UPLOAD_PROCESSING_TIMEOUT_MILLIS) || 180000,
    url: `${process.env.SIGNALR_URL}?userId=${sessionId}`
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_YOUR_ANSWERS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_YOUR_ANSWERS,
  handler: handlers.post
}]
