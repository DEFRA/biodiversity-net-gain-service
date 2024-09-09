/**
 * Plugin to check for journey-start-section-id query param. If present, it stores its value then redirects to the page
 * without the query params. We use this to identify if the user came from a specific section on check and submit.
*/

import constants from '../utils/constants.js'

export default {
  plugin: {
    name: 'section-id-handler',

    register: (server, _options) => {
      server.ext('onPreResponse', async (request, h) => {
        if (request.path.includes('/public/')) {
          return h.continue
        }

        // If we have a journey-start-section-id query param then store its value and remove it from the url
        if (request.query['journey-start-section-id']) {
          request.yar.set(constants.redisKeys.JOURNEY_START_SECTION_ID, request.query['journey-start-section-id'])

          // We have to manually commit yar changes inside an onPreResponse handler
          await request.yar.commit(h)

          const url = new URL(request.url)
          url.searchParams.delete('journey-start-section-id')
          return h.redirect(url.toString())
        }

        // We only need to check if the user came from a specific section on check and submit
        if (request.path !== constants.routes.COMBINED_CASE_CHECK_AND_SUBMIT) {
          return h.continue
        }

        const journeyStartSectionId = request.yar.get(constants.redisKeys.JOURNEY_START_SECTION_ID, true)
        if (!journeyStartSectionId) {
          return h.continue
        }

        // The `true` option when reading from yar cleared any existing value; we must manually commit the change inside onPreResponse
        await request.yar.commit(h)

        const url = new URL(request.url)
        url.hash = `#${journeyStartSectionId}`
        return h.redirect(url.toString())
      })
    }
  }
}
