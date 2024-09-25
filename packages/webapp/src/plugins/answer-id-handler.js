/**
 * Plugin to check for journey-start-answer-id query param. If present, it stores its value then redirects to the page
 * without the query params. We use this to identify if the user came from a specific answer on check and submit.
*/

import constants from '../utils/constants.js'

const answerIdHandler = {
  plugin: {
    name: 'answer-id-handler',

    register: (server, _options) => {
      server.ext('onPreResponse', async (request, h) => {
        if (request.path.includes('/public/')) {
          return h.continue
        }

        // If we have a journey-start-answer-id query param then store its value on the and remove it from the url
        if (request.query['journey-start-answer-id']) {
          // We treat JOURNEY_START_ANSWER_ID as a call stack so we need to retrieve the existing value or initialise a new one
          const callStack = request.yar.get(constants.redisKeys.JOURNEY_START_ANSWER_ID) || []
          callStack.push(request.query['journey-start-answer-id'])
          request.yar.set(constants.redisKeys.JOURNEY_START_ANSWER_ID, callStack)

          // We have to manually commit yar changes inside an onPreResponse handler
          await request.yar.commit(h)

          const url = new URL(request.url)
          url.searchParams.delete('journey-start-answer-id')
          return h.redirect(url.toString())
        }

        // If the user breaks out of the journey (for example, by clicking the service name in the header) then we want
        // to clear journey-start-answer-id to ensure the user isn't taken to an answer that is no longer relevant when
        // they next visit the page they came from. We check to see if they're visiting a page outside of any regular
        // journey (as defined in constants.answerIdClearRoutes) and clear journey-start-answer-id if so.
        if (constants.answerIdClearRoutes.includes(request.path)) {
          request.yar.clear(constants.redisKeys.JOURNEY_START_ANSWER_ID)
          await request.yar.commit(h)
        }

        // We only need to check if the user came from a specific answer on pages specified in constants.answerIdRoutes
        if (!constants.answerIdRoutes.includes(request.path)) {
          return h.continue
        }

        const callStack = request.yar.get(constants.redisKeys.JOURNEY_START_ANSWER_ID) || []
        if (callStack.length === 0) {
          return h.continue
        }

        // Pop the most recent id off the stack and write the resulting stack back
        const journeyStartAnswerId = callStack.pop()
        request.yar.set(constants.redisKeys.JOURNEY_START_ANSWER_ID, callStack)
        await request.yar.commit(h)

        const url = new URL(request.url)
        url.hash = `#${journeyStartAnswerId}`
        return h.redirect(url.toString())
      })
    }
  }
}

export default answerIdHandler
