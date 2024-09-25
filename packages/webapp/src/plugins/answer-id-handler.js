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
        // We don't need to handle public assets
        if (request.path.includes('/public/')) {
          return h.continue
        }

        // We only need to handle GET requests
        if (request.method !== 'get') {
          return h.continue
        }

        // When we remove the query param or add the anchor to the url, a new request is generated. We therefore check
        // to see if we've already handled this request
        if (request.yar.get(constants.redisKeys.JOURNERY_START_ANSWER_ID_HANDLED, true)) {
          // The `true` flag clears the key after reading, and we have to manually commit yar changes inside an
          // onPreResponse handler
          await request.yar.commit(h)

          return h.continue
        }

        // We treat JOURNEY_START_ANSWER_ID as a call stack so we need to retrieve the existing array or initialise a
        // new one before we can push the new value
        const callStack = request.yar.get(constants.redisKeys.JOURNEY_START_ANSWER_ID) || []

        if (request.query['journey-start-answer-id']) {
          callStack.push(request.query['journey-start-answer-id'])
          request.yar.set(constants.redisKeys.JOURNEY_START_ANSWER_ID, callStack)
          request.yar.set(constants.redisKeys.JOURNERY_START_ANSWER_ID_HANDLED, true)
          await request.yar.commit(h)

          const url = new URL(request.url)
          url.searchParams.delete('journey-start-answer-id')
          return h.redirect(url.toString())
        }

        // Check to see if the user is visiting a page outside of any regular journey and clear journey-start-answer-id
        // if so. This removes stale data if the user "breaks out" the journey (for example, by clicking the service
        // name in the header)
        if (constants.answerIdClearRoutes.includes(request.path)) {
          request.yar.clear(constants.redisKeys.JOURNEY_START_ANSWER_ID)
          await request.yar.commit(h)
          return h.continue
        }

        // Only proceed if this is a tasklist-like page, as specified in `answerIdRoutes`
        if (!constants.answerIdRoutes.includes(request.path)) {
          return h.continue
        }

        // Only proceed if there are items in the call stack
        if (callStack.length === 0) {
          return h.continue
        }

        // Pop the most recent id off the stack and write the resulting stack back
        const journeyStartAnswerId = callStack.pop()
        request.yar.set(constants.redisKeys.JOURNEY_START_ANSWER_ID, callStack)

        request.yar.set(constants.redisKeys.JOURNERY_START_ANSWER_ID_HANDLED, true)
        await request.yar.commit(h)

        // Add the anchor id to the url and redirect to the resulting url
        const url = new URL(request.url)
        url.hash = `#${journeyStartAnswerId}`
        return h.redirect(url.toString())
      })
    }
  }
}

export default answerIdHandler
