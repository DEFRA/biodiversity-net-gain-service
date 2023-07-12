import url from 'url'
import constants from '../../utils/constants.js'
import { postJson } from '../../utils/http.js'

const handlers = {
  get: async (request, h) => {
    // Store referrer value
    request.headers.referer && request.yar.set(constants.redisKeys.REGISTRATION_SAVED_REFERER, new url.URL(request.headers.referer).pathname)

    // Email must be present to store application session
    if (!request.yar.get(constants.redisKeys.EMAIL_VALUE)) {
      throw new Error('No email present for saving application Session')
    }

    // Save application and store returned gain site reference
    const applicationReference = await postJson(`${constants.AZURE_FUNCTION_APP_URL}/saveapplicationsession`, request.yar._store)

    // Clear out user session
    request.yar.reset()

    // Return gain site reference
    return h.view(constants.views.REGISTRATION_SAVED, { applicationReference })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.REGISTRATION_SAVED,
  handler: handlers.get
}]
